'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Channel,
  Episode,
  Clip,
  AppMode,
  ContentTab,
  MetricsTab,
  Platform,
  PlatformFilter,
  ContentFormat,
  ProductionStage,
  PublicationRecord,
  RetentionDataPoint,
  ABVariant,
  GlobalHoldingStats,
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
  selectedPlatform: PlatformFilter;
  setSelectedPlatform: (p: PlatformFilter) => void;
  selectedFormat: ContentFormat;
  setSelectedFormat: (f: ContentFormat) => void;
  selectedStage: ProductionStage;
  setSelectedStage: (s: ProductionStage) => void;
  episodes: Episode[];
  filteredEpisodes: Episode[];
  clips: Clip[];
  allClips: Clip[];
  filteredClips: Clip[];
  globalStats: GlobalHoldingStats;
  retentionData: RetentionDataPoint[];
  platformData: Array<{ platform: string; views: number; hours: number; engagementRate: number }>;
  abVariants: ABVariant[];
  mode: AppMode;
  contentTab: ContentTab;
  metricsTab: MetricsTab;
  isDbConnected: boolean;
  isSyncing: boolean;
  lastSyncedTime: string;
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
  triggerManualSync: () => Promise<void>;
}

const HoldingContext = createContext<HoldingContextType | undefined>(undefined);

