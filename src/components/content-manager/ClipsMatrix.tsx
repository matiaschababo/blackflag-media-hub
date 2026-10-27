'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Clip, Platform, PublicationStatus } from '../../types';
import { getClipThumbnail } from '../../lib/supabase';
import {
  Copy,
  Check,
  Clock,
  Smartphone,
  Calendar,
  ExternalLink,
  Play,
  Layers,
  Filter,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

interface ClipsMatrixProps {
  onOpenClipDetail: (clip: Clip) => void;
}

export const ClipsMatrix: React.FC<ClipsMatrixProps> = ({ onOpenClipDetail }) => {
  const {
    currentChannel,
    episodes,
    allClips,
    filteredClips,
    selectedChannelId,
    setSelectedChannelId,
    updateClipStatus,
    triggerRippleShift,
    setContentTab,
  } = useHolding();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>(selectedChannelId || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'pending'>('all');

  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);
  const currentEp = channelEpisodes[0] || episodes[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: PublicationStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            Publicado
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
            Programado
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] text-[#848d97] bg-[#16181e] border border-[#21242c]">
            En stock
          </span>
        );
    }
  };

  const cycleStatus = (
    clipId: string,
    platform: Platform,
    currentStatus: PublicationStatus
  ) => {
    const nextStatus: Record<PublicationStatus, PublicationStatus> = {
      PENDING: 'SCHEDULED',
      SCHEDULED: 'PUBLISHED',
      PUBLISHED: 'PENDING',
      FAILED: 'PENDING',
    };
    updateClipStatus(clipId, platform, nextStatus[currentStatus]);
  };

  const platformsList: Array<{ key: Platform; label: string; iconKey: string }> = [
    { key: 'YOUTUBE_SHORT', label: 'Shorts', iconKey: 'YOUTUBE' },
    { key: 'INSTAGRAM_REEL', label: 'Reels', iconKey: 'INSTAGRAM' },
    { key: 'TIKTOK', label: 'TikTok', iconKey: 'TIKTOK' },
    { key: 'FACEBOOK_REEL', label: 'FB Reel', iconKey: 'FACEBOOK' },
    { key: 'X_TWITTER', label: 'X', iconKey: 'TWITTER' },
  ];

  // Apply filters
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
    <div className="space-y-4">
      {/* Top Header */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-10 w-10 rounded-lg object-cover border border-[#2a2e39] shrink-0"
            />
            <div>
              <div className="text-xs text-[#848d97]">
                Estándar Corte Studio • {displayedClips.length} Piezas en Catálogo
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Matriz de Sindicación de Clips & Shorts
              </h2>
              <div className="text-xs text-[#848d97] mt-0.5">
                Canal activo: <strong className="text-white font-medium">{currentChannel.name}</strong> • Mostrando {displayedClips.length} de {allClips.length} clips
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setContentTab('parrilla')}
              className="app-button app-button-secondary text-xs"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Ver parrilla</span>
            </button>
          </div>
        </div>

        {/* Filter Strip: Channel & Status Pills */}
        <div className="mt-4 pt-3 border-t border-[#1e2129] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#848d97] mr-1 flex items-center">
              <Filter className="h-3 w-3 mr-1" /> Canal:
            </span>
            <button
              onClick={() => setChannelFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'all'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-[#181b21] text-[#848d97] hover:text-white border border-[#21242c]'
              }`}
            >
              Todos ({allClips.length})
            </button>
            <button
              onClick={() => setChannelFilter('levelpop')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'levelpop'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-[#181b21] text-[#848d97] hover:text-white border border-[#21242c]'
              }`}
            >
              Level Pop ({allClips.filter((c) => c.channelId === 'levelpop').length})
            </button>
            <button
              onClick={() => setChannelFilter('blackflag')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'blackflag'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-[#181b21] text-[#848d97] hover:text-white border border-[#21242c]'
              }`}
            >
              BlackFlag ({allClips.filter((c) => c.channelId === 'blackflag').length})
            </button>
            <button
              onClick={() => setChannelFilter('podmon')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                channelFilter === 'podmon'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-[#181b21] text-[#848d97] hover:text-white border border-[#21242c]'
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
      </div>

      {/* Clips Cards List with Real Visual Thumbnails */}
      <div className="space-y-3">
        {displayedClips.map((clip) => {
          const ytUrl = clip.platforms?.YOUTUBE_SHORT?.url;
          const isPublishedYt = clip.platforms?.YOUTUBE_SHORT?.status === 'PUBLISHED';
          const isScheduledTt = clip.platforms?.TIKTOK?.status === 'SCHEDULED';
          const thumbSrc = getClipThumbnail(clip);

          return (
            <div
              key={clip.id}
              className={`rounded-xl border bg-[#13151a] p-4 transition ${
                clip.isUrgent
                  ? 'border-amber-500/40 bg-[#16171d]'
                  : 'border-[#1e2129] hover:border-[#2c313d]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                {/* Visual Thumbnail (9:16 Vertical Preview) */}
                <div className="relative w-20 sm:w-24 h-36 sm:h-40 rounded-lg overflow-hidden border border-[#262a34] bg-black shrink-0 group">
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
                      <div className="h-8 w-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      </div>
                    </a>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-[10px] font-mono text-[#848d97] uppercase px-1.5 py-0.5 rounded bg-black/60">
                        {clip.id}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 py-0.2 rounded border border-white/10">
                    {clip.durationSec}s
                  </div>
                </div>

                {/* Center: Info, Hook, Actions */}
                <div className="space-y-2 flex-1 max-w-2xl min-w-0">
                  {/* Clip Header Line */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1e2129] text-[11px] font-bold text-white tabular-nums">
                      {clip.clipNumber}
                    </span>

                    {/* Channel badge */}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      clip.channelId === 'levelpop'
                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                        : clip.channelId === 'blackflag'
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        : 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      {clip.channelId}
                    </span>

                    <h3 className="text-sm font-bold text-white truncate max-w-md">
                      {clip.title}
                    </h3>

                    <span className="text-[11px] text-[#848d97] tabular-nums">
                      {clip.timestamps.start} - {clip.timestamps.end}
                    </span>

                    {(clip.views ?? 0) > 0 && (
                      <span className="text-[10px] text-emerald-400 font-mono font-medium">
                        {(clip.views ?? 0).toLocaleString()} vistas
                      </span>
                    )}

                    {clip.isUrgent && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 font-medium">
                        Prioritario
                      </span>
                    )}
                  </div>

                  {/* Hook Quote Box */}
                  <div className="rounded-lg bg-[#0c0d10] p-2.5 border border-[#1e2129] text-xs">
                    <span className="text-[10px] text-[#848d97] block mb-0.5">
                      Gancho (Hook 0:03):
                    </span>
                    <p className="text-[#f0f2f5] italic font-sans line-clamp-2">
                      &ldquo;{clip.hook}&rdquo;
                    </p>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                    {ytUrl && (
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer flex items-center space-x-1"
                      >
                        <PlatformIcon platform="YOUTUBE" size={12} />
                        <span>Ver en YouTube Shorts</span>
                        <ExternalLink className="h-3 w-3 ml-0.5" />
                      </a>
                    )}

                    {isScheduledTt && (
                      <span className="px-2 py-0.5 rounded border border-pink-500/30 bg-pink-500/10 text-pink-400 flex items-center space-x-1 text-[11px]">
                        <PlatformIcon platform="TIKTOK" size={12} />
                        <span>Programado en Buffer</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                      className="px-2 py-0.5 rounded border border-[#21242c] bg-[#16181e] text-[#848d97] hover:text-white transition cursor-pointer flex items-center space-x-1"
                    >
                      {copiedId === `t-${clip.id}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Título</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(clip.captions.youtube || clip.captions.instagram, `c-${clip.id}`)}
                      className="px-2 py-0.5 rounded border border-[#21242c] bg-[#16181e] text-[#848d97] hover:text-white transition cursor-pointer flex items-center space-x-1"
                    >
                      {copiedId === `c-${clip.id}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenClipDetail(clip)}
                      className="px-2 py-0.5 rounded border border-[#21242c] bg-[#16181e] text-[#848d97] hover:text-white transition cursor-pointer flex items-center space-x-1"
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>Simulador 9:16</span>
                    </button>
                  </div>
                </div>

                {/* Right: Distribution Grid */}
                <div className="flex flex-col space-y-1.5 sm:items-end w-full sm:w-auto shrink-0">
                  <span className="text-[10px] text-[#848d97]">
                    Sindicación multi-red (clic para alternar):
                  </span>

                  <div className="grid grid-cols-5 gap-1.5 w-full sm:w-auto">
                    {platformsList.map((p) => {
                      const record = clip.platforms[p.key] || { status: 'PENDING' };
                      return (
                        <div
                          key={p.key}
                          onClick={() => cycleStatus(clip.id, p.key, record.status)}
                          className="flex flex-col items-center justify-between p-2 rounded-lg bg-[#0c0d10] border border-[#1e2129] hover:border-[#2c313d] transition cursor-pointer min-w-[64px] text-center"
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <PlatformIcon platform={p.iconKey} size={13} />
                            <span className="text-[10px] text-white font-medium">{p.label}</span>
                          </div>
                          {getStatusBadge(record.status)}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-1 flex items-center justify-end w-full">
                    <button
                      onClick={() => triggerRippleShift(clip.id)}
                      className="text-[11px] text-[#848d97] hover:text-white transition cursor-pointer"
                    >
                      Despachar próximo turno
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
