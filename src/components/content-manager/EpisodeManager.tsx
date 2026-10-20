'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Tv,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  FileText,
  Mic,
  Video,
  Play,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const EpisodeManager: React.FC = () => {
  const { currentChannel, episodes, setContentTab } = useHolding();
  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-[#121217] p-5 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              LONG-FORM MASTER (1440P VP9/AV1)
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Series Playlists & Up-Next Monopoly
            </span>
          </div>
          <h2 className="mt-1.5 text-xl font-extrabold text-white tracking-tight sm:text-2xl">
            Episodios y Documentales Largos (VOD)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cada episodio largo alimenta automáticamente los 10 nodos virales para Corte Studio.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-right font-mono">
          <div className="text-[10px] uppercase text-zinc-400">TOTAL EPISODIOS</div>
          <div className="text-base font-extrabold text-white">
            {channelEpisodes.length} {channelEpisodes.length === 1 ? 'Episodio' : 'Episodios'}
          </div>
        </div>
      </div>

      {/* Episode Cards */}
      <div className="grid grid-cols-1 gap-6">
        {channelEpisodes.map((ep) => {
          return (
            <div
              key={ep.id}
              className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-5 sm:p-6 shadow-xl transition hover:border-zinc-700/80"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* 16:9 Real Thumbnail */}
                <div className="relative aspect-video w-full lg:w-96 shrink-0 rounded-xl bg-black border border-white/10 overflow-hidden shadow-2xl group">
                  <img
                    src={ep.thumbnailUrl || '/thumbnails/ep01-blackflag.png'}
                    alt={ep.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="rounded bg-amber-500 text-zinc-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
                      EPISODIO #{ep.episodeNumber.toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 rounded bg-black/80 backdrop-blur-md text-white px-2.5 py-0.5 text-xs font-mono font-bold border border-white/20">
                    {ep.duration}
                  </div>

                  {/* Resolution Badge */}
                  <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-300">
                    1440p (VP9/AV1) • 60 FPS
                  </div>
                </div>

                {/* Episode Details */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {currentChannel.name} • Episodio #{ep.episodeNumber}
                      </span>

                      <span className="inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{ep.status === 'PUBLISHED' ? 'PUBLICADO EN YOUTUBE' : ep.status}</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-snug">
                      {ep.title}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Estructura de retención con curva de atención auditada, guion cerrado con Session Loops, y generación de 10 clips virales 9:16 con subtítulos dorados ASS.
                    </p>
                  </div>

                  {/* Technical & Performance Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                    <div className="rounded-xl bg-black/50 p-2.5 border border-zinc-800/80">
                      <span className="text-[9px] uppercase text-zinc-400 block font-bold">Vistas YouTube</span>
                      <span className="text-sm font-extrabold text-white">{ep.totalViews || 28} vistas</span>
                    </div>

                    <div className="rounded-xl bg-black/50 p-2.5 border border-zinc-800/80">
                      <span className="text-[9px] uppercase text-zinc-400 block font-bold">Guion (Script)</span>
                      <span className="text-xs font-bold text-emerald-400">{ep.scriptStatus}</span>
                    </div>

                    <div className="rounded-xl bg-black/50 p-2.5 border border-zinc-800/80">
                      <span className="text-[9px] uppercase text-zinc-400 block font-bold">Voz & Audio</span>
                      <span className="text-xs font-bold text-zinc-300 truncate block">{ep.audioEngine}</span>
                    </div>

                    <div className="rounded-xl bg-black/50 p-2.5 border border-zinc-800/80">
                      <span className="text-[9px] uppercase text-zinc-400 block font-bold">Video Engine</span>
                      <span className="text-xs font-bold text-zinc-300 truncate block">{ep.renderEngine}</span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={ep.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="studio-btn bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 space-x-2 shadow-lg shadow-red-600/20"
                    >
                      <PlatformIcon platform="YOUTUBE" size={15} />
                      <span>Ver en YouTube Oficial</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>

                    <button
                      onClick={() => setContentTab('clips_matrix')}
                      className="studio-btn bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold px-4 py-2 space-x-2"
                    >
                      <Layers className="h-3.5 w-3.5 text-amber-400" />
                      <span>Ver 10 Clips Derivados ({ep.clipsCount})</span>
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