export const HoldingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>('ALL');
  const [selectedStage, setSelectedStage] = useState<ProductionStage>('ALL');
  const [episodes, setEpisodes] = useState<Episode[]>(INITIAL_EPISODES);
  const [clips, setClips] = useState<Clip[]>(INITIAL_CLIPS);
  const [mode, setMode] = useState<AppMode>('content_manager');
  const [contentTab, setContentTab] = useState<ContentTab>('overview');
  const [metricsTab, setMetricsTab] = useState<MetricsTab>('overview');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('En tiempo real');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  // Sync URL query params seamlessly without page reloads
  const syncUrl = useCallback(
    (chId: string, appMode: AppMode, tab: string, plat: PlatformFilter, fmt: ContentFormat) => {
      if (typeof window === 'undefined') return;
      try {
        const params = new URLSearchParams(window.location.search);
        params.set('channel', chId);
        params.set('mode', appMode);
        params.set('tab', tab);
        if (plat !== 'ALL') params.set('platform', plat);
        else params.delete('platform');
        if (fmt !== 'ALL') params.set('format', fmt);
        else params.delete('format');

        const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(
          { ...window.history.state, as: newRelativePathQuery, url: newRelativePathQuery },
          '',
          newRelativePathQuery
        );

        localStorage.setItem('holding_last_channel', chId);
        localStorage.setItem('holding_last_mode', appMode);
        localStorage.setItem('holding_last_tab', tab);
      } catch {
        // ignore
      }
    },
    []
  );

  // Initial load from URL search params with fallback to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlChannel = params.get('channel') || localStorage.getItem('holding_last_channel');
      const urlMode = (params.get('mode') || localStorage.getItem('holding_last_mode')) as AppMode;
      const urlTab = params.get('tab') || localStorage.getItem('holding_last_tab');
      const urlPlat = params.get('platform') as PlatformFilter;
      const urlFormat = params.get('format') as ContentFormat;

      if (urlChannel) setSelectedChannelId(urlChannel);
      if (urlPlat) setSelectedPlatform(urlPlat);
      if (urlFormat) setSelectedFormat(urlFormat);

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
      const pl = params.get('platform') as PlatformFilter;
      const fm = params.get('format') as ContentFormat;
      if (ch) setSelectedChannelId(ch);
      if (pl) setSelectedPlatform(pl);
      if (fm) setSelectedFormat(fm);
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
  const handleSetSelectedChannel = useCallback(
    (id: string) => {
      setSelectedChannelId(id);
      const activeTab = mode === 'content_manager' ? contentTab : metricsTab;
      syncUrl(id, mode, activeTab, selectedPlatform, selectedFormat);
    },
    [mode, contentTab, metricsTab, selectedPlatform, selectedFormat, syncUrl]
  );

  const handleSetSelectedPlatform = useCallback(
    (p: PlatformFilter) => {
      setSelectedPlatform(p);
      const activeTab = mode === 'content_manager' ? contentTab : metricsTab;
      syncUrl(selectedChannelId, mode, activeTab, p, selectedFormat);
    },
    [selectedChannelId, mode, contentTab, metricsTab, selectedFormat, syncUrl]
  );

  const handleSetSelectedFormat = useCallback(
    (f: ContentFormat) => {
      setSelectedFormat(f);
      const activeTab = mode === 'content_manager' ? contentTab : metricsTab;
      syncUrl(selectedChannelId, mode, activeTab, selectedPlatform, f);
    },
    [selectedChannelId, mode, contentTab, metricsTab, selectedPlatform, syncUrl]
  );

  const handleSetMode = useCallback(
    (m: AppMode) => {
      setMode(m);
      const activeTab = m === 'content_manager' ? contentTab : metricsTab;
      syncUrl(selectedChannelId, m, activeTab, selectedPlatform, selectedFormat);
    },
    [selectedChannelId, contentTab, metricsTab, selectedPlatform, selectedFormat, syncUrl]
  );

  const handleSetContentTab = useCallback(
    (t: ContentTab) => {
      setContentTab(t);
      syncUrl(selectedChannelId, 'content_manager', t, selectedPlatform, selectedFormat);
    },
    [selectedChannelId, selectedPlatform, selectedFormat, syncUrl]
  );

  const handleSetMetricsTab = useCallback(
    (t: MetricsTab) => {
      setMetricsTab(t);
      syncUrl(selectedChannelId, 'metrics_hub', t, selectedPlatform, selectedFormat);
    },
    [selectedChannelId, selectedPlatform, selectedFormat, syncUrl]
  );

  // One-click shareable link
  const copyShareLink = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showToast('¡Enlace de esta vista copiado! El equipo abrirá exactamente este canal, plataforma y pestaña.');
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
      setIsDbConnected(true);
      const now = new Date();
      setLastSyncedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} hs`);
    } catch (err) {
      console.warn('Operando con datos de resguardo locales:', err);
      setIsDbConnected(false);
    }
  }, []);

  // Manual sync with feedback
  const triggerManualSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Trigger background telemetry endpoint if reachable
      try {
        await fetch('/api/cron/telemetry', { method: 'GET' });
      } catch {
        // fallback to direct db query
      }
      await refreshFromDb();
      showToast('¡Sincronización completada! Métricas, parrilla y stock 100% actualizados.');
    } catch {
      showToast('Sincronizado con estado local seguro.');
    } finally {
      setIsSyncing(false);
    }
  }, [refreshFromDb, showToast]);

  // Initial load
  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb]);

  // Supabase Realtime Listener
  useEffect(() => {
    const channelSub = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clips' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
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

  // Calculate Global Holding Statistics with Mathematical Precision
  const globalStats: GlobalHoldingStats = useMemo(() => {
    const totalChannels = channels.length;
    const uniqueClipsCount = clips.length;
    const uniqueEpisodesCount = episodes.length;
    const totalUniquePieces = uniqueClipsCount + uniqueEpisodesCount;

    const publicationsByPlatform: Record<Platform, number> = {
      YOUTUBE_SHORT: 0,
      INSTAGRAM_REEL: 0,
      TIKTOK: 0,
      FACEBOOK_REEL: 0,
      X_TWITTER: 0,
    };

    let totalPublications = 0;
    let orphanedPiecesCount = 0;

    clips.forEach((c) => {
      let clipPublishedPlatforms = 0;
      (Object.keys(c.platforms) as Platform[]).forEach((plat) => {
        if (c.platforms[plat]?.status === 'PUBLISHED') {
          publicationsByPlatform[plat] = (publicationsByPlatform[plat] || 0) + 1;
          totalPublications++;
          clipPublishedPlatforms++;
        }
      });
      // Orphaned if published on at least 1 network but less than all 5
      if (clipPublishedPlatforms > 0 && clipPublishedPlatforms < 5) {
        orphanedPiecesCount++;
      }
    });

    const arbitrageRatio =
      uniqueClipsCount > 0 ? parseFloat((totalPublications / uniqueClipsCount).toFixed(2)) : 0;

    const totalViews = channels.reduce((acc, c) => acc + (c.stats?.totalViews || 0), 0);
    const totalSubscribers = channels.reduce((acc, c) => acc + (c.stats?.subscribers || 0), 0);
    const totalWatchHours = channels.reduce((acc, c) => acc + (c.stats?.watchHours || 0), 0);

    const virginStock = clips.filter((c) =>
      !Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
    ).length;
    const totalDailyCadence = channels.reduce((acc, c) => acc + (c.shortsPerDay || 2), 0);
    const runwayDays = totalDailyCadence > 0 ? Math.floor(virginStock / totalDailyCadence) : 0;

    const channelMetrics = channels.map((ch) => {
      const chClips = clips.filter((c) => c.channelId === ch.id);
      let chPubs = 0;
      let chVirgin = 0;
      chClips.forEach((c) => {
        const isPub = Object.values(c.platforms).some((p) => p.status === 'PUBLISHED');
        if (!isPub) chVirgin++;
        Object.values(c.platforms).forEach((p) => {
          if (p.status === 'PUBLISHED') chPubs++;
        });
      });
      const chRatio = chClips.length > 0 ? parseFloat((chPubs / chClips.length).toFixed(2)) : 0;
      const chRunway = ch.shortsPerDay > 0 ? Math.floor(chVirgin / ch.shortsPerDay) : 0;

      return {
        channelId: ch.id,
        channelName: ch.name,
        shortCode: ch.shortCode,
        uniquePieces: chClips.length,
        publications: chPubs,
        arbitrageRatio: chRatio,
        virginStock: chVirgin,
        runwayDays: chRunway,
        totalViews: ch.stats?.totalViews || 0,
        subscribers: ch.stats?.subscribers || 0,
      };
    });

    return {
      totalChannels,
      totalUniquePieces,
      uniqueClipsCount,
      uniqueEpisodesCount,
      totalPublications,
      publicationsByPlatform,
      arbitrageRatio,
      orphanedPiecesCount,
      totalViews,
      totalSubscribers,
      totalWatchHours,
      runwayDays,
      channelMetrics,
    };
  }, [channels, clips, episodes]);

  const GLOBAL_CHANNEL: Channel = useMemo(
    () => ({
      id: 'all',
      name: 'Holding Total',
      shortCode: 'ALL',
      niche: 'Holding Digital Multicanal',
      audience: 'Audiencia Consolidada Global (Tier 1 B2B, Kids & Sandbox)',
      accentColor: '#38bdf8',
      badgeBg: 'bg-sky-950/40',
      badgeBorder: 'border-sky-600/40',
      badgeText: 'text-sky-400',
      avatarUrl: '/channels/blackflag-logo.png',
      bannerUrl: '/channels/blackflag-banner.png',
      shortsPerDay: channels.reduce((acc, c) => acc + (c.shortsPerDay || 2), 0),
      timeSlots: [
        '09:30 ART (LP)',
        '13:30 ART (LP)',
        '14:00 ART (BF)',
        '16:00 ART (POD)',
        '17:30 ART (LP)',
        '20:00 ART (BF)',
        '21:30 ART (LP)',
        '22:00 ART (POD)',
        '01:30 ART (LP)',
      ],
      accounts: {
        youtube: 'Holding Digital (3 Canales)',
        instagram: '@holdingmedia',
        facebook: 'Holding Network',
        tiktok: '@holdingmedia',
        x: '@holdingmedia',
      },
      stats: {
        subscribers: globalStats.totalSubscribers,
        totalViews: globalStats.totalViews,
        watchHours: globalStats.totalWatchHours,
        avgAvd: 68.4,
        estimatedRevenue: 0,
        rpm: 0,
        uniqueClipsCount: globalStats.uniqueClipsCount,
        totalPublicationsCount: globalStats.totalPublications,
        arbitrageRatio: globalStats.arbitrageRatio,
        orphanedClipsCount: globalStats.orphanedPiecesCount,
      },
    }),
    [channels, globalStats]
  );

  const currentChannel = useMemo(
    () =>
      selectedChannelId === 'all'
        ? GLOBAL_CHANNEL
        : channels.find((c) => c.id === selectedChannelId) || channels[0],
    [selectedChannelId, GLOBAL_CHANNEL, channels]
  );

  // Filtered Clips based on Channel, Platform, Format, and Stage
  const filteredClips = useMemo(() => {
    if (selectedFormat === 'LONGFORM') return [];

    return clips.filter((c) => {
      // 1. Channel filter
      if (selectedChannelId !== 'all' && c.channelId !== selectedChannelId) return false;

      // 2. Platform filter
      if (selectedPlatform !== 'ALL') {
        const platRecord = c.platforms[selectedPlatform];
        if (!platRecord) return false;
      }

      // 3. Stage filter
      if (selectedStage !== 'ALL') {
        const isPublished = Object.values(c.platforms).some((p) => p.status === 'PUBLISHED');
        const isScheduled = Object.values(c.platforms).some((p) => p.status === 'SCHEDULED');
        if (selectedStage === 'PUBLISHED' && !isPublished) return false;
        if (selectedStage === 'SCHEDULED' && (!isScheduled || isPublished)) return false;
        if (selectedStage === 'VIRGIN_STOCK' && (isPublished || isScheduled)) return false;
      }

      return true;
    });
  }, [clips, selectedChannelId, selectedPlatform, selectedFormat, selectedStage]);

  // Filtered Episodes (Longform) based on Channel and Format
  const filteredEpisodes = useMemo(() => {
    if (selectedFormat === 'SHORTS') return [];

    return episodes.filter((e) => {
      if (selectedChannelId !== 'all' && e.channelId !== selectedChannelId) return false;
      return true;
    });
  }, [episodes, selectedChannelId, selectedFormat]);

  // Dynamic channel-specific metrics
  const retentionData = useMemo(
    () =>
      RETENTION_CURVES_BY_CHANNEL[selectedChannelId] ||
      RETENTION_CURVES_BY_CHANNEL['blackflag'] ||
      [],
    [selectedChannelId]
  );
  const platformData = useMemo(
    () =>
      PLATFORM_COMPARISONS_BY_CHANNEL[selectedChannelId] ||
      PLATFORM_COMPARISONS_BY_CHANNEL['blackflag'],
    [selectedChannelId]
  );
  const abVariants = useMemo(
    () => AB_VARIANTS_BY_CHANNEL[selectedChannelId] || AB_VARIANTS_BY_CHANNEL['blackflag'],
    [selectedChannelId]
  );

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
            ...(status === 'PUBLISHED'
              ? { publishedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) }
              : {}),
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
          YOUTUBE_SHORT: {
            ...c.platforms.YOUTUBE_SHORT,
            status: 'SCHEDULED' as const,
            slotTime: 'Próximo Turno Inmediato',
          },
          INSTAGRAM_REEL: {
            ...c.platforms.INSTAGRAM_REEL,
            status: 'SCHEDULED' as const,
            slotTime: 'Próximo Turno Inmediato',
          },
          FACEBOOK_REEL: {
            ...c.platforms.FACEBOOK_REEL,
            status: 'SCHEDULED' as const,
            slotTime: 'Próximo Turno Inmediato',
          },
          TIKTOK: {
            ...c.platforms.TIKTOK,
            status: 'SCHEDULED' as const,
            slotTime: 'Próximo Turno Inmediato',
          },
          X_TWITTER: {
            ...c.platforms.X_TWITTER,
            status: 'SCHEDULED' as const,
            slotTime: 'Próximo Turno Inmediato',
          },
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
        selectedPlatform,
        setSelectedPlatform: handleSetSelectedPlatform,
        selectedFormat,
        setSelectedFormat: handleSetSelectedFormat,
        selectedStage,
        setSelectedStage,
        episodes,
        filteredEpisodes,
        clips,
        allClips: clips,
        filteredClips,
        globalStats,
        retentionData,
        platformData,
        abVariants,
        mode,
        contentTab,
        metricsTab,
        isDbConnected,
        isSyncing,
        lastSyncedTime,
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
        triggerManualSync,
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
