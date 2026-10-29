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
    <div className="space-y-6" data-testid="content-overview">
      {/* ========================================================= */}
      {/* 1. CHANNEL STRIP & SWITCHER */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <img
            src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
            alt={currentChannel.name}
            className="h-8 w-8 rounded-xl object-cover border border-[#2a2e39]"
          />
          <div>
            <span className="text-sm font-bold text-white">{currentChannel.name}</span>
            <span className="text-xs text-[#848d97] ml-2">• {currentChannel.niche}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <button
            onClick={() => {
              setSelectedChannelId('all');
              setChannelFilter('all');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
              selectedChannelId === 'all'
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/40 shadow-sm'
                : 'text-[#848d97] hover:text-white hover:bg-[#181b21]'
            }`}
          >
            <span>TODOS</span>
            <span className="text-xs opacity-80">({allClips.length})</span>
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
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#1e2129] text-white font-bold border border-zinc-700/60 shadow-sm'
                    : 'text-[#848d97] hover:text-white hover:bg-[#181b21]'
                }`}
              >
                <img
                  src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                  alt={ch.name}
                  className="h-4 w-4 rounded-md object-cover"
                />
                <span>{ch.name}</span>
                <span className="text-xs opacity-70">({chClipsCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CONSOLIDATED KPI & OPERATION BAR */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {currentChannel.name}
              </h2>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#848d97]">
              <span>{currentChannel.audience}</span>
              <span>•</span>
              <span className="font-mono text-white font-semibold">
                {currentChannel.timeSlots?.join(' • ') || '14:00 • 20:00 ART'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => setContentTab('parrilla')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs sm:text-sm font-semibold text-white transition cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-emerald-400" />
              <span>Parrilla 24/7</span>
            </button>

            <button
              onClick={() => setContentTab('clips_matrix')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-sky-500/40 bg-sky-600 hover:bg-sky-500 text-xs sm:text-sm font-bold text-white transition cursor-pointer shadow-md"
            >
              <Layers className="h-4 w-4" />
              <span>Matriz ({filteredClips.length})</span>
            </button>
          </div>
        </div>

        {/* Clean Hairline KPI Grid */}
        <div className="mt-6 pt-5 border-t border-zinc-800 grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#848d97] uppercase">
              Episodios VOD
            </span>
            <div className="text-3xl font-extrabold text-white tabular-nums">
              {channelEpisodes.length}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#848d97] uppercase">
              Stock Virgen
            </span>
            <div className="text-3xl font-extrabold text-white tabular-nums">
              {virginStockClips.length}{' '}
              <span className="text-sm font-normal text-[#848d97]">
                / {filteredClips.length}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#848d97] uppercase">
              Clips Emitidos
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">
              {publishedClips.length}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#848d97] uppercase">
              Runway (Autonomía)
            </span>
            <div className="text-3xl font-extrabold text-white tabular-nums">
              {daysRemaining} días
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SHORTS & CLIPS INVENTORY (PRIMARY VISUAL FEED) */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-5">
          <div className="flex items-center space-x-3">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Catálogo de Shorts &amp; Clips
            </h3>
            <span className="text-xs sm:text-sm font-mono px-2.5 py-0.5 rounded-lg bg-zinc-800 text-sky-400 font-bold border border-zinc-700">
              {displayedClips.length} piezas
            </span>
          </div>

          {/* Clean Segmented Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {selectedChannelId === 'all' && (
              <div className="flex items-center rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs sm:text-sm">
                <button
                  onClick={() => setChannelFilter('all')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                    channelFilter === 'all'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setChannelFilter('levelpop')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                    channelFilter === 'levelpop'
                      ? 'bg-zinc-800 text-cyan-400 font-bold'
                      : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  Level Pop
                </button>
                <button
                  onClick={() => setChannelFilter('blackflag')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                    channelFilter === 'blackflag'
                      ? 'bg-zinc-800 text-amber-400 font-bold'
                      : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  BlackFlag
                </button>
                <button
                  onClick={() => setChannelFilter('podmon')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                    channelFilter === 'podmon'
                      ? 'bg-zinc-800 text-yellow-400 font-bold'
                      : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  Podmon
                </button>
              </div>
            )}

            <div className="flex items-center rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs sm:text-sm">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                  statusFilter === 'all'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-[#848d97] hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                  statusFilter === 'published'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                    : 'text-[#848d97] hover:text-white'
                }`}
              >
                Publicados
              </button>
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                  statusFilter === 'scheduled'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                    : 'text-[#848d97] hover:text-white'
                }`}
              >
                Programados
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer font-medium ${
                  statusFilter === 'pending'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-[#848d97] hover:text-white'
                }`}
              >
                En stock
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Grid of Self-Explanatory 9:16 Shorts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Channel Tag + Number + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${
                          clip.channelId === 'levelpop'
                            ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                            : clip.channelId === 'blackflag'
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                            : 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                        }`}
                      >
                        {clip.channelId}
                      </span>
                      <span className="text-xs font-mono text-[#848d97] font-semibold">
                        #{clip.clipNumber}
                      </span>
                    </div>

                    {isPublishedYt ? (
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {(clip.views ?? 0) > 0
                          ? `${(clip.views ?? 0).toLocaleString()} vistas`
                          : 'Publicado'}
                      </span>
                    ) : isScheduledTt ? (
                      <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        Programado
                      </span>
                    ) : (
                      <span className="text-xs text-[#848d97] bg-[#16181e] px-2 py-0.5 rounded-md border border-[#21242c]">
                        En Stock
                      </span>
                    )}
                  </div>

                  {/* Thumbnail & Content Layout */}
                  <div className="flex items-start space-x-3.5">
                    {/* Vertical 9:16 Cover Preview (Comfortable Size) */}
                    <div className="relative w-24 sm:w-28 h-40 sm:h-44 rounded-xl overflow-hidden border border-[#262a34] bg-black shrink-0 group">
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
                          <div className="h-9 w-9 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          </div>
                        </a>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="text-xs font-mono text-[#848d97] px-1.5 py-0.5 rounded bg-black/60">
                            {clip.durationSec}s
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title & Quoted Hook */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                        {clip.title}
                      </h4>

                      {clip.hook && (
                        <blockquote className="rounded-xl bg-[#08090b] p-2.5 border border-[#1b1d24] text-xs text-[#d0d4dc] italic line-clamp-3 font-sans leading-relaxed">
                          &ldquo;{clip.hook}&rdquo;
                        </blockquote>
                      )}

                      <div className="text-xs text-[#848d97] flex items-center space-x-2 font-mono pt-1">
                        <span className="font-bold text-white">{clip.durationSec}s</span>
                        <span>•</span>
                        <span className="truncate">{clip.file}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Controls Strip */}
                <div className="mt-4 pt-3 border-t border-[#1b1d24] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    {(['YOUTUBE_SHORT', 'TIKTOK', 'INSTAGRAM_REEL'] as Platform[]).map((pKey) => {
                      const st = clip.platforms[pKey]?.status;
                      const isPub = st === 'PUBLISHED';
                      const isSched = st === 'SCHEDULED';
                      return (
                        <span
                          key={pKey}
                          className={`flex items-center justify-center h-6 w-6 rounded-lg border ${
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
                            size={13}
                          />
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-2">
                    {ytUrl && (
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-600/15 border border-red-500/30 text-red-400 hover:bg-red-600/25 transition flex items-center space-x-1"
                      >
                        <span>Short</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    <button
                      onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#14161b] border border-[#1e2129] text-[#848d97] hover:text-white transition flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId === `t-${clip.id}` ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Título</span>
                    </button>

                    <button
                      onClick={() => triggerRippleShift(clip.id)}
                      title="Adelantar al turno inmediato"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition cursor-pointer flex items-center space-x-1"
                    >
                      <Zap className="h-3 w-3 fill-current" />
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
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-4">
            <span className="text-sm font-bold text-white">
              Video Master Oficial (1440p VP9 / 60 FPS)
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              {featuredEpisode.status === 'PUBLISHED' ? 'Publicado' : featuredEpisode.status}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <div className="relative aspect-video w-full lg:w-96 shrink-0 rounded-xl overflow-hidden border border-[#262a34] bg-black">
              <img
                src={featuredEpisode.thumbnailUrl || '/thumbnails/ep01-blackflag.png'}
                alt={featuredEpisode.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-xs px-2 py-0.5 rounded border border-white/20 font-bold">
                {featuredEpisode.duration}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-[#848d97] font-mono">
                  {currentChannel.name} • #{featuredEpisode.episodeNumber}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 leading-snug">
                  {featuredEpisode.title}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs border-t border-zinc-800 pt-4">
                <div>
                  <span className="text-xs text-[#848d97] block font-medium">Vistas Auditadas</span>
                  <span className="text-base font-bold text-white tabular-nums">
                    {featuredEpisode.totalViews || 28}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#848d97] block font-medium">Vocal Engine</span>
                  <span className="text-xs font-semibold text-zinc-300 truncate block mt-0.5">
                    {featuredEpisode.audioEngine}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#848d97] block font-medium">Render Master</span>
                  <span className="text-xs font-semibold text-zinc-300 truncate block mt-0.5">
                    {featuredEpisode.renderEngine}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={featuredEpisode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold transition shadow-md"
                >
                  <PlatformIcon platform="YOUTUBE" size={16} />
                  <span>Ver en YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>

                <button
                  onClick={() => setContentTab('clips_matrix')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-semibold transition"
                >
                  <Layers className="h-4 w-4 text-sky-400" />
                  <span>Matriz de Clips ({allClips.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MULTI-PLATFORM DISTRIBUTION MATRIX */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-4">
          <h3 className="text-base font-bold text-white">
            Distribución Multicanal por Red
          </h3>

          <button
            onClick={() => setContentTab('parrilla')}
            className="text-xs sm:text-sm text-[#848d97] hover:text-white flex items-center space-x-1.5 cursor-pointer font-semibold"
          >
            <span>Ver Parrilla 24/7</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-mono font-bold tracking-wider text-[#848d97] uppercase">
                <th className="py-3 px-4">Plataforma</th>
                <th className="py-3 px-4">Cuenta Oficial</th>
                <th className="py-3 px-4 text-right">En Stock</th>
                <th className="py-3 px-4 text-right">Programados</th>
                <th className="py-3 px-4 text-right">Publicados</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
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
                  <tr key={p.key} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <PlatformIcon platform={p.iconKey} size={18} />
                        <span className="font-bold text-white">{p.label}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <a
                        href={getAccountUrl(p.key, p.handle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-[#848d97] hover:text-white transition group"
                      >
                        <span className="font-mono">{p.handle || '—'}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition shrink-0" />
                      </a>
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-white font-bold">
                      {stockCount}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-[#848d97]">
                      {schedCount}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-bold">
                      {pubCount}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setContentTab('parrilla')}
                        className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 transition cursor-pointer font-medium"
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
