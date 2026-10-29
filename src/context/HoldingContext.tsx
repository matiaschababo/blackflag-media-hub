'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Channel,
  Episode,
  Clip,
  AppMode,
  ContentTab,
  MetricsTab,
  Platform,
  PublicationRecord,
  RetentionDataPoint,
  ABVariant,
} from '../types';
import {
  INITIAL_CHANNELS,
  INITIAL_EPISODES,
  INITIAL_CLIPS,
  RETENTION_CURVES_BY_CHANNEL,
  PLATFORM_COMPARISONS_BY_CHANNEL,
  AB_VARIANTS_BY_CHANNEL,
} from '../data/mockData';
import {
  supabase,
  getChannelsFromSupabase,
  getEpisodesFromSupabase,
  getClipsFromSupabase,
  syncClipStatusToSupabase,
} from '../lib/supabase';

interface HoldingContextType {
  channels: Channel[];
  selectedChannelId: string;
  currentChannel: Channel;
  episodes: Episode[];
  clips: Clip[];
  allClips: Clip[];
  filteredClips: Clip[];
  retentionData: RetentionDataPoint[];
  platformData: Array<{ platform: string; views: number; hours: number; engagementRate: number }>;
  abVariants: ABVariant[];
  mode: AppMode;
  contentTab: ContentTab;
  metricsTab: MetricsTab;
  isDbConnected: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  copyShareLink: () => Promise<boolean>;
  setSelectedChannelId: (id: string) => void;
  setMode: (mode: AppMode) => void;
  setContentTab: (tab: ContentTab) => void;
  setMetricsTab: (tab: MetricsTab) => void;
  updateClipStatus: (clipId: string, platform: Platform, status: PublicationRecord['status'], url?: string) => void;
  addChannel: (channel: Partial<Channel> & { name: string; niche: string }) => void;
  triggerRippleShift: (clipId: string) => void;
  refreshFromDb: () => Promise<void>;
}

const HoldingContext = createContext<HoldingContextType | undefined>(undefined);

