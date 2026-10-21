'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Clip, Platform, PublicationStatus } from '../../types';
import {
  Copy,
  Check,
  Clock,
  Smartphone,
  Calendar,
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
                Estándar Corte Studio • 10 Nodos Virales (9:16)
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Matriz de Sindicación de Clips
              </h2>
              <div className="text-xs text-[#848d97] mt-0.5">
                Episodio: <strong className="text-white font-medium">{currentEp?.title || 'Episodio 01'}</strong> ({currentEp?.duration || '14:53'} min)
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
      </div>

      {/* 10 Clips Cards List (Flat, Anti-Slop, High Contrast) */}
      <div className="space-y-2.5">
        {filteredClips.map((clip) => {
          return (
            <div
              key={clip.id}
              className={`rounded-xl border bg-[#13151a] p-4 transition ${
                clip.isUrgent
                  ? 'border-amber-500/40 bg-[#16171d]'
                  : 'border-[#1e2129] hover:border-[#2c313d]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left: Info, Hook, Actions */}
                <div className="space-y-2.5 flex-1 max-w-2xl">
                  {/* Clip Header Line */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1e2129] text-[11px] font-bold text-white tabular-nums">
                      {clip.clipNumber}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {clip.title}
                    </h3>
                    <span className="text-[11px] text-[#848d97] tabular-nums">
                      {clip.durationSec}s • {clip.timestamps.start} - {clip.timestamps.end}
                    </span>
                    {clip.isUrgent && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 font-medium">
                        Prioritario
                      </span>
                    )}
                  </div>

                  {/* Hook Quote Box */}
                  <div className="rounded-lg bg-[#0c0d10] p-2.5 border border-[#1e2129] text-xs">
                    <span className="text-[10px] text-[#848d97] block mb-0.5">
                      Hook 0:03:
                    </span>
                    <p className="text-[#f0f2f5] italic font-sans">
                      &ldquo;{clip.hook}&rdquo;
                    </p>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] text-[#848d97] tabular-nums bg-[#0c0d10] px-2 py-0.5 rounded border border-[#1e2129]">
                      {clip.file}
                    </span>

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
                      onClick={() => handleCopy(clip.captions.instagram, `c-${clip.id}`)}
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
                <div className="flex flex-col space-y-1.5 lg:items-end w-full lg:w-auto">
                  <span className="text-[10px] text-[#848d97]">
                    Sindicación multi-red (clic para cambiar):
                  </span>

                  <div className="grid grid-cols-5 gap-1.5 w-full lg:w-auto">
                    {platformsList.map((p) => {
                      const record = clip.platforms[p.key];
                      return (
                        <div
                          key={p.key}
                          onClick={() => cycleStatus(clip.id, p.key, record.status)}
                          className="flex flex-col items-center justify-between p-2 rounded-lg bg-[#0c0d10] border border-[#1e2129] hover:border-[#2c313d] transition cursor-pointer min-w-[72px] text-center"
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