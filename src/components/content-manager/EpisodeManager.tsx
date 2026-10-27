'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  ExternalLink,
  Layers,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const EpisodeManager: React.FC = () => {
  const { currentChannel, episodes, setContentTab } = useHolding();
  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);

  return (
    <div className="space-y-4" data-testid="episode-manager">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-[#1e2129] bg-[#13151a] p-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Episodios VOD
        </h2>
        <span className="text-xs font-mono text-[#848d97]">
          {channelEpisodes.length} episodios
        </span>
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
                {/* 16:9 Thumbnail */}
                <div className="relative aspect-video w-full lg:w-80 shrink-0 rounded-lg bg-black border border-[#262a34] overflow-hidden">
                  <img
                    src={ep.thumbnailUrl || '/thumbnails/ep01-blackflag.png'}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 text-white px-1.5 py-0.5 text-[11px] font-mono border border-white/20">
                    {ep.duration}
                  </div>
                </div>

                {/* Episode Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#848d97] font-mono">
                        {currentChannel.name} • #{ep.episodeNumber}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {ep.status === 'PUBLISHED' ? 'Publicado' : ep.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                      {ep.title}
                    </h3>
                  </div>

                  {/* Technical & Performance Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs border-t border-[#1e2129] pt-3">
                    <div>
                      <span className="text-[10px] text-[#848d97] block font-medium">Vistas</span>
                      <span className="text-sm font-semibold text-white tabular-nums">{ep.totalViews || 28}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#848d97] block font-medium">Guion</span>
                      <span className="text-xs font-medium text-emerald-400">{ep.scriptStatus}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#848d97] block font-medium">Voz</span>
                      <span className="text-xs font-medium text-[#848d97] truncate block">{ep.audioEngine}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#848d97] block font-medium">Motor</span>
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
                      <span>YouTube</span>
                      <ExternalLink className="h-3 w-3 ml-1.5 text-[#848d97]" />
                    </a>

                    <button
                      onClick={() => setContentTab('clips_matrix')}
                      className="app-button app-button-secondary text-xs"
                    >
                      <Layers className="h-3.5 w-3.5 mr-1.5 text-[#848d97]" />
                      <span>Clips ({ep.clipsCount})</span>
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
