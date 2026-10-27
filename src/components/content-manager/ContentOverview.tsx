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
  Filter,
  Eye,
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
    setMode,
    updateClipStatus,
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
  const scheduledClips = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'SCHEDULED')
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
    { key: 'YOUTUBE_SHORT', label: 'YouTube Shorts', iconKey: 'YOUTUBE', handle: currentChannel.accounts.youtube },
    { key: 'INSTAGRAM_REEL', label: 'Instagram Reels', iconKey: 'INSTAGRAM', handle: currentChannel.accounts.instagram },
    { key: 'TIKTOK', label: 'TikTok', iconKey: 'TIKTOK', handle: currentChannel.accounts.tiktok },
    { key: 'FACEBOOK_REEL', label: 'Facebook Reels', iconKey: 'FACEBOOK', handle: currentChannel.accounts.facebook },
    { key: 'X_TWITTER', label: 'X (Twitter)', iconKey: 'TWITTER', handle: currentChannel.accounts.x },
  ];

  // Filter clips for the live gallery
  const displayedClips = allClips.filter((c) => {
    if (channelFilter !== 'all' && c.channelId !== channelFilter) return false;
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
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* 1. CHANNEL STRIP (FLAT, FUNCTIONAL) */}
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

        <div className="flex items-center space-x-1">
          <span className="text-[11px] text-[#848d97] mr-1.5 hidden md:inline">Canales:</span>
          {/* TODOS pill */}
          <button
            onClick={() => setSelectedChannelId('all')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
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
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannelId(ch.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
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
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. EXECUTIVE RADAR BANNER (FLAT, HIGH CONTRAST) */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase tracking-wider text-[#848d97] font-semibold">
                Control Operativo de Producción & Sindicación
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {currentChannel.name}
            </h2>
            <p className="text-xs text-[#848d97] max-w-2xl leading-relaxed">
              {currentChannel.audience} • Slots de emisión: {currentChannel.timeSlots?.join(', ') || '14:00, 20:00 ART'}
            </p>
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
              <span>Matriz de Clips ({filteredClips.length})</span>
            </button>
          </div>
        </div>

        {/* Hairline-divided KPI Strip */}
        <div className="mt-5 pt-4 border-t border-[#1e2129] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Episodios producidos</span>
            <div className="text-2xl font-bold text-white tabular-nums">{channelEpisodes.length}</div>
            <span className="text-[10px] text-[#848d97]">Master 1440p VP9</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Clips en stock virgen</span>
            <div className="text-2xl font-bold text-white tabular-nums">{virginStockClips.length}</div>
            <span className="text-[10px] text-[#848d97]">10 nodos por episodio</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Clips emitidos</span>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{publishedClips.length}</div>
            <span className="text-[10px] text-[#848d97]">En YouTube & TikTok</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Runway restante</span>
            <div className="text-2xl font-bold text-white tabular-nums">{daysRemaining} días</div>
            <span className="text-[10px] text-[#848d97]">A {currentChannel.shortsPerDay || 2} shorts/día</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FOUR OPERATION CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => setContentTab('episodes')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Tv className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Episodios VOD</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Video largo oficial 1440p con miniatura real y enlace a YouTube.
            </p>
          </div>
        </div>

        <div
          onClick={() => setContentTab('parrilla')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Calendar className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Parrilla 24/7</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Calendario de publicación horaria con slots libres y programados.
            </p>
          </div>
        </div>

        <div
          onClick={() => setContentTab('radar')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Radar className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Radar de Stock</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Monitoreo del runway virgen para evitar baches en la grilla.
            </p>
          </div>
        </div>

        <div
          onClick={() => setContentTab('clips_matrix')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Layers className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Matriz {allClips.length} Clips</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Hooks en 0:03, copys multi-plataforma y enlaces directos de video.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. LIVE SHORTS & CLIPS GALLERY (THE CORE INVENTORY FEED) */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1e2129] pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Catálogo de Shorts & Clips en Stock
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1e2129] text-sky-400 font-semibold">
                {displayedClips.length} clips
              </span>
            </div>
            <p className="text-xs text-[#848d97] mt-0.5">
              Stock visual 9:16 con miniaturas, hooks, métricas y enlaces directos a YouTube Shorts y TikTok.
            </p>
          </div>

          <button
            onClick={() => setContentTab('clips_matrix')}
            className="text-xs text-[#848d97] hover:text-white flex items-center space-x-1 cursor-pointer self-start md:self-auto"
          >
            <span>Ver matriz completa</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-lg bg-[#0c0d10] border border-[#1e2129]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#848d97] mr-1 flex items-center">
              <Filter className="h-3 w-3 mr-1" /> Canal:
            </span>
            <button
              onClick={() => setChannelFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'all'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Todos ({allClips.length})
            </button>
            <button
              onClick={() => setChannelFilter('levelpop')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'levelpop'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Level Pop ({allClips.filter((c) => c.channelId === 'levelpop').length})
            </button>
            <button
              onClick={() => setChannelFilter('blackflag')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'blackflag'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              BlackFlag ({allClips.filter((c) => c.channelId === 'blackflag').length})
            </button>
            <button
              onClick={() => setChannelFilter('podmon')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'podmon'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Podmon ({allClips.filter((c) => c.channelId === 'podmon').length})
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#848d97] mr-1">Estado:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-0.5 rounded text-xs transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-[#22262f] text-white font-semibold' : 'text-[#848d97] hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-2 py-0.5 rounded text-xs transition cursor-pointer ${
                statusFilter === 'published' ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' : 'text-[#848d97] hover:text-white'
              }`}
            >
              Publicados
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-2 py-0.5 rounded text-xs transition cursor-pointer ${
                statusFilter === 'scheduled' ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30' : 'text-[#848d97] hover:text-white'
              }`}
            >
              Programados
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2 py-0.5 rounded text-xs transition cursor-pointer ${
                statusFilter === 'pending' ? 'bg-[#22262f] text-white font-semibold' : 'text-[#848d97] hover:text-white'
              }`}
            >
              En stock
            </button>
          </div>
        </div>

        {/* Responsive Grid of Shorts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {displayedClips.map((clip) => {
            const ytUrl = clip.platforms?.YOUTUBE_SHORT?.url;
            const isPublishedYt = clip.platforms?.YOUTUBE_SHORT?.status === 'PUBLISHED';
            const isScheduledTt = clip.platforms?.TIKTOK?.status === 'SCHEDULED';
            const thumbSrc = getClipThumbnail(clip);

            return (
              <div
                key={clip.id}
                className="rounded-xl border border-[#1e2129] bg-[#0f1014] p-3 hover:border-[#2a2f3a] transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Channel Badge + ID + Views */}
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
                        #{clip.clipNumber} • {clip.id}
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

                  {/* Thumbnail + Title Row */}
                  <div className="flex items-start space-x-3">
                    {/* 9:16 Vertical Thumbnail Preview */}
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
                          title="Ver Short en YouTube"
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

                    {/* Title & Hook */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {clip.title}
                      </h4>

                      <div className="rounded bg-[#08090b] p-2 border border-[#1b1d24] mt-1.5 text-[11px]">
                        <span className="text-[9px] text-[#848d97] block uppercase tracking-wider mb-0.5">
                          Gancho 0:03:
                        </span>
                        <p className="text-[#d0d4dc] italic line-clamp-2 font-sans">
                          &ldquo;{clip.hook}&rdquo;
                        </p>
                      </div>

                      <div className="text-[10px] text-[#848d97] mt-1 flex items-center space-x-2">
                        <span>{clip.durationSec}s</span>
                        <span>•</span>
                        <span className="truncate">{clip.file}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Platform Status & Action Buttons */}
                <div className="mt-3 pt-2.5 border-t border-[#1b1d24] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    {(['YOUTUBE_SHORT', 'TIKTOK', 'INSTAGRAM_REEL'] as Platform[]).map((pKey) => {
                      const st = clip.platforms[pKey]?.status;
                      const isPub = st === 'PUBLISHED';
                      const isSched = st === 'SCHEDULED';
                      return (
                        <span
                          key={pKey}
                          title={`${pKey}: ${st || 'PENDING'}`}
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
                        <span>Ver Short</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}

                    <button
                      onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                      title="Copiar título"
                      className="px-2 py-0.5 rounded text-[11px] bg-[#14161b] border border-[#1e2129] text-[#848d97] hover:text-white transition flex items-center space-x-1"
                    >
                      {copiedId === `t-${clip.id}` ? (
                        <Check className="h-2.5 w-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-2.5 w-2.5" />
                      )}
                      <span>Título</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. FEATURED VIDEO SPOTLIGHT (SOLID FLAT SURFACE, REAL IMAGE) */}
      {/* ========================================================= */}
      {featuredEpisode && (
        <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
          <div className="flex items-center justify-between border-b border-[#1e2129] pb-3 mb-4">
            <span className="text-xs font-semibold text-white">
              Video Master Oficial (1440p VP9)
            </span>
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {featuredEpisode.status === 'PUBLISHED' ? 'Publicado en YouTube' : featuredEpisode.status}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* 16:9 Real Thumbnail */}
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

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs text-[#848d97]">
                  {currentChannel.name} • Episodio #{featuredEpisode.episodeNumber} • {featuredEpisode.clipsCount} clips derivados
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                  {featuredEpisode.title}
                </h3>

                <p className="text-xs text-[#848d97] mt-1.5 leading-relaxed">
                  Episodio ancla concebido bajo estándar Clip-First para abastecer los 10 cortes verticales en YouTube Shorts, Reels y TikTok.
                </p>
              </div>

              {/* Data strip */}
              <div className="grid grid-cols-3 gap-2.5 text-xs border-t border-[#1e2129] pt-3">
                <div>
                  <span className="text-[10px] text-[#848d97] block">Vistas YouTube</span>
                  <span className="text-sm font-semibold text-white tabular-nums">{featuredEpisode.totalViews || 28} vistas</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#848d97] block">Voz</span>
                  <span className="text-xs font-medium text-[#848d97] truncate block">{featuredEpisode.audioEngine}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#848d97] block">Motor</span>
                  <span className="text-xs font-medium text-[#848d97] truncate block">{featuredEpisode.renderEngine}</span>
                </div>
              </div>

              {/* Actions */}
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
                  <span>Ver {allClips.length} clips</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MULTI-PLATFORM STOCK MATRIX (CLEAN, NO ZEBRA, RULES ONLY) */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex items-center justify-between border-b border-[#1e2129] pb-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              Matriz de Stock por Plataforma
            </h3>
            <p className="text-[11px] text-[#848d97]">
              Sindicación en las 5 redes oficiales.
            </p>
          </div>

          <button
            onClick={() => setContentTab('parrilla')}
            className="text-xs text-[#848d97] hover:text-white flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver parrilla</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e2129] text-[11px] text-[#848d97] font-medium">
                <th className="py-2 px-3">Plataforma</th>
                <th className="py-2 px-3">Cuenta</th>
                <th className="py-2 px-3 text-right">Stock virgen</th>
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
                        title={`Abrir perfil de ${p.label}`}
                      >
                        <span className="font-mono">{p.handle}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
                      </a>
                    </td>

                    <td className="py-2.5 px-3 text-right tabular-nums text-white font-medium">
                      {stockCount} clips
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
