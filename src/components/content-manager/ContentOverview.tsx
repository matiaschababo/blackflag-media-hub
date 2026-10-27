'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Layers,
  Calendar,
  Tv,
  Radar,
  ArrowRight,
  ExternalLink,
  Play,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';
import { Platform } from '../../types';
import { getClipThumbnail } from '../../lib/supabase';

export const ContentOverview: React.FC = () => {
  const {
    channels,
    selectedChannelId,
    setSelectedChannelId,
    currentChannel,
    filteredClips,
    allClips,
    episodes,
    setContentTab,
    triggerRippleShift,
  } = useHolding();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'pending'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);
  const featuredEpisode = channelEpisodes[0] || episodes[0];

  const publishedClips = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
  );
  const virginStockClips = filteredClips.filter(
    (c) => !Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
  );

  const daysRemaining = Math.max(0, Math.floor(virginStockClips.length / (currentChannel.shortsPerDay || 2)));

  const getAccountUrl = (key: Platform, handle: string) => {
    if (!handle) return '#';
    const clean = handle.replace('@', '');
    switch (key) {
      case 'YOUTUBE_SHORT':
        return `https://youtube.com/${handle.startsWith('@') ? handle : '@' + handle}`;
      case 'INSTAGRAM_REEL':
        return `https://instagram.com/${clean}/`;
      case 'TIKTOK':
        return `https://www.tiktok.com/@${clean}`;
      case 'FACEBOOK_REEL':
        return `https://facebook.com/${clean}`;
      case 'X_TWITTER':
        return `https://x.com/${clean}`;
      default:
        return '#';
    }
  };

  const platformsList: Array<{ key: Platform; label: string; iconKey: string; handle: string }> = [
    { key: 'YOUTUBE_SHORT', label: 'YouTube Shorts', iconKey: 'YOUTUBE', handle: currentChannel.accounts?.youtube || '' },
    { key: 'INSTAGRAM_REEL', label: 'Instagram Reels', iconKey: 'INSTAGRAM', handle: currentChannel.accounts?.instagram || '' },
    { key: 'TIKTOK', label: 'TikTok', iconKey: 'TIKTOK', handle: currentChannel.accounts?.tiktok || '' },
    { key: 'FACEBOOK_REEL', label: 'Facebook Reels', iconKey: 'FACEBOOK', handle: currentChannel.accounts?.facebook || '' },
    { key: 'X_TWITTER', label: 'X (Twitter)', iconKey: 'TWITTER', handle: currentChannel.accounts?.x || '' },
  ];

  // Active clips filtered according to top pills or channel selection
  const effectiveChannel = selectedChannelId === 'all' ? channelFilter : selectedChannelId;
  const displayedClips = allClips.filter((c) => {
    if (effectiveChannel !== 'all' && c.channelId !== effectiveChannel) return false;
    if (statusFilter === 'published') {
      return Object.values(c.platforms).some((p) => p.status === 'PUBLISHED');
    }
    if (statusFilter === 'scheduled') {
      return Object.values(c.platforms).some((p) => p.status === 'SCHEDULED');
    }
    if (statusFilter === 'pending') {
      return !Object.values(c.platforms).some((p) => p.status === 'PUBLISHED');
    }
    return true;
  });

  return (
    <div className="space-y-5" data-testid="content-overview">
      {/* ========================================================= */}
      {/* 1. CHANNEL STRIP & SWITCHER (CLEAN, DENSE) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#1e2129] bg-[#13151a] px-4 py-2.5">
        <div className="flex items-center space-x-2.5">
          <img
            src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
            alt={currentChannel.name}
            className="h-6 w-6 rounded-md object-cover border border-[#2a2e39]"
          />
          <span className="text-xs font-semibold text-white">{currentChannel.name}</span>
          <span className="text-[11px] text-[#848d97]">• {currentChannel.niche}</span>
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => {
              setSelectedChannelId('all');
              setChannelFilter('all');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs transition cursor-pointer shrink-0 ${
              selectedChannelId === 'all'
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                : 'text-[#848d97] hover:text-white hover:bg-[#181b21]'
            }`}
          >
            <span>TODOS</span>
            <span className="text-[10px] opacity-70">({allClips.length})</span>
          </button>

          {channels.map((ch) => {
            const isSelected = selectedChannelId === ch.id;
            const chClipsCount = allClips.filter((c) => c.channelId === ch.id).length;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannelId(ch.id);
                  setChannelFilter(ch.id);
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:text-white hover:bg-[#181b21]'
                }`}
              >
                <img
                  src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                  alt={ch.name}
                  className="h-3.5 w-3.5 rounded object-cover"
                />
                <span>{ch.name}</span>
                <span className="text-[10px] opacity-60">({chClipsCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CONSOLIDATED KPI & OPERATION BAR */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentChannel.name}
              </h2>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#848d97]">
              <span>{currentChannel.audience}</span>
              <span>•</span>
              <span className="font-mono text-white">{currentChannel.timeSlots?.join(' • ') || '14:00 • 20:00 ART'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setContentTab('parrilla')}
              className="app-button app-button-secondary text-xs"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#848d97]" />
              <span>Parrilla 24/7</span>
            </button>

            <button
              onClick={() => setContentTab('clips_matrix')}
              className="app-button app-button-primary text-xs"
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              <span>Matriz ({filteredClips.length})</span>
            </button>
          </div>
        </div>

        {/* Clean Hairline KPI Grid (No chatty sub-labels) */}
        <div className="mt-5 pt-4 border-t border-[#1e2129] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97] font-medium">Episodios VOD</span>
            <div className="text-2xl font-bold text-white tabular-nums">
              {channelEpisodes.length}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97] font-medium">Stock Virgen</span>
            <div className="text-2xl font-bold text-white tabular-nums">
              {virginStockClips.length} <span className="text-sm font-normal text-[#848d97]">/ {filteredClips.length}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97] font-medium">Clips Emitidos</span>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              {publishedClips.length}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97] font-medium">Runway</span>
            <div className="text-2xl font-bold text-white tabular-nums">
              {daysRemaining}d
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SHORTS & CLIPS INVENTORY (PRIMARY VISUAL FEED) */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2129] pb-4 mb-4">
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              Catálogo de Shorts & Clips
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1e2129] text-sky-400 font-semibold">
              {displayedClips.length}
            </span>
          </div>

          {/* Clean Segmented Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedChannelId === 'all' && (
              <div className="flex items-center rounded-lg bg-[#0c0d10] p-0.5 border border-[#1e2129] text-xs">
                <button
                  onClick={() => setChannelFilter('all')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    channelFilter === 'all' ? 'bg-[#1e2129] text-white font-semibold' : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setChannelFilter('levelpop')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    channelFilter === 'levelpop' ? 'bg-[#1e2129] text-cyan-400 font-semibold' : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  Level Pop
                </button>
                <button
                  onClick={() => setChannelFilter('blackflag')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    channelFilter === 'blackflag' ? 'bg-[#1e2129] text-amber-400 font-semibold' : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  BlackFlag
                </button>
                <button
                  onClick={() => setChannelFilter('podmon')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    channelFilter === 'podmon' ? 'bg-[#1e2129] text-yellow-400 font-semibold' : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  Podmon
                </button>
              </div>
            )}

            <div className="flex items-center rounded-lg bg-[#0c0d10] p-0.5 border border-[#1e2129] text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  statusFilter === 'all' ? 'bg-[#1e2129] text-white font-semibold' : 'text-[#848d97] hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  statusFilter === 'published' ? 'bg-[#1e2129] text-emerald-400 font-semibold' : 'text-[#848d97] hover:text-white'
                }`}
              >
                Publicados
              </button>
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  statusFilter === 'scheduled' ? 'bg-[#1e2129] text-amber-400 font-semibold' : 'text-[#848d97] hover:text-white'
                }`}
              >
                Programados
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-[#1e2129] text-white font-semibold' : 'text-[#848d97] hover:text-white'
                }`}
              >
                En stock
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Grid of Self-Explanatory 9:16 Shorts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {displayedClips.map((clip) => {
            const ytUrl = clip.platforms?.YOUTUBE_SHORT?.url;
            const isPublishedYt = clip.platforms?.YOUTUBE_SHORT?.status === 'PUBLISHED';
            const isScheduledTt = clip.platforms?.TIKTOK?.status === 'SCHEDULED';
            const thumbSrc = getClipThumbnail(clip);

            return (
              <div
                key={clip.id}
                data-clip-id={clip.id}
                data-channel-id={clip.channelId}
                className="rounded-xl border border-[#1e2129] bg-[#0f1014] p-3 hover:border-[#2a2f3a] transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Channel Tag + Number + Status */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                        clip.channelId === 'levelpop'
                          ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                          : clip.channelId === 'blackflag'
                          ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          : 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                      }`}>
                        {clip.channelId}
                      </span>
                      <span className="text-[10px] font-mono text-[#848d97]">
                        #{clip.clipNumber}
                      </span>
                    </div>

                    {isPublishedYt ? (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {(clip.views ?? 0) > 0 ? `${(clip.views ?? 0).toLocaleString()} vistas` : 'Publicado'}
                      </span>
                    ) : isScheduledTt ? (
                      <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        Programado
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#848d97] bg-[#16181e] px-1.5 py-0.2 rounded border border-[#21242c]">
                        En Stock
                      </span>
                    )}
                  </div>

                  {/* Thumbnail & Content Layout */}
                  <div className="flex items-start space-x-3">
                    {/* Vertical 9:16 Cover Preview */}
                    <div className="relative w-20 h-32 rounded-lg overflow-hidden border border-[#262a34] bg-black shrink-0 group">
                      <img
                        src={thumbSrc}
                        alt={clip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      {ytUrl ? (
                        <a
                          href={ytUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition group-hover:bg-black/10"
                        >
                          <div className="h-7 w-7 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                            <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                          </div>
                        </a>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="text-[9px] font-mono text-[#848d97] px-1 py-0.2 rounded bg-black/60">
                            {clip.durationSec}s
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title & Quoted Hook (No redundant 'Gancho' label) */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {clip.title}
                      </h4>

                      {clip.hook && (
                        <blockquote className="rounded bg-[#08090b] p-2 border border-[#1b1d24] mt-1.5 text-[11px] text-[#d0d4dc] italic line-clamp-2 font-sans">
                          &ldquo;{clip.hook}&rdquo;
                        </blockquote>
                      )}

                      <div className="text-[10px] text-[#848d97] mt-1 flex items-center space-x-2 font-mono">
                        <span>{clip.durationSec}s</span>
                        <span>•</span>
                        <span className="truncate">{clip.file}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Controls Strip */}
                <div className="mt-3 pt-2.5 border-t border-[#1b1d24] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    {(['YOUTUBE_SHORT', 'TIKTOK', 'INSTAGRAM_REEL'] as Platform[]).map((pKey) => {
                      const st = clip.platforms[pKey]?.status;
                      const isPub = st === 'PUBLISHED';
                      const isSched = st === 'SCHEDULED';
                      return (
                        <span
                          key={pKey}
                          className={`flex items-center justify-center h-5 w-5 rounded border ${
                            isPub
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : isSched
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-[#14161b] border-[#1e2129] text-[#555d68]'
                          }`}
                        >
                          <PlatformIcon
                            platform={
                              pKey === 'YOUTUBE_SHORT'
                                ? 'YOUTUBE'
                                : pKey === 'TIKTOK'
                                ? 'TIKTOK'
                                : 'INSTAGRAM'
                            }
                            size={11}
                          />
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {ytUrl && (
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-600/15 border border-red-500/30 text-red-400 hover:bg-red-600/25 transition flex items-center space-x-1"
                      >
                        <span>Short</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}

                    <button
                      onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                      className="px-2 py-0.5 rounded text-[11px] bg-[#14161b] border border-[#1e2129] text-[#848d97] hover:text-white transition flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId === `t-${clip.id}` ? (
                        <Check className="h-2.5 w-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-2.5 w-2.5" />
                      )}
                      <span>Título</span>
                    </button>

                    <button
                      onClick={() => triggerRippleShift(clip.id)}
                      title="Adelantar al turno inmediato"
                      className="px-2 py-0.5 rounded text-[11px] font-semibold text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition cursor-pointer flex items-center space-x-0.5"
                    >
                      <Zap className="h-2.5 w-2.5 fill-current" />
                      <span>Turno</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MASTER VOD SPOTLIGHT (16:9 ANCHOR) */}
      {/* ========================================================= */}
      {featuredEpisode && (
        <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
          <div className="flex items-center justify-between border-b border-[#1e2129] pb-3 mb-4">
            <span className="text-xs font-semibold text-white">
              Video Master Oficial (1440p VP9)
            </span>
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {featuredEpisode.status === 'PUBLISHED' ? 'Publicado' : featuredEpisode.status}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <div className="relative aspect-video w-full lg:w-80 shrink-0 rounded-lg overflow-hidden border border-[#262a34] bg-black">
              <img
                src={featuredEpisode.thumbnailUrl || '/thumbnails/ep01-blackflag.png'}
                alt={featuredEpisode.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[11px] px-1.5 py-0.5 rounded border border-white/20">
                {featuredEpisode.duration}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs text-[#848d97] font-mono">
                  {currentChannel.name} • #{featuredEpisode.episodeNumber}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                  {featuredEpisode.title}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-xs border-t border-[#1e2129] pt-3">
                <div>
                  <span className="text-[10px] text-[#848d97] block font-medium">Vistas</span>
                  <span className="text-sm font-semibold text-white tabular-nums">{featuredEpisode.totalViews || 28}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#848d97] block font-medium">Vocal</span>
                  <span className="text-xs font-medium text-[#848d97] truncate block">{featuredEpisode.audioEngine}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#848d97] block font-medium">Render</span>
                  <span className="text-xs font-medium text-[#848d97] truncate block">{featuredEpisode.renderEngine}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 pt-1">
                <a
                  href={featuredEpisode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-button app-button-secondary text-xs"
                >
                  <PlatformIcon platform="YOUTUBE" size={14} className="mr-1.5" />
                  <span>Ver en YouTube</span>
                  <ExternalLink className="h-3 w-3 ml-1.5 text-[#848d97]" />
                </a>

                <button
                  onClick={() => setContentTab('clips_matrix')}
                  className="app-button app-button-secondary text-xs"
                >
                  <Layers className="h-3 w-3 mr-1.5 text-[#848d97]" />
                  <span>Matriz ({allClips.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MULTI-PLATFORM DISTRIBUTION MATRIX */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex items-center justify-between border-b border-[#1e2129] pb-3 mb-3">
          <h3 className="text-sm font-bold text-white">
            Distribución por Red
          </h3>

          <button
            onClick={() => setContentTab('parrilla')}
            className="text-xs text-[#848d97] hover:text-white flex items-center space-x-1 cursor-pointer"
          >
            <span>Parrilla</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e2129] text-[11px] text-[#848d97] font-medium">
                <th className="py-2 px-3">Plataforma</th>
                <th className="py-2 px-3">Cuenta</th>
                <th className="py-2 px-3 text-right">En Stock</th>
                <th className="py-2 px-3 text-right">Programados</th>
                <th className="py-2 px-3 text-right">Publicados</th>
                <th className="py-2 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2129]">
              {platformsList.map((p) => {
                const stockCount = filteredClips.filter(
                  (c) => c.platforms[p.key]?.status === 'PENDING'
                ).length;
                const schedCount = filteredClips.filter(
                  (c) => c.platforms[p.key]?.status === 'SCHEDULED'
                ).length;
                const pubCount = filteredClips.filter(
                  (c) => c.platforms[p.key]?.status === 'PUBLISHED'
                ).length;

                return (
                  <tr key={p.key} className="hover:bg-[#181b21] transition">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <PlatformIcon platform={p.iconKey} size={15} />
                        <span className="font-semibold text-white">{p.label}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <a
                        href={getAccountUrl(p.key, p.handle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-[#848d97] hover:text-white transition group"
                      >
                        <span className="font-mono">{p.handle || '—'}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
                      </a>
                    </td>

                    <td className="py-2.5 px-3 text-right tabular-nums text-white font-medium">
                      {stockCount}
                    </td>

                    <td className="py-2.5 px-3 text-right tabular-nums text-[#848d97]">
                      {schedCount}
                    </td>

                    <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 font-medium">
                      {pubCount}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setContentTab('parrilla')}
                        className="text-[11px] px-2 py-0.5 rounded border border-[#262a34] bg-[#16181e] text-[#848d97] hover:text-white hover:border-[#2c313d] transition cursor-pointer"
                      >
                        Programar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
