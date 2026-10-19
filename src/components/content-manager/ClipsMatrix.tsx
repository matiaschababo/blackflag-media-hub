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
  Clock,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon, XIcon, TikTokIcon } from '../ui/SocialIcons';

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
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="h-3 w-3" />
            <span>PUB.</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Clock className="h-3 w-3" />
            <span>PROG.</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-zinc-800 text-zinc-400 border border-zinc-700">
            <span>PEND.</span>
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

  return (
    <div className="space-y-6">
      {/* Broadcast Studio Header */}
      <div className="relative rounded-2xl border border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-[#121217] to-zinc-950 p-6 backdrop-blur-xl shadow-xl overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-15 pointer-events-none -z-0"
          style={{ backgroundColor: currentChannel.accentColor }}
        ></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${currentChannel.accentColor}25`,
                  color: currentChannel.accentColor,
                }}
              >
                ESTÁNDAR CORTE STUDIO
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                10 Nodos Virales (Clip-First)
              </span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-white tracking-tight sm:text-2xl">
              Matriz de Sindicación: 10 Clips Verticales (9:16)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Alimentado por: <strong className="text-white">{currentEp?.title}</strong> ({currentEp?.duration} min)
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-3.5 py-2 text-right">
              <div className="text-[9px] uppercase font-mono text-zinc-500 font-bold">SAFE ZONE</div>
              <div className="text-xs font-black text-amber-400">MarginV=720</div>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-3.5 py-2 text-right">
              <div className="text-[9px] uppercase font-mono text-zinc-500 font-bold">SUBTÍTULOS ASS</div>
              <div className="text-xs font-black text-white">Gold 60pt</div>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Clips Cards List */}
      <div className="space-y-4">
        {filteredClips.map((clip) => {
          return (
            <div
              key={clip.id}
              className={`rounded-2xl border transition-all duration-200 bg-[#121216] p-5 shadow-lg hover:shadow-2xl hover:border-zinc-700 relative overflow-hidden ${
                clip.isUrgent
                  ? 'border-amber-500/80 bg-amber-950/10 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                  : 'border-zinc-800/90'
              }`}
            >
              {clip.isUrgent && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black text-[10px] font-black px-3 py-0.5 rounded-bl-xl shadow-md flex items-center space-x-1">
                  <Flame className="h-3 w-3" />
                  <span>PRIORIDAD RIPPLE SHIFT</span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left: Info, Hook, Actions */}
                <div className="space-y-3 flex-1 max-w-2xl">
                  {/* Clip Header Line */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/90 text-xs font-black font-mono text-amber-400 border border-zinc-700 shadow-sm">
                      #{String(clip.clipNumber).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      {clip.title}
                    </h3>
                    <span className="inline-flex items-center space-x-1 rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] font-mono text-zinc-300 border border-zinc-700/60">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span>{clip.durationSec}s</span>
                      <span className="text-zinc-600">•</span>
                      <span>{clip.timestamps.start} - {clip.timestamps.end}</span>
                    </span>

                    {clip.hookRate ? (
                      <span className="inline-flex items-center space-x-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                        <span>Hook: {clip.hookRate}%</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Hook Quote Box (Mix On style) */}
                  <div className="rounded-xl bg-zinc-950/80 p-3.5 border border-zinc-800/80 text-xs text-zinc-200 leading-relaxed relative">
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                      HOOK EN SEGUNDO 0:03 (RETENTION GATE):
                    </span>
                    <p className="italic text-zinc-300 font-medium">
                      &ldquo;{clip.hook}&rdquo;
                    </p>
                  </div>

                  {/* Actions & File Name */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="text-[11px] font-mono text-zinc-500 truncate max-w-xs bg-zinc-900/60 px-2 py-1 rounded-md border border-zinc-800/60">
                      📁 {clip.file}
                    </span>

                    <button
                      onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                      className="studio-btn bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1.5 border border-zinc-800 space-x-1.5"
                    >
                      {copiedId === `t-${clip.id}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
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
                      className="studio-btn bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1.5 border border-zinc-800 space-x-1.5"
                    >
                      {copiedId === `c-${clip.id}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
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
                      className="studio-btn bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 border border-amber-500/30 space-x-1.5"
                    >
                      <Smartphone className="h-3.5 w-3.5 text-amber-400" />
                      <span>Simulador 9:16</span>
                    </button>
                  </div>
                </div>

                {/* Right: Platform Status Grid with Click-to-Cycle */}
                <div className="flex flex-col space-y-2.5 lg:items-end w-full lg:w-auto">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <span>SINDICACIÓN EN LAS 5 PLATAFORMAS (CLICK PARA CAMBIAR):</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full lg:w-auto">
                    {/* YouTube Short */}
                    <div
                      onClick={() =>
                        cycleStatus(clip.id, 'YOUTUBE_SHORT', clip.platforms.YOUTUBE_SHORT.status)
                      }
                      className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-red-500/60 transition cursor-pointer min-w-[84px] text-center active:scale-95 shadow-sm"
                    >
                      <div className="flex items-center space-x-1 mb-1.5">
                        <YoutubeIcon className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-[10px] font-bold text-zinc-300">Shorts</span>
                      </div>
                      {getStatusBadge(clip.platforms.YOUTUBE_SHORT.status)}
                    </div>

                    {/* Instagram Reel */}
                    <div
                      onClick={() =>
                        cycleStatus(clip.id, 'INSTAGRAM_REEL', clip.platforms.INSTAGRAM_REEL.status)
                      }
                      className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-pink-500/60 transition cursor-pointer min-w-[84px] text-center active:scale-95 shadow-sm"
                    >
                      <div className="flex items-center space-x-1 mb-1.5">
                        <InstagramIcon className="h-3.5 w-3.5 text-pink-400" />
                        <span className="text-[10px] font-bold text-zinc-300">Reels</span>
                      </div>
                      {getStatusBadge(clip.platforms.INSTAGRAM_REEL.status)}
                    </div>

                    {/* Facebook Reel */}
                    <div
                      onClick={() =>
                        cycleStatus(clip.id, 'FACEBOOK_REEL', clip.platforms.FACEBOOK_REEL.status)
                      }
                      className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-blue-500/60 transition cursor-pointer min-w-[84px] text-center active:scale-95 shadow-sm"
                    >
                      <div className="flex items-center space-x-1 mb-1.5">
                        <FacebookIcon className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-[10px] font-bold text-zinc-300">FB Reel</span>
                      </div>
                      {getStatusBadge(clip.platforms.FACEBOOK_REEL.status)}
                    </div>

                    {/* TikTok */}
                    <div
                      onClick={() =>
                        cycleStatus(clip.id, 'TIKTOK', clip.platforms.TIKTOK.status)
                      }
                      className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-cyan-400/60 transition cursor-pointer min-w-[84px] text-center active:scale-95 shadow-sm"
                    >
                      <div className="flex items-center space-x-1 mb-1.5">
                        <TikTokIcon className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-[10px] font-bold text-zinc-300">TikTok</span>
                      </div>
                      {getStatusBadge(clip.platforms.TIKTOK.status)}
                    </div>

                    {/* X Twitter */}
                    <div
                      onClick={() =>
                        cycleStatus(clip.id, 'X_TWITTER', clip.platforms.X_TWITTER.status)
                      }
                      className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-sky-400/60 transition cursor-pointer min-w-[84px] text-center active:scale-95 shadow-sm"
                    >
                      <div className="flex items-center space-x-1 mb-1.5">
                        <XIcon className="h-3.5 w-3.5 text-sky-400" />
                        <span className="text-[10px] font-bold text-zinc-300">X (Post)</span>
                      </div>
                      {getStatusBadge(clip.platforms.X_TWITTER.status)}
                    </div>
                  </div>

                  {/* Ripple Shift Trigger */}
                  <div className="pt-1.5 flex items-center justify-end w-full">
                    <button
                      onClick={() => triggerRippleShift(clip.id)}
                      className="studio-btn w-full sm:w-auto bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 space-x-1.5 shadow-sm"
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