export const HoldingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');
  const [episodes, setEpisodes] = useState<Episode[]>(INITIAL_EPISODES);
  const [clips, setClips] = useState<Clip[]>(INITIAL_CLIPS);
  const [mode, setMode] = useState<AppMode>('content_manager');
  const [contentTab, setContentTab] = useState<ContentTab>('overview');
  const [metricsTab, setMetricsTab] = useState<MetricsTab>('overview');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  // Sync URL query params seamlessly without page reloads
  const syncUrl = useCallback((chId: string, appMode: AppMode, tab: string) => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('channel', chId);
      params.set('mode', appMode);
      params.set('tab', tab);
      const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ ...window.history.state, as: newRelativePathQuery, url: newRelativePathQuery }, '', newRelativePathQuery);

      localStorage.setItem('holding_last_channel', chId);
      localStorage.setItem('holding_last_mode', appMode);
      localStorage.setItem('holding_last_tab', tab);
    } catch {
      // ignore
    }
  }, []);

  // Initial load from URL search params with fallback to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlChannel = params.get('channel') || localStorage.getItem('holding_last_channel');
      const urlMode = (params.get('mode') || localStorage.getItem('holding_last_mode')) as AppMode;
      const urlTab = params.get('tab') || localStorage.getItem('holding_last_tab');

      if (urlChannel) {
        setSelectedChannelId(urlChannel);
      }
      if (urlMode === 'content_manager' || urlMode === 'metrics_hub') {
        setMode(urlMode);
        if (urlTab) {
          if (urlMode === 'content_manager') {
            setContentTab(urlTab as ContentTab);
          } else {
            setMetricsTab(urlTab as MetricsTab);
          }
        }
      } else if (urlTab) {
        setContentTab(urlTab as ContentTab);
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen to browser Back/Forward navigation (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const ch = params.get('channel');
      const md = params.get('mode') as AppMode;
      const tb = params.get('tab');
      if (ch) setSelectedChannelId(ch);
      if (md === 'content_manager' || md === 'metrics_hub') setMode(md);
      if (tb) {
        if (md === 'content_manager') setContentTab(tb as ContentTab);
        else if (md === 'metrics_hub') setMetricsTab(tb as MetricsTab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Wrapped state setters that keep URL in sync
  const handleSetSelectedChannel = useCallback((id: string) => {
    setSelectedChannelId(id);
    const activeTab = mode === 'content_manager' ? contentTab : metricsTab;
    syncUrl(id, mode, activeTab);
  }, [mode, contentTab, metricsTab, syncUrl]);

  const handleSetMode = useCallback((m: AppMode) => {
    setMode(m);
    const activeTab = m === 'content_manager' ? contentTab : metricsTab;
    syncUrl(selectedChannelId, m, activeTab);
  }, [selectedChannelId, contentTab, metricsTab, syncUrl]);

  const handleSetContentTab = useCallback((t: ContentTab) => {
    setContentTab(t);
    syncUrl(selectedChannelId, 'content_manager', t);
  }, [selectedChannelId, syncUrl]);

  const handleSetMetricsTab = useCallback((t: MetricsTab) => {
    setMetricsTab(t);
    syncUrl(selectedChannelId, 'metrics_hub', t);
  }, [selectedChannelId, syncUrl]);

  // One-click shareable link
  const copyShareLink = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showToast('¡Enlace de esta vista copiado! Tus compañeros abrirán exactamente este canal y pestaña.');
      return true;
    } catch (err) {
      console.error('Error copying link:', err);
      return false;
    }
  }, [showToast]);

  // Sync data from Supabase
  const refreshFromDb = useCallback(async () => {
    try {
      const [dbChannels, dbEpisodes, dbClips] = await Promise.all([
        getChannelsFromSupabase(),
        getEpisodesFromSupabase(),
        getClipsFromSupabase(),
      ]);

      if (dbChannels && dbChannels.length > 0) {
        setChannels(dbChannels);
      }
      if (dbEpisodes && dbEpisodes.length > 0) {
        setEpisodes(dbEpisodes);
      }
      if (dbClips && dbClips.length > 0) {
        setClips(dbClips);
      }

      if (dbChannels || dbClips) {
        setIsDbConnected(true);
      }
    } catch (err) {
      console.warn('Fallback to local state (Supabase sync failed):', err);
    }
  }, []);

  // Initial load & real-time subscription
  useEffect(() => {
    refreshFromDb();

    // Subscribe to real-time changes on clips
    const channelSub = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clips' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = payload.new as any;
            setClips((prev) =>
              prev.map((c) =>
                c.id === updated.id
                  ? {
                      ...c,
                      platforms: updated.platforms || c.platforms,
                      isUrgent: updated.is_urgent ?? c.isUrgent,
                      priorityOrder: updated.priority_order ?? c.priorityOrder,
                      views: updated.views ?? c.views,
                    }
                  : c
              )
            );
          } else {
            refreshFromDb();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSub);
    };
  }, [refreshFromDb]);

  const GLOBAL_CHANNEL: Channel = {
    id: 'all',
    name: 'Todos los Canales',
    shortCode: 'ALL',
    niche: 'Holding Digital Multicanal',
    audience: 'Audiencia Digital Global (B2B, Kids & Sandbox)',
    accentColor: '#38bdf8',
    badgeBg: 'bg-sky-950/40',
    badgeBorder: 'border-sky-600/40',
    badgeText: 'text-sky-400',
    avatarUrl: '/channels/blackflag-logo.png',
    bannerUrl: '/channels/blackflag-banner.png',
    shortsPerDay: 7,
    timeSlots: ['10:00 ART', '14:00 ART', '15:00 ART', '16:00 ART', '20:00 ART', '21:00 ART', '22:00 ART'],
    accounts: {
      youtube: 'Holding Digital (3 Canales)',
      instagram: '@blackflagblueprint',
      facebook: 'Holding Network',
      tiktok: '@levelpopstudio',
      x: '@blackflagprint',
    },
    stats: {
      subscribers: channels.reduce((acc, c) => acc + (c.stats?.subscribers || 0), 0) + 3,
      totalViews: channels.reduce((acc, c) => acc + (c.stats?.totalViews || 0), 0) + 1939,
      watchHours: channels.reduce((acc, c) => acc + (c.stats?.watchHours || 0), 0) + 18.4,
      avgAvd: 78.4,
      estimatedRevenue: 0,
      rpm: 0,
    },
  };

  const currentChannel =
    selectedChannelId === 'all'
      ? GLOBAL_CHANNEL
      : channels.find((c) => c.id === selectedChannelId) || channels[0];

  const filteredClips =
    selectedChannelId === 'all'
      ? clips
      : clips.filter((c) => c.channelId === selectedChannelId);

  // Dynamic channel-specific metrics
  const retentionData =
    RETENTION_CURVES_BY_CHANNEL[selectedChannelId] || RETENTION_CURVES_BY_CHANNEL['blackflag'] || [];
  const platformData =
    PLATFORM_COMPARISONS_BY_CHANNEL[selectedChannelId] || PLATFORM_COMPARISONS_BY_CHANNEL['blackflag'];
  const abVariants =
    AB_VARIANTS_BY_CHANNEL[selectedChannelId] || AB_VARIANTS_BY_CHANNEL['blackflag'];

  const updateClipStatus = (
    clipId: string,
    platform: Platform,
    status: PublicationRecord['status'],
    url?: string
  ) => {
    let updatedPlatforms: Record<Platform, PublicationRecord> | null = null;

    const updated = clips.map((c) => {
      if (c.id === clipId) {
        const newPlatforms = {
          ...c.platforms,
          [platform]: {
            ...c.platforms[platform],
            status,
            ...(url ? { url } : {}),
            ...(status === 'PUBLISHED' ? { publishedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : {}),
          },
        };
        updatedPlatforms = newPlatforms;
        return {
          ...c,
          platforms: newPlatforms,
        };
      }
      return c;
    });

    setClips(updated);

    if (updatedPlatforms) {
      syncClipStatusToSupabase(clipId, updatedPlatforms);
    }
  };

  const triggerRippleShift = (clipId: string) => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;

    let updatedPlatforms: Record<Platform, PublicationRecord> | null = null;

    const updated = clips.map((c) => {
      if (c.id === clipId) {
        const newPlatforms = {
          ...c.platforms,
          YOUTUBE_SHORT: { ...c.platforms.YOUTUBE_SHORT, status: 'SCHEDULED' as const, slotTime: 'Próximo Turno Inmediato' },
          INSTAGRAM_REEL: { ...c.platforms.INSTAGRAM_REEL, status: 'SCHEDULED' as const, slotTime: 'Próximo Turno Inmediato' },
          FACEBOOK_REEL: { ...c.platforms.FACEBOOK_REEL, status: 'SCHEDULED' as const, slotTime: 'Próximo Turno Inmediato' },
          TIKTOK: { ...c.platforms.TIKTOK, status: 'SCHEDULED' as const, slotTime: 'Próximo Turno Inmediato' },
          X_TWITTER: { ...c.platforms.X_TWITTER, status: 'SCHEDULED' as const, slotTime: 'Próximo Turno Inmediato' },
        };
        updatedPlatforms = newPlatforms;
        return {
          ...c,
          isUrgent: true,
          platforms: newPlatforms,
        };
      }
      return c;
    });

    setClips(updated);

    if (updatedPlatforms) {
      syncClipStatusToSupabase(clipId, updatedPlatforms, true);
    }
  };

  const addChannel = async (data: Partial<Channel> & { name: string; niche: string }) => {
    const id = data.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newChan: Channel = {
      id,
      name: data.name,
      shortCode: data.shortCode || data.name.slice(0, 3).toUpperCase(),
      niche: data.niche,
      audience: data.audience || 'Audiencia Digital Global',
      accentColor: data.accentColor || '#38BDF8',
      badgeBg: 'bg-sky-950/40',
      badgeBorder: 'border-sky-600/40',
      badgeText: 'text-sky-400',
      avatarUrl: data.avatarUrl || '/channels/blackflag-logo.png',
      bannerUrl: data.bannerUrl || '/channels/blackflag-banner.png',
      shortsPerDay: data.shortsPerDay || 2,
      timeSlots: data.timeSlots || ['14:00 ART', '20:00 ART'],
      accounts: {
        youtube: `@${id}`,
        instagram: `@${id}`,
        facebook: data.name,
        tiktok: `@${id}`,
        x: `@${id}`,
      },
      stats: {
        subscribers: 0,
        totalViews: 0,
        watchHours: 0,
        avgAvd: 0,
        estimatedRevenue: 0,
        rpm: 0,
      },
    };

    setChannels((prev) => [...prev, newChan]);
    handleSetSelectedChannel(id);

    try {
      await supabase.from('channels').insert({
        id: newChan.id,
        name: newChan.name,
        short_code: newChan.shortCode,
        niche: newChan.niche,
        audience: newChan.audience,
        accent_color: newChan.accentColor,
        avatar_url: newChan.avatarUrl,
        banner_url: newChan.bannerUrl,
        shorts_per_day: newChan.shortsPerDay,
        time_slots: newChan.timeSlots,
        accounts: newChan.accounts,
        stats: newChan.stats,
      });
    } catch (e) {
      console.warn('Could not persist new channel to Supabase:', e);
    }
  };

  return (
    <HoldingContext.Provider
      value={{
        channels,
        selectedChannelId,
        currentChannel,
        episodes,
        clips,
        allClips: clips,
        filteredClips,
        retentionData,
        platformData,
        abVariants,
        mode,
        contentTab,
        metricsTab,
        isDbConnected,
        toastMessage,
        showToast,
        copyShareLink,
        setSelectedChannelId: handleSetSelectedChannel,
        setMode: handleSetMode,
        setContentTab: handleSetContentTab,
        setMetricsTab: handleSetMetricsTab,
        updateClipStatus,
        addChannel,
        triggerRippleShift,
        refreshFromDb,
      }}
    >
      {children}
    </HoldingContext.Provider>
  );
};

export const useHolding = () => {
  const context = useContext(HoldingContext);
  if (!context) {
    throw new Error('useHolding must be used within a HoldingProvider');
  }
  return context;
};
