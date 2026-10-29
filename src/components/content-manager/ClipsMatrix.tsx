'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Clip, Platform, PublicationStatus } from '../../types';
import { getClipThumbnail } from '../../lib/supabase';
import {
  Copy,
  Check,
  Smartphone,
  Calendar,
  ExternalLink,
  Play,
  Zap,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

interface ClipsMatrixProps {
  onOpenClipDetail: (clip: Clip) => void;
}

export const ClipsMatrix: React.FC<ClipsMatrixProps> = ({ onOpenClipDetail }) => {
  const {
    currentChannel,
    allClips,
    selectedChannelId,
    updateClipStatus,
    setContentTab,
  } = useHolding();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>(selectedChannelId || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'pending'>('all');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: PublicationStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            Publicado
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20">
            Programado
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-xs text-[#848d97] bg-[#16181e] border border-[#21242c]">
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
    <div className="space-y-5" data-testid="clips-matrix">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-12 w-12 rounded-xl object-cover border border-[#2a2e39] shrink-0"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Matriz de Sindicación Multicanal
              </h2>
              <div className="text-xs sm:text-sm text-[#848d97] font-mono mt-0.5">
                {currentChannel.name} • {displayedClips.length} piezas catalogadas
              </div>
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
          </div>
        </div>

        {/* Segmented Filter Strip */}
        <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs sm:text-sm">
            <button
              onClick={() => setChannelFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                channelFilter === 'all'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Todos ({allClips.length})
            </button>
            <button
              onClick={() => setChannelFilter('levelpop')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                channelFilter === 'levelpop'
                  ? 'bg-zinc-800 text-cyan-400 font-bold'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Level Pop ({allClips.filter((c) => c.channelId === 'levelpop').length})
            </button>
            <button
              onClick={() => setChannelFilter('blackflag')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                channelFilter === 'blackflag'
                  ? 'bg-zinc-800 text-amber-400 font-bold'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              BlackFlag ({allClips.filter((c) => c.channelId === 'blackflag').length})
            </button>
            <button
              onClick={() => setChannelFilter('podmon')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                channelFilter === 'podmon'
                  ? 'bg-zinc-800 text-yellow-400 font-bold'
                  : 'text-[#848d97] hover:text-white'
              }`}
            >
              Podmon ({allClips.filter((c) => c.channelId === 'podmon').length})
            </button>
          </div>

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

      {/* Clips Cards List with Real Visual Thumbnails */}
      <div className="space-y-4">
        {displayedClips.map((clip) => {
          const ytUrl = clip.platforms?.YOUTUBE_SHORT?.url;
          const isScheduledTt = clip.platforms?.TIKTOK?.status === 'SCHEDULED';
          const thumbSrc = getClipThumbnail(clip);

          return (
            <div
              key={clip.id}
              data-clip-id={clip.id}
              data-channel-id={clip.channelId}
              className={`rounded-2xl border bg-zinc-900/60 p-5 transition ${
                clip.isUrgent
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
                {/* Visual Thumbnail (9:16 Vertical Preview) */}
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
                      <span className="text-xs font-mono text-[#848d97] uppercase px-2 py-0.5 rounded bg-black/60">
                        {clip.id}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-1.5 left-1.5 bg-black/85 text-sky-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-sky-500/30 font-bold">
                    9:16 SHORT
                  </div>

                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white font-mono text-xs px-1.5 py-0.5 rounded border border-white/10 font-bold">
                    {clip.durationSec}s
                  </div>
                </div>

                {/* Center: Info, Hook, Actions */}
                <div className="space-y-2.5 flex-1 max-w-3xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-xs font-bold text-white tabular-nums">
                      {clip.clipNumber}
                    </span>

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

                    <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                      {clip.title}
                    </h3>

                    <span className="text-xs text-[#848d97] font-mono">
                      {clip.timestamps.start} - {clip.timestamps.end}
                    </span>

                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Subtítulos ASS Dorados #FFD700 (60 FPS)
                    </span>

                    {(clip.views ?? 0) > 0 && (
                      <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                        {(clip.views ?? 0).toLocaleString()} vistas
                      </span>
                    )}

                    {clip.isUrgent && (
                      <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                        Prioritario
                      </span>
                    )}
                  </div>

                  {/* Clean Quoted Hook */}
                  {clip.hook && (
                    <blockquote className="rounded-xl bg-[#0c0d10] p-3 border border-zinc-800 text-xs sm:text-sm text-[#f0f2f5] italic font-sans line-clamp-2 leading-relaxed">
                      &ldquo;{clip.hook}&rdquo;
                    </blockquote>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm pt-1">
                    {ytUrl && (
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer flex items-center space-x-1.5 font-bold"
                      >
                        <PlatformIcon platform="YOUTUBE" size={14} />
                        <span>Shorts</span>
                        <ExternalLink className="h-3 w-3 ml-0.5" />
                      </a>
                    )}

                    {isScheduledTt && (
                      <span className="px-2.5 py-1 rounded-lg border border-pink-500/30 bg-pink-500/10 text-pink-400 flex items-center space-x-1.5 text-xs font-semibold">
                        <PlatformIcon platform="TIKTOK" size={14} />
                        <span>Buffer</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                      className="px-2.5 py-1 rounded-lg border border-[#21242c] bg-[#16181e] text-[#848d97] hover:text-white transition cursor-pointer flex items-center space-x-1.5"
                    >
                      {copiedId === `t-${clip.id}` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copiar título</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleCopy(
                          `${clip.title}\n\n${clip.hook}\n\n${clip.timestamps.start} - ${clip.timestamps.end}`,
                          `f-${clip.id}`
                        )
                      }
                      className="px-2.5 py-1 rounded-lg border border-[#21242c] bg-[#16181e] text-[#848d97] hover:text-white transition cursor-pointer flex items-center space-x-1.5"
                    >
                      {copiedId === `f-${clip.id}` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Ficha Copiada</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="h-3.5 w-3.5" />
                          <span>Ficha Móvil</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenClipDetail(clip)}
                      className="px-3 py-1 rounded-lg border border-[#262a34] bg-[#181b21] hover:bg-[#20242c] text-sky-400 hover:text-sky-300 transition cursor-pointer font-semibold ml-auto"
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>

                {/* Right: Platforms Matrix Status Pills */}
                <div className="flex sm:flex-col items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1e2129] w-full sm:w-auto justify-end">
                  {platformsList.map((p) => {
                    const st = clip.platforms[p.key]?.status || 'PENDING';
                    return (
                      <button
                        key={p.key}
                        onClick={() => cycleStatus(clip.id, p.key, st)}
                        title={`Cambiar estado ${p.label} (Clic para ciclar)`}
                        className="flex items-center space-x-2 px-2.5 py-1 rounded-lg border border-[#1e2129] bg-[#0c0d10] hover:border-[#2a2f3a] transition cursor-pointer"
                      >
                        <PlatformIcon platform={p.iconKey} size={14} />
                        <span className="text-xs text-[#848d97] hidden lg:inline">{p.label}</span>
                        {getStatusBadge(st)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
