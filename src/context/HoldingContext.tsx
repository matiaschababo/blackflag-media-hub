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

    // Shift priority: mark urgent and trigger first slot
    const updated = clips.map((c) => {
      if (c.id === clipId) {
        return {
          ...c,
          isUrgent: true,
          priorityOrder: 0,
        };
      }
      return {
        ...c,
        priorityOrder: (c.priorityOrder || 1) + 1,
      };
    });

    setClips(updated);
    syncClipStatusToSupabase(clipId, clip.platforms, true);
  };

  const addChannel = (channelData: Partial<Channel> & { name: string; niche: string }) => {
    const newId = channelData.name.toLowerCase().replace(/\s+/g, '-');
    const newChannel: Channel = {
      id: newId,
      name: channelData.name,
      shortCode: channelData.shortCode || channelData.name.slice(0, 2).toUpperCase(),
      niche: channelData.niche,
      audience: channelData.audience || 'General Digital Audience',
      accentColor: channelData.accentColor || '#38bdf8',
      badgeBg: 'bg-sky-950/40',
      badgeBorder: 'border-sky-600/40',
      badgeText: 'text-sky-400',
      avatarUrl: channelData.avatarUrl || '/channels/blackflag-logo.png',
      bannerUrl: channelData.bannerUrl || '/channels/blackflag-banner.png',
      shortsPerDay: channelData.shortsPerDay || 2,
      timeSlots: channelData.timeSlots || ['14:00 ART', '20:00 ART'],
      accounts: channelData.accounts || {
        youtube: `@${newId}`,
        instagram: `@${newId}`,
        facebook: `${channelData.name}`,
        tiktok: `@${newId}`,
        x: `@${newId}`,
      },
      stats: {
        totalViews: 0,
        watchHours: 0,
        subscribers: 0,
        avgAvd: 0,
        estimatedRevenue: 0,
        rpm: 0,
      },
    };

    setChannels((prev) => [...prev, newChannel]);
    setSelectedChannelId(newId);
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

export const useHolding = (): HoldingContextType => {
  const context = useContext(HoldingContext);
  if (!context) {
    throw new Error('useHolding must be used within a HoldingProvider');
  }
  return context;
};
