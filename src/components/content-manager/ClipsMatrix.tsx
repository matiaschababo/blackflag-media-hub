'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Clip, Platform, PublicationStatus } from '../../types';
import {
  Copy,
  Check,
  Clock,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Calendar,
  Flame,
  FileVideo,
  Layers,
  Tag,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

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
    setContentTab,
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
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm">
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>PUBLICADO</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm">
            <Clock className="h-2.5 w-2.5" />
            <span>PROGRAMADO</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
            <span>EN STOCK</span>
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
    { key: 'X_TWITTER', label: 'X (Post)', iconKey: 'TWITTER' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Ambient Header Banner */}
      <div className="relative rounded-2xl border border-zinc-800/90 bg-[#101014] p-5 sm:p-6 backdrop-blur-xl shadow-xl overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[110px] opacity-15 pointer-events-none -z-0"
          style={{ backgroundColor: currentChannel.accentColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-white/15 shadow-xl shrink-0 mt-0.5"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md"
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
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Matriz de Sindicación: 10 Clips Verticales (9:16)
              </h2>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>Alimentado por:</span>
                <strong className="text-zinc-200 font-bold">{currentEp?.title || 'Episodio 01'}</strong>
                <span className="text-zinc-400 font-mono">({currentEp?.duration || '14:53'} min)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="rounded-xl border border-zinc-800 bg-[#16161c] px-3 py-2 text-right">
              <div className="text-[9px] uppercase font-mono text-zinc-400 font-bold">SAFE ZONE</div>
              <div className="text-xs font-black text-amber-400 font-mono">MarginV=720</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-[#16161c] px-3 py-2 text-right">
              <div className="text-[9px] uppercase font-mono text-zinc-400 font-bold">SUBTÍTULOS ASS</div>
              <div className="text-xs font-black text-white font-mono">Gold 60pt</div>
            </div>
            <button
              onClick={() => setContentTab('parrilla')}
              className="studio-btn bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3.5 py-2.5 space-x-2 shadow-md shadow-amber-500/20"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Ver Parrilla 24/7</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Clips Cards List */}
      <div className="space-y-4">
        {filteredClips.map((clip) => {
          return (
            <div
              key={clip.id}
              className={`rounded-2xl border transition-all duration-200 bg-[#111116] p-4 sm:p-5 shadow-lg hover:shadow-2xl hover:border-zinc-700/80 relative overflow-hidden ${
                clip.isUrgent
                  ? 'border-amber-500/80 bg-amber-950/10 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                  : 'border-zinc-800/80'
              }`}
            >
              {clip.isUrgent && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black text-[9px] font-black px-2.5 py-0.5 rounded-bl-xl shadow-md flex items-center space-x-1 font-mono">
                  <Flame className="h-3 w-3" />
                  <span>PRIORIDAD RIPPLE SHIFT</span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left: Info, Hook, Actions */}
                <div className="space-y-3 flex-1 max-w-2xl">
                  {/* Clip Header Line */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-xs font-black font-mono text-amber-400 border border-zinc-700">
                      #{String(clip.clipNumber).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      {clip.title}
                    </h3>
                    <span className="inline-flex items-center space-x-1 rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-mono text-zinc-300 border border-zinc-800">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span>{clip.durationSec}s</span>
                      <span className="text-zinc-600">•</span>
                      <span>{clip.timestamps.start} - {clip.timestamps.end}</span>
                    </span>
                  </div>

                  {/* Hook Quote Box */}
                  <div className="rounded-xl bg-black/60 p-3 border border-zinc-800/80 text-xs text-zinc-200 leading-relaxed">
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                      HOOK EN SEGUNDO 0:03 (RETENTION GATE):
                    </span>
                    <p className="italic text-zinc-300 font-medium font-sans">
                      &ldquo;{clip.hook}&rdquo;
                    </p>
                  </div>

                  {/* Unified Action Toolbar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 truncate max-w-xs bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800/80 flex items-center gap-1.5">
                      <FileVideo className="h-3 w-3 text-zinc-400 shrink-0" />
                      <span className="truncate">{clip.file}</span>
                    </span>

                    <div className="inline-flex items-center rounded-xl bg-zinc-900/90 border border-zinc-800 p-0.5">
                      <button
                        onClick={() => handleCopy(clip.title, `t-${clip.id}`)}
                        className="studio-btn px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg space-x-1"
                      >
                        {copiedId === `t-${clip.id}` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-zinc-400" />
                            <span>Título</span>
                          </>
                        )}
                      </button>

                      <div className="w-[1px] h-3.5 bg-zinc-800 my-auto" />

                      <button
                        onClick={() => handleCopy(clip.captions.instagram, `c-${clip.id}`)}
                        className="studio-btn px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg space-x-1"
                      >
                        {copiedId === `c-${clip.id}` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-zinc-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <div className="w-[1px] h-3.5 bg-zinc-800 my-auto" />

                      <button
                        onClick={() => onOpenClipDetail(clip)}
                        className="studio-btn px-2.5 py-1 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-lg space-x-1"
                      >
                        <Smartphone className="h-3 w-3 text-amber-400" />
                        <span>Simulador 9:16</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Distribution Grid with Real Official Logos & Click to Toggle */}
                <div className="flex flex-col space-y-2 lg:items-end w-full lg:w-auto">
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between w-full">
                    <span>ESTADO EN LAS 5 PLATAFORMAS (CLICK PARA CAMBIAR):</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full lg:w-auto">
                    {platformsList.map((p) => {
                      const record = clip.platforms[p.key];
                      return (
                        <div
                          key={p.key}
                          onClick={() => cycleStatus(clip.id, p.key, record.status)}
                          className="flex flex-col items-center justify-between p-2 rounded-xl bg-black/60 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer min-w-[82px] text-center active:scale-95 shadow-sm"
                        >
                          <div className="flex items-center space-x-1.5 mb-1.5">
                            <PlatformIcon platform={p.iconKey} size={15} />
                            <span className="text-[10px] font-bold text-zinc-300">{p.label}</span>
                          </div>
                          {getStatusBadge(record.status)}
                        </div>
                      );
                    })}
                  </div>

                  {/* Ripple Shift Trigger */}
                  <div className="pt-1 flex items-center justify-end w-full">
                    <button
                      onClick={() => triggerRippleShift(clip.id)}
                      className="studio-btn w-full sm:w-auto bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 space-x-1.5 shadow-sm"
                    >
                      <Flame className="h-3 w-3 text-amber-400" />
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