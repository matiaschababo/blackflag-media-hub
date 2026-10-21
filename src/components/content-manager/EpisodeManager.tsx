'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Tv,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const EpisodeManager: React.FC = () => {
  const { currentChannel, episodes, setContentTab } = useHolding();
  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-[#1e2129] bg-[#13151a] p-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Episodios y Documentales Largos (VOD)
          </h2>
          <p className="text-xs text-[#848d97] mt-0.5">
            Cada episodio largo alimenta automáticamente los 10 nodos virales para Corte Studio.
          </p>
        </div>

        <div className="text-xs text-[#848d97]">
          Total: <strong className="text-white font-semibold">{channelEpisodes.length} episodios</strong>
        </div>
      </div>

      {/* Episode Cards */}
      <div className="space-y-4">
        {channelEpisodes.map((ep) => {
          return (
            <div
              key={ep.id}
              className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5 hover:border-[#2c313d] transition"
            >
              <div className="flex flex-col lg:flex-row gap-5">
                {/* 16:9 Real Thumbnail */}
                <div className="relative aspect-video w-full lg:w-80 shrink-0 rounded-lg bg-black border border-[#262a34] overflow-hidden">
                  <img
                    src={ep.thumbnailUrl || '/thumbnails/ep01-blackflag.png'}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 text-white px-1.5 py-0.5 text-[11px] font-mono border border-white/20">
                    {ep.duration}
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-[#848d97]">
                    1440p VP9 • 60 FPS
                  </div>
                </div>

                {/* Episode Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#848d97]">
                        {currentChannel.name} • Episodio #{ep.episodeNumber}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {ep.status === 'PUBLISHED' ? 'Publicado en YouTube' : ep.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                      {ep.title}
                    </h3>

                    <p className="text-xs text-[#848d97] mt-1.5 leading-relaxed">
                      Estructura de retención con curva de atención auditada, guion cerrado con Session Loops y generación de 10 clips virales 9:16 con subtítulos dorados ASS.
                    </p>
                  </div>

                  {/* Technical & Performance Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs border-t border-[#1e2129] pt-3">
                    <div>
                      <span className="text-[10px] text-[#848d97] block">Vistas</span>
                      <span className="text-sm font-semibold text-white tabular-nums">{ep.totalViews || 28}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#848d97] block">Guion</span>
                      <span className="text-xs font-medium text-emerald-400">{ep.scriptStatus}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#848d97] block">Voz</span>
                      <span className="text-xs font-medium text-[#848d97] truncate block">{ep.audioEngine}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#848d97] block">Motor</span>
                      <span className="text-xs font-medium text-[#848d97] truncate block">{ep.renderEngine}</span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center space-x-2.5 pt-1">
                    <a
                      href={ep.youtubeUrl}
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
                      <Layers className="h-3.5 w-3.5 mr-1.5 text-[#848d97]" />
                      <span>Ver 10 clips derivados</span>
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