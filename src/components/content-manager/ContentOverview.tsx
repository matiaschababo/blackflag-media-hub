'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Play,
  Copy,
  Check,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';
import { Platform, PublicationStatus, Clip } from '../../types';
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
    updateClipStatus,
    triggerRippleShift,
  } = useHolding();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'published'>('all');
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
    { key: 'TIKTOK', label: 'TikTok', iconKey: 'TIKTOK', handle: currentChannel.accounts?.tiktok || '' },
    { key: 'INSTAGRAM_REEL', label: 'Instagram Reels', iconKey: 'INSTAGRAM', handle: currentChannel.accounts?.instagram || '' },
    { key: 'FACEBOOK_REEL', label: 'Facebook Reels', iconKey: 'FACEBOOK', handle: currentChannel.accounts?.facebook || '' },
    { key: 'X_TWITTER', label: 'X (Twitter)', iconKey: 'TWITTER', handle: currentChannel.accounts?.x || '' },
  ];

  // Clips to display: strictly from the active channel
  const displayedClips = filteredClips.filter((c) => {
    if (statusFilter === 'published') {
      return Object.values(c.platforms).some((p) => p.status === 'PUBLISHED');
    }
    if (statusFilter === 'pending') {
      return !Object.values(c.platforms).some((p) => p.status === 'PUBLISHED');
    }
    return true;
  });

  // -------------------------------------------------------------
  // VISTA GLOBAL SI ESTÁ SELECCIONADO "TODOS LOS CANALES"
  // -------------------------------------------------------------
  if (selectedChannelId === 'all') {
    return (
      <div className="space-y-6">
        {/* Header Global */}
        <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                  Holding Digital • Vista Consolidada
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                Catálogo Global de Canales
              </h2>
              <p className="text-xs text-[#848d97] mt-0.5">
                Total consolidado: <strong className="text-white">{allClips.length} clips</strong> producidos en los 3 canales del holding.
              </p>
            </div>

            <button
              onClick={() => setContentTab('parrilla')}
              className="app-button app-button-primary text-xs shrink-0"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Ver Parrilla 24/7 Global</span>
            </button>
          </div>
        </div>

        {/* 3 Canales Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((ch) => {
            const chClips = allClips.filter((c) => c.channelId === ch.id);
            const chPublished = chClips.filter((c) =>
              Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
            ).length;
            const chVirgin = chClips.length - chPublished;
            const chRunway = Math.max(0, Math.floor(chVirgin / (ch.shortsPerDay || 2)));

            return (
              <div
                key={ch.id}
                className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5 hover:border-[#2c313d] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3">
                    <img
                      src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                      alt={ch.name}
                      className="h-10 w-10 rounded-lg object-cover border border-[#2a2e39]"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{ch.name}</h3>
                      <span className="text-[11px] text-[#848d97]">{ch.niche}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1e2129] grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#181b21] p-2 rounded-lg">
                      <span className="text-[10px] text-[#848d97] block">En stock</span>
                      <strong className="text-sm font-bold text-white tabular-nums">{chVirgin}</strong>
                    </div>
                    <div className="bg-[#181b21] p-2 rounded-lg">
                      <span className="text-[10px] text-[#848d97] block">Emitidos</span>
                      <strong className="text-sm font-bold text-emerald-400 tabular-nums">{chPublished}</strong>
                    </div>
                    <div className="bg-[#181b21] p-2 rounded-lg">
                      <span className="text-[10px] text-[#848d97] block">Runway</span>
                      <strong className="text-sm font-bold text-white tabular-nums">{chRunway}d</strong>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-[#848d97]">
                    Cadencia: <strong className="text-white">{ch.shortsPerDay} shorts/día</strong> ({ch.timeSlots.join(' • ')})
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChannelId(ch.id)}
                  className="mt-4 w-full flex items-center justify-center space-x-1.5 py-2 rounded-lg border border-[#262a34] bg-[#181b21] text-xs font-semibold text-white hover:bg-[#22262f] transition cursor-pointer"
                >
                  <span>Entrar a {ch.name}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VISTA DE CANAL ESPECÍFICO (EJ. LEVEL POP, BLACKFLAG, PODMON)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. HEADER UNIFICADO DEL CANAL ACTIVO (SIN DUPLICADOS) */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-12 w-12 rounded-xl object-cover border border-[#2a2e39] shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {currentChannel.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#181b21] border border-[#262a34] text-[#848d97]">
                  {currentChannel.shortCode}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <p className="text-xs text-[#848d97] mt-0.5">
                {currentChannel.niche} • <span className="text-[#a0a8b4]">{currentChannel.audience}</span>
              </p>

              {/* Redes Oficiales Directas */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[#848d97] font-medium mr-0.5">Redes:</span>
                {platformsList.slice(0, 3).map((p) => {
                  if (!p.handle) return null;
                  return (
                    <a
                      key={p.key}
                      href={getAccountUrl(p.key, p.handle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md border border-[#21242c] bg-[#181b21] text-[11px] text-[#848d97] hover:text-white hover:border-[#2c313d] transition group"
                    >
                      <PlatformIcon platform={p.iconKey} size={12} />
                      <span className="font-mono text-[10px]">{p.handle}</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Acciones Directas */}
          <div className="flex items-center space-x-2 shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => setContentTab('parrilla')}
              className="app-button app-button-primary text-xs"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Parrilla 24/7</span>
            </button>
            <button
              onClick={() => setContentTab('clips_matrix')}
              className="app-button app-button-secondary text-xs"
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              <span>Matriz Completa</span>
            </button>
          </div>
        </div>

        {/* 4 KPIs Claros del Canal */}
        <div className="mt-5 pt-4 border-t border-[#1e2129] grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg bg-[#0e1014] border border-[#1e2129] p-3">
            <span className="text-[11px] text-[#848d97] block">Clips en Stock Virgen</span>
            <div className="text-xl font-bold text-white tabular-nums mt-0.5">
              {virginStockClips.length} <span className="text-xs font-normal text-[#848d97]">/ {filteredClips.length}</span>
            </div>
            <span className="text-[10px] text-[#848d97] block mt-0.5">Listos para publicar</span>
          </div>

          <div className="rounded-lg bg-[#0e1014] border border-[#1e2129] p-3">
            <span className="text-[11px] text-[#848d97] block">Runway de Cobertura</span>
            <div className="text-xl font-bold text-white tabular-nums mt-0.5">
              {daysRemaining} días
            </div>
            <span className="text-[10px] text-[#848d97] block mt-0.5">A {currentChannel.shortsPerDay} shorts/día</span>
          </div>

          <div className="rounded-lg bg-[#0e1014] border border-[#1e2129] p-3">
            <span className="text-[11px] text-[#848d97] block">Clips Publicados</span>
            <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
              {publishedClips.length} emitidos
            </div>
            <span className="text-[10px] text-[#848d97] block mt-0.5">En YouTube / TikTok</span>
          </div>

          <div className="rounded-lg bg-[#0e1014] border border-[#1e2129] p-3">
            <span className="text-[11px] text-[#848d97] block">Horarios de Emisión</span>
            <div className="text-xs font-bold text-white truncate mt-1">
              {currentChannel.timeSlots?.join(' • ') || '14:00 • 20:00 ART'}
            </div>
            <span className="text-[10px] text-[#848d97] block mt-0.5">Slots diarios oficiales</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TABLA DE DISTRIBUCIÓN POR PLATAFORMA */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] overflow-hidden">
        <div className="p-4 border-b border-[#1e2129] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Estado de Sindicación por Plataforma</h3>
            <p className="text-xs text-[#848d97]">Desglose de clips listos, programados y publicados para este canal</p>
          </div>
          <button
            onClick={() => setContentTab('parrilla')}
            className="text-xs font-medium text-sky-400 hover:text-sky-300 transition flex items-center space-x-1"
          >
            <span>Auto-programar slots</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1014] text-[11px] font-semibold uppercase tracking-wider text-[#848d97] border-b border-[#1e2129]">
              <tr>
                <th className="py-2.5 px-4">Plataforma</th>
                <th className="py-2.5 px-4">Perfil Oficial</th>
                <th className="py-2.5 px-4 text-right">En Stock</th>
                <th className="py-2.5 px-4 text-right">Programados</th>
                <th className="py-2.5 px-4 text-right">Publicados</th>
                <th className="py-2.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b21]">
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
                    <td className="py-2.5 px-4">
                      <div className="flex items-center space-x-2">
                        <PlatformIcon platform={p.iconKey} size={15} />
                        <span className="font-semibold text-white">{p.label}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
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

                    <td className="py-2.5 px-4 text-right tabular-nums text-white font-medium">
                      {stockCount} clips
                    </td>

                    <td className="py-2.5 px-4 text-right tabular-nums text-amber-400 font-medium">
                      {schedCount}
                    </td>

                    <td className="py-2.5 px-4 text-right tabular-nums text-emerald-400 font-medium">
                      {pubCount}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => setContentTab('parrilla')}
                        className="text-[11px] px-2.5 py-1 rounded border border-[#262a34] bg-[#16181e] text-[#848d97] hover:text-white hover:border-[#2c313d] transition cursor-pointer"
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

      {/* ========================================================= */}
      {/* 3. CATÁLOGO EXCLUSIVO DEL CANAL ACTIVO (SIN MEZCLAR) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Clips de {currentChannel.name} ({displayedClips.length})
            </h2>
            <p className="text-xs text-[#848d97]">
              Inventario vertical 9:16 de este canal con sus estados de emisión
            </p>
          </div>

          {/* Filtro Simple por Estado */}
          <div className="flex items-center rounded-lg bg-[#13151a] p-0.5 border border-[#1e2129]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#22262f] text-white font-semibold'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Todos ({filteredClips.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-[#22262f] text-white font-semibold'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              En stock ({virginStockClips.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === 'published'
                  ? 'bg-[#22262f] text-emerald-400 font-semibold'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Publicados ({publishedClips.length})
            </button>
          </div>
        </div>

        {/* Grid de Tarjetas Limpias (Solo del canal seleccionado) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedClips.map((clip) => {
            const isPublishedOnYt = clip.platforms?.YOUTUBE_SHORT?.status === 'PUBLISHED';
            const isPublishedOnTt = clip.platforms?.TIKTOK?.status === 'PUBLISHED';
            const ytUrl = clip.platforms?.YOUTUBE_SHORT?.url;
            const ttUrl = clip.platforms?.TIKTOK?.url;
            const isUrgent = clip.isUrgent;

            return (
              <div
                key={clip.id}
                className={`rounded-xl border bg-[#13151a] overflow-hidden transition flex flex-col justify-between ${
                  isUrgent ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-[#1e2129] hover:border-[#2c313d]'
                }`}
              >
                <div>
                  {/* Header de la tarjeta */}
                  <div className="p-3.5 pb-2.5 flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-mono font-bold text-white">
                        #{clip.clipNumber < 10 ? `0${clip.clipNumber}` : clip.clipNumber}
                      </span>
                      <span className="text-[10px] text-[#848d97] font-mono">
                        {clip.id}
                      </span>
                      {isUrgent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          URGENTE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      {isPublishedOnYt ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                          Publicado
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-[#848d97] bg-[#16181e] border border-[#21242c]">
                          En stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail & Video Preview */}
                  <div className="relative aspect-[16/9] w-full bg-[#0a0b0d] overflow-hidden border-y border-[#181b21]">
                    <img
                      src={getClipThumbnail(clip)}
                      alt={clip.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = currentChannel.bannerUrl || '/channels/blackflag-banner.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Duración */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white border border-white/10">
                      {clip.durationSec}s
                    </div>

                    {/* Botón Ver si está publicado */}
                    {(ytUrl || ttUrl) && (
                      <a
                        href={ytUrl || ttUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-600/90 text-white hover:bg-red-600 transition"
                      >
                        <Play className="h-2.5 w-2.5 fill-current" />
                        <span>Ver video</span>
                      </a>
                    )}
                  </div>

                  {/* Título & Hook */}
                  <div className="p-3.5 space-y-2">
                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {clip.title}
                    </h3>

                    {clip.hook && (
                      <p className="text-[11px] text-[#848d97] line-clamp-2 italic bg-[#0e1014] p-2 rounded border border-[#181b21]">
                        "{clip.hook}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer con badges de redes y botón Ripple Shift */}
                <div className="p-3.5 pt-2 border-t border-[#181b21] bg-[#0f1115] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* YouTube badge */}
                    <div
                      title={`YouTube: ${clip.platforms?.YOUTUBE_SHORT?.status || 'PENDING'}`}
                      className={`h-5 w-5 rounded flex items-center justify-center border text-[9px] ${
                        clip.platforms?.YOUTUBE_SHORT?.status === 'PUBLISHED'
                          ? 'bg-red-950/60 border-red-500/40 text-red-400'
                          : clip.platforms?.YOUTUBE_SHORT?.status === 'SCHEDULED'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                          : 'bg-[#181b21] border-[#262a34] text-[#848d97]'
                      }`}
                    >
                      <PlatformIcon platform="YOUTUBE" size={11} />
                    </div>

                    {/* TikTok badge */}
                    <div
                      title={`TikTok: ${clip.platforms?.TIKTOK?.status || 'PENDING'}`}
                      className={`h-5 w-5 rounded flex items-center justify-center border text-[9px] ${
                        clip.platforms?.TIKTOK?.status === 'PUBLISHED'
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400'
                          : clip.platforms?.TIKTOK?.status === 'SCHEDULED'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                          : 'bg-[#181b21] border-[#262a34] text-[#848d97]'
                      }`}
                    >
                      <PlatformIcon platform="TIKTOK" size={11} />
                    </div>

                    {/* Instagram badge */}
                    <div
                      title={`Instagram: ${clip.platforms?.INSTAGRAM_REEL?.status || 'PENDING'}`}
                      className={`h-5 w-5 rounded flex items-center justify-center border text-[9px] ${
                        clip.platforms?.INSTAGRAM_REEL?.status === 'PUBLISHED'
                          ? 'bg-pink-950/60 border-pink-500/40 text-pink-400'
                          : clip.platforms?.INSTAGRAM_REEL?.status === 'SCHEDULED'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                          : 'bg-[#181b21] border-[#262a34] text-[#848d97]'
                      }`}
                    >
                      <PlatformIcon platform="INSTAGRAM" size={11} />
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Botón copiar título */}
                    <button
                      onClick={() => handleCopy(clip.title, clip.id)}
                      title="Copiar título del clip"
                      className="p-1 rounded text-[#848d97] hover:text-white hover:bg-[#181b21] transition cursor-pointer"
                    >
                      {copiedId === clip.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>

                    {/* Botón Ripple Shift (Urgente) */}
                    <button
                      onClick={() => triggerRippleShift(clip.id)}
                      title="Marcar como URGENTE y adelantar al turno inmediato"
                      className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition cursor-pointer"
                    >
                      <Zap className="h-2.5 w-2.5 fill-current" />
                      <span>Turno Ya</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
