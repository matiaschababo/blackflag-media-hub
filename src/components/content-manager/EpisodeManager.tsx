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
  Image as ImageIcon,
} from 'lucide-react';

export const EpisodeManager: React.FC = () => {
  const { currentChannel, episodes } = useHolding();
  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);

  return (
    <div className="space-y-6">
      {/* Header */}
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
              LONG-FORM MASTER (1440P VP9)
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Series Playlists & Up-Next Monopoly
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
            Episodios y Documentales Largos (VOD)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cada episodio largo alimenta automáticamente los 10 nodos virales para Corte Studio.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-right">
          <div className="text-[10px] uppercase font-mono text-zinc-400">TOTAL EPISODIOS</div>
          <div className="text-sm font-bold text-white">{channelEpisodes.length} Producidos</div>
        </div>
      </div>

      {/* Episode Cards */}
      <div className="grid grid-cols-1 gap-6">
        {channelEpisodes.map((ep) => {
          return (
            <div
              key={ep.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition hover:border-zinc-700/80"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* 16:9 Thumbnail Simulation */}
                <div className="relative aspect-video w-full lg:w-80 shrink-0 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col justify-between p-4 group">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-amber-500 text-zinc-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      EPISODIO #{ep.episodeNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="rounded bg-zinc-900/90 text-white px-2 py-0.5 text-[11px] font-mono font-bold border border-zinc-800">
                      {ep.duration}
                    </span>
                  </div>

                  <div className="text-center py-4">
                    <Tv className="h-10 w-10 text-amber-400/80 mx-auto mb-2" />
                    <span className="text-[11px] font-mono text-zinc-400 block truncate px-2">
                      {ep.thumbnailUrl || 'Miniatura 16:9'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-900 pt-2">
                    <span>1440p (VP9/AV1)</span>
                    <span className="text-emerald-400">100% Renderizado</span>
                  </div>
                </div>

                {/* Episode Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {currentChannel.name} • Ep. {ep.episodeNumber}
                      </span>
                      <h3 className="text-lg font-bold text-white sm:text-xl mt-0.5">
                        {ep.title}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border self-start ${
                        ep.status === 'PUBLISHED'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {ep.status === 'PUBLISHED' ? '✓ EN VIVO EN YOUTUBE' : '🗓️ PROGRAMADO'}
                    </span>
                  </div>

                  {/* 5-Phase Pipeline Gates */}
                  <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
                    <div className="text-[10px] uppercase font-mono font-bold text-zinc-400 mb-3">
                      ESTADO DEL PIPELINE DE 5 COMPUERTAS (SOP MASTER):
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-zinc-400">1. Guion</div>
                          <div className="font-bold text-white">LOCKED</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Mic className="h-4 w-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-zinc-400">2. Voz IA</div>
                          <div className="font-bold text-white truncate max-w-[100px]">Matt v4</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-zinc-400">3. Render 3D</div>
                          <div className="font-bold text-white">60 FPS</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-zinc-400">4. Miniatura</div>
                          <div className="font-bold text-white">1080p OK</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Layers className="h-4 w-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-zinc-400">5. 10 Clips</div>
                          <div className="font-bold text-emerald-400">Listo (Corte)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tech specs and links */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/60">
                    <div className="flex items-center space-x-4 text-xs text-zinc-400 font-mono">
                      <span>Estreno: <strong className="text-white">{ep.releaseDate}</strong></span>
                      <span>•</span>
                      <span>Motor: <strong className="text-white">{ep.renderEngine}</strong></span>
                    </div>

                    <a
                      href={ep.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 rounded-xl bg-red-600/20 border border-red-500/40 px-3.5 py-1.5 text-xs font-bold text-red-300 hover:bg-red-600/30 transition"
                    >
                      <span>Abrir en YouTube Studio</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
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
