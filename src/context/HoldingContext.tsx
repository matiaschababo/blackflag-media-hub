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
  filteredClips: Clip[];
  retentionData: RetentionDataPoint[];
  platformData: Array<{ platform: string; views: number; hours: number; engagementRate: number }>;
  abVariants: ABVariant[];
  mode: AppMode;
  contentTab: ContentTab;
  metricsTab: MetricsTab;
  isDbConnected: boolean;
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
  const [selectedChannelId, setSelectedChannelId] = useState<string>('blackflag');
  const [episodes, setEpisodes] = useState<Episode[]>(INITIAL_EPISODES);
  const [clips, setClips] = useState<Clip[]>(INITIAL_CLIPS);
  const [mode, setMode] = useState<AppMode>('content_manager');
  const [contentTab, setContentTab] = useState<ContentTab>('overview');
  const [metricsTab, setMetricsTab] = useState<MetricsTab>('overview');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

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

  const currentChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const filteredClips = clips.filter((c) => c.channelId === selectedChannelId);

  // Dynamic channel-specific metrics
  const retentionData =
    RETENTION_CURVES_BY_CHANNEL[selectedChannelId] || [];
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
    setSelectedChannelId(id);

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
        filteredClips,
        retentionData,
        platformData,
        abVariants,
        mode,
        contentTab,
        metricsTab,
        isDbConnected,
        setSelectedChannelId,
        setMode,
        setContentTab,
        setMetricsTab,
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
