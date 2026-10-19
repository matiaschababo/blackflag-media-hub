'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Clip, Platform, PublicationStatus } from '../../types';
import {
  Copy,
  ExternalLink,
  Flame,
  Check,
  Eye,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ClipsMatrixProps {
  onOpenClipDetail: (clip: Clip) => void;
}

export const ClipsMatrix: React.FC<ClipsMatrixProps> = ({ onOpenClipDetail }) => {
  const {
    currentChannel,
    episodes,
    filteredClips,
    updateClipStatus,
    triggerRippleShift,
  } = useHolding();

  const [copiedId, setCopiedId] = useState<string | null>(null);

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
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            ✓ PUB.
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            🗓️ PROG.
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            ⏳ PEND.
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            ✕ ERROR
          </span>
        );
    }
  };

  const toggleStatus = (clipId: string, plat: Platform, currentStatus: PublicationStatus) => {
    const nextStatus: Record<PublicationStatus, PublicationStatus> = {
      PENDING: 'SCHEDULED',
      SCHEDULED: 'PUBLISHED',
      PUBLISHED: 'PENDING',
      FAILED: 'SCHEDULED',
    };
    updateClipStatus(clipId, plat, nextStatus[currentStatus]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              ESTÁNDAR CORTE STUDIO
            </span>
            <span className="text-xs text-zinc-400 font-mono">10 Clips por Episodio</span>
          </div>
          <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
            Matriz de 10 Nodos Virales (Clip-First)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Episodio 01: <span className="text-white font-semibold">{currentEp?.title}</span> ({currentEp?.duration})
          </p>
        </div>

        {/* Quick Episode Info & Safe Zone pill */}
        <div className="flex items-center space-x-2.5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-right">
            <div className="text-[10px] uppercase font-mono text-zinc-400">SAFE ZONE</div>
            <div className="text-xs font-bold text-amber-400">MarginV=720</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-right">
            <div className="text-[10px] uppercase font-mono text-zinc-400">SUBTÍTULOS</div>
            <div className="text-xs font-bold text-white">Montserrat Bold</div>
          </div>
        </div>
      </div>

      {/* The 10 Clips Table / Card List */}
      <div className="space-y-3">
        {filteredClips.map((clip) => {
          return (
            <div
              key={clip.id}
              className={`rounded-2xl border transition-all ${
                clip.isUrgent
                  ? 'border-amber-500/60 bg-amber-950/10 shadow-lg shadow-amber-500/5'
                  : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700/80'
              } p-4 sm:p-5`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Clip Number, Title, Hook and Timestamps */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-black font-mono text-amber-400 border border-zinc-700/60">
                      #{clip.clipNumber.toString().padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-bold text-white sm:text-base">
                      {clip.title}
                    </h3>
                    <span className="inline-flex items-center space-x-1 rounded-md bg-zinc-800/60 px-2 py-0.5 text-[11px] font-mono text-zinc-400 border border-zinc-700/40">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>{clip.durationSec}s</span>
                      <span className="text-zinc-600">•</span>
                      <span>{clip.timestamps.start} - {clip.timestamps.end}</span>
                    </span>
                    {clip.isUrgent && (
                      <span className="inline-flex items-center space-x-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400 border border-amber-500/40">
                        <Flame className="h-3 w-3" />
                        <span>RIPPLE PRIORITY</span>
                      </span>
                    )}
                  </div>

                  {/* Hook preview */}
                  <div className="rounded-xl bg-zinc-950/70 p-2.5 border border-zinc-800/60 text-xs text-zinc-300">
                    <span className="font-bold text-amber-400/90 font-mono text-[10px] uppercase tracking-wider block mb-0.5">
                      HOOK EN SEGUNDO 0:03:
                    </span>
                    &ldquo;{clip.hook}&rdquo;
                  </div>

                  {/* File name & quick copy actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-zinc-400 truncate max-w-xs">
                      📁 {clip.file}
                    </span>

                    <button
                      onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                      title="Copiar título limpio"
                    >
                      {copiedId === `t-${clip.id}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar Título</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(clip.captions.instagram, `c-${clip.id}`)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                      title="Copiar copy oficial para redes"
                    >
                      {copiedId === `c-${clip.id}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copy Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenClipDetail(clip)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                    >
                      <Eye className="h-3 w-3 text-amber-400" />
                      <span>Ver Simulador Safe Zone</span>
                    </button>
                  </div>
                </div>

                {/* Right: Multi-Platform Publication Matrix for this clip */}
                <div className="flex flex-col space-y-2 lg:items-end">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">
                    ESTADO EN LAS 5 PLATAFORMAS (CLICK PARA CAMBIAR):
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {/* YouTube Short */}
                    <button
                      onClick={() => toggleStatus(clip.id, 'YOUTUBE_SHORT', clip.platforms.YOUTUBE_SHORT.status)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-red-500/50 transition cursor-pointer min-w-[76px]"
                    >
                      <span className="text-[10px] font-bold text-red-400 mb-1">YT Short</span>
                      {getStatusBadge(clip.platforms.YOUTUBE_SHORT.status)}
                    </button>

                    {/* Instagram Reel */}
                    <button
                      onClick={() => toggleStatus(clip.id, 'INSTAGRAM_REEL', clip.platforms.INSTAGRAM_REEL.status)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-pink-500/50 transition cursor-pointer min-w-[76px]"
                    >
                      <span className="text-[10px] font-bold text-pink-400 mb-1">IG Reel</span>
                      {getStatusBadge(clip.platforms.INSTAGRAM_REEL.status)}
                    </button>

                    {/* Facebook Reel */}
                    <button
                      onClick={() => toggleStatus(clip.id, 'FACEBOOK_REEL', clip.platforms.FACEBOOK_REEL.status)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-blue-500/50 transition cursor-pointer min-w-[76px]"
                    >
                      <span className="text-[10px] font-bold text-blue-400 mb-1">FB Reel</span>
                      {getStatusBadge(clip.platforms.FACEBOOK_REEL.status)}
                    </button>

                    {/* TikTok */}
                    <button
                      onClick={() => toggleStatus(clip.id, 'TIKTOK', clip.platforms.TIKTOK.status)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-cyan-500/50 transition cursor-pointer min-w-[76px]"
                    >
                      <span className="text-[10px] font-bold text-cyan-400 mb-1">TikTok</span>
                      {getStatusBadge(clip.platforms.TIKTOK.status)}
                    </button>

                    {/* X Twitter */}
                    <button
                      onClick={() => toggleStatus(clip.id, 'X_TWITTER', clip.platforms.X_TWITTER.status)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-sky-500/50 transition cursor-pointer min-w-[76px]"
                    >
                      <span className="text-[10px] font-bold text-sky-400 mb-1">X (Twitter)</span>
                      {getStatusBadge(clip.platforms.X_TWITTER.status)}
                    </button>
                  </div>

                  {/* Priority / Ripple Shift Action */}
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => triggerRippleShift(clip.id)}
                      className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:from-amber-500/30 hover:to-amber-600/30 transition shadow-sm"
                    >
                      <Flame className="h-3.5 w-3.5 text-amber-400" />
                      <span>Despachar Próximo Turno (+1 Ripple)</span>
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
