'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Channel,
  Episode,
  Clip,
  AppMode,
  ContentTab,
  MetricsTab,
  Platform,
  PublicationRecord,
} from '../types';
import { INITIAL_CHANNELS, INITIAL_EPISODES, INITIAL_CLIPS } from '../data/mockData';

interface HoldingContextType {
  channels: Channel[];
  selectedChannelId: string;
  currentChannel: Channel;
  episodes: Episode[];
  clips: Clip[];
  filteredClips: Clip[];
  mode: AppMode;
  contentTab: ContentTab;
  metricsTab: MetricsTab;
  setSelectedChannelId: (id: string) => void;
  setMode: (mode: AppMode) => void;
  setContentTab: (tab: ContentTab) => void;
  setMetricsTab: (tab: MetricsTab) => void;
  updateClipStatus: (clipId: string, platform: Platform, status: PublicationRecord['status'], url?: string) => void;
  addChannel: (channel: Partial<Channel> & { name: string; niche: string }) => void;
  triggerRippleShift: (clipId: string) => void;
}

const HoldingContext = createContext<HoldingContextType | undefined>(undefined);

export const HoldingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('blackflag');
  const [episodes, setEpisodes] = useState<Episode[]>(INITIAL_EPISODES);
  const [clips, setClips] = useState<Clip[]>(INITIAL_CLIPS);
  const [mode, setMode] = useState<AppMode>('content_manager');
  const [contentTab, setContentTab] = useState<ContentTab>('clips_matrix');
  const [metricsTab, setMetricsTab] = useState<MetricsTab>('overview');

  // Load saved state from localStorage on client
  useEffect(() => {
    try {
      const savedClips = localStorage.getItem('bf_holding_clips');
      if (savedClips) setClips(JSON.parse(savedClips));

      const savedChannels = localStorage.getItem('bf_holding_channels');
      if (savedChannels) setChannels(JSON.parse(savedChannels));
    } catch {
      // Local storage fallback
    }
  }, []);

  // Persist clips
  const saveClips = (newClips: Clip[]) => {
    setClips(newClips);
    try {
      localStorage.setItem('bf_holding_clips', JSON.stringify(newClips));
    } catch {
      // ignore
    }
  };

  const currentChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const filteredClips = clips.filter((c) => c.channelId === selectedChannelId);

  const updateClipStatus = (
    clipId: string,
    platform: Platform,
    status: PublicationRecord['status'],
    url?: string
  ) => {
    const updated = clips.map((c) => {
      if (c.id === clipId) {
        return {
          ...c,
          platforms: {
            ...c.platforms,
            [platform]: {
              ...c.platforms[platform],
              status,
              ...(url ? { url } : {}),
              ...(status === 'PUBLISHED' ? { publishedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : {}),
            },
          },
        };
      }
      return c;
    });
    saveClips(updated);
  };

  const triggerRippleShift = (clipId: string) => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;

    // Simulate ripple shift: set clip to next turn and advance others
    const updated = clips.map((c) => {
      if (c.id === clipId) {
        return {
          ...c,
          isUrgent: true,
          platforms: {
            ...c.platforms,
            YOUTUBE_SHORT: { ...c.platforms.YOUTUBE_SHORT, status: 'SCHEDULED' as const, slotTime: '14:00 ART (Próximo Turno)' },
            INSTAGRAM_REEL: { ...c.platforms.INSTAGRAM_REEL, status: 'SCHEDULED' as const, slotTime: '14:00 ART (Próximo Turno)' },
            FACEBOOK_REEL: { ...c.platforms.FACEBOOK_REEL, status: 'SCHEDULED' as const, slotTime: '14:00 ART (Próximo Turno)' },
            TIKTOK: { ...c.platforms.TIKTOK, status: 'SCHEDULED' as const, slotTime: '14:00 ART (Próximo Turno)' },
            X_TWITTER: { ...c.platforms.X_TWITTER, status: 'SCHEDULED' as const, slotTime: '14:00 ART (Próximo Turno)' },
          },
        };
      }
      return c;
    });
    saveClips(updated);
  };

  const addChannel = (data: Partial<Channel> & { name: string; niche: string }) => {
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

    const newChannels = [...channels, newChan];
    setChannels(newChannels);
    setSelectedChannelId(id);
    try {
      localStorage.setItem('bf_holding_channels', JSON.stringify(newChannels));
    } catch {
      // ignore
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
        mode,
        contentTab,
        metricsTab,
        setSelectedChannelId,
        setMode,
        setContentTab,
        setMetricsTab,
        updateClipStatus,
        addChannel,
        triggerRippleShift,
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
