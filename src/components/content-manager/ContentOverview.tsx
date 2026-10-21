'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Layers,
  Calendar,
  Tv,
  Radar,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';
import { Platform } from '../../types';

export const ContentOverview: React.FC = () => {
  const {
    channels,
    selectedChannelId,
    setSelectedChannelId,
    currentChannel,
    filteredClips,
    episodes,
    setContentTab,
    setMode,
  } = useHolding();

  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);
  const featuredEpisode = channelEpisodes[0] || episodes[0];

  const publishedClips = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
  );
  const scheduledClips = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'SCHEDULED')
  );
  const virginStockClips = filteredClips.filter(
    (c) => !Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
  );

  const daysRemaining = Math.max(0, Math.floor(virginStockClips.length / currentChannel.shortsPerDay));

  const platformsList: Array<{ key: Platform; label: string; iconKey: string; handle: string }> = [
    { key: 'YOUTUBE_SHORT', label: 'YouTube Shorts', iconKey: 'YOUTUBE', handle: currentChannel.accounts.youtube },
    { key: 'INSTAGRAM_REEL', label: 'Instagram Reels', iconKey: 'INSTAGRAM', handle: currentChannel.accounts.instagram },
    { key: 'TIKTOK', label: 'TikTok', iconKey: 'TIKTOK', handle: currentChannel.accounts.tiktok },
    { key: 'FACEBOOK_REEL', label: 'Facebook Reels', iconKey: 'FACEBOOK', handle: currentChannel.accounts.facebook },
    { key: 'X_TWITTER', label: 'X (Twitter)', iconKey: 'TWITTER', handle: currentChannel.accounts.x },
  ];

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* 1. CHANNEL STRIP (FLAT, FUNCTIONAL) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#1e2129] bg-[#13151a] px-4 py-2.5">
        <div className="flex items-center space-x-2.5">
          <img
            src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
            alt={currentChannel.name}
            className="h-6 w-6 rounded-md object-cover border border-[#2a2e39]"
          />
          <span className="text-xs font-semibold text-white">{currentChannel.name}</span>
          <span className="text-[11px] text-[#848d97]">— {currentChannel.niche}</span>
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-[11px] text-[#848d97] mr-1.5 hidden md:inline">Canales:</span>
          {channels.map((ch) => {
            const isSelected = selectedChannelId === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannelId(ch.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:text-white hover:bg-[#181b21]'
                }`}
              >
                <img
                  src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                  alt={ch.name}
                  className="h-3.5 w-3.5 rounded object-cover"
                />
                <span>{ch.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. OVERVIEW HEADER & FLAT KPIS (NO NEON BLOBS, NO ICONS IN CIRCLES) */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Cabina de Mando y Producción
            </h2>
            <p className="mt-1 text-xs text-[#848d97]">
              Cadencia: <strong className="text-white font-semibold">{currentChannel.shortsPerDay} shorts por día</strong> ({currentChannel.timeSlots.join(' y ')}). Audiencia: {currentChannel.audience}.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setContentTab('parrilla')}
              className="app-button app-button-primary text-xs"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Ver parrilla 24/7</span>
            </button>
            <button
              onClick={() => setMode('metrics_hub')}
              className="app-button app-button-secondary text-xs"
            >
              <span>Metrics Hub</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </button>
          </div>
        </div>

        {/* Hairline-divided KPI Strip (Taste Skill App Screen Standard) */}
        <div className="mt-5 pt-4 border-t border-[#1e2129] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Episodios producidos</span>
            <div className="text-2xl font-bold text-white tabular-nums">{channelEpisodes.length}</div>
            <span className="text-[10px] text-[#848d97]">Master 1440p VP9</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Clips en stock virgen</span>
            <div className="text-2xl font-bold text-white tabular-nums">{virginStockClips.length}</div>
            <span className="text-[10px] text-[#848d97]">10 nodos por episodio</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Clips emitidos</span>
            <div className="text-2xl font-bold text-white tabular-nums">{publishedClips.length}</div>
            <span className="text-[10px] text-[#848d97]">En las 5 plataformas</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-[#848d97]">Runway restante</span>
            <div className="text-2xl font-bold text-white tabular-nums">{daysRemaining} días</div>
            <span className="text-[10px] text-[#848d97]">A {currentChannel.shortsPerDay} shorts/día</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FOUR OPERATION CARDS (CLEAN, FLAT, NO CIRCLE ICONS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => setContentTab('episodes')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Tv className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Episodios VOD</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Video largo oficial 1440p con miniatura real y enlace a YouTube.
            </p>
          </div>
        </div>

        <div
          onClick={() => setContentTab('parrilla')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Calendar className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Parrilla 24/7</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Calendario de publicación horaria con slots libres y programados.
            </p>
          </div>
        </div>

        <div
          onClick={() => setContentTab('radar')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Radar className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Radar de Stock</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Monitoreo del runway virgen para evitar baches en la grilla.
            </p>
          </div>
        </div>

        <div
          onClick={() => setContentTab('clips_matrix')}
          className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 hover:border-[#2c313d] hover:bg-[#16181e] transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#848d97] mb-2">
              <Layers className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold text-white">Matriz 10 Clips</div>
            <p className="text-[11px] text-[#848d97] mt-1">
              Hooks en 0:03, copys multi-plataforma y copiado rápido en 1 clic.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. FEATURED VIDEO SPOTLIGHT (SOLID FLAT SURFACE, REAL IMAGE) */}
      {/* ========================================================= */}
      {featuredEpisode && (
        <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
          <div className="flex items-center justify-between border-b border-[#1e2129] pb-3 mb-4">
            <span className="text-xs font-semibold text-white">
              Video Master Oficial (1440p VP9)
            </span>
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {featuredEpisode.status === 'PUBLISHED' ? 'Publicado en YouTube' : featuredEpisode.status}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* 16:9 Real Thumbnail */}
            <div className="relative aspect-video w-full lg:w-80 shrink-0 rounded-lg overflow-hidden border border-[#262a34] bg-black">
              <img
                src={featuredEpisode.thumbnailUrl || '/thumbnails/ep01-blackflag.png'}
                alt={featuredEpisode.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[11px] px-1.5 py-0.5 rounded border border-white/20">
                {featuredEpisode.duration}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs text-[#848d97]">
                  {currentChannel.name} • Episodio #{featuredEpisode.episodeNumber} • {featuredEpisode.clipsCount} clips derivados
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                  {featuredEpisode.title}
                </h3>

                <p className="text-xs text-[#848d97] mt-1.5 leading-relaxed">
                  Episodio ancla concebido bajo estándar Clip-First para abastecer los 10 cortes verticales en YouTube Shorts, Reels y TikTok.
                </p>
              </div>

              {/* Data strip */}
              <div className="grid grid-cols-3 gap-2.5 text-xs border-t border-[#1e2129] pt-3">
                <div>
                  <span className="text-[10px] text-[#848d97] block">Vistas YouTube</span>
                  <span className="text-sm font-semibold text-white tabular-nums">{featuredEpisode.totalViews || 28} vistas</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#848d97] block">Voz</span>
                  <span className="text-xs font-medium text-[#848d97] truncate block">{featuredEpisode.audioEngine}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#848d97] block">Motor</span>
                  <span className="text-xs font-medium text-[#848d97] truncate block">{featuredEpisode.renderEngine}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2.5 pt-1">
                <a
                  href={featuredEpisode.youtubeUrl}
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
                  <Layers className="h-3 w-3 mr-1.5 text-[#848d97]" />
                  <span>Ver 10 clips</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MULTI-PLATFORM STOCK MATRIX (CLEAN, NO ZEBRA, RULES ONLY) */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex items-center justify-between border-b border-[#1e2129] pb-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              Matriz de Stock por Plataforma
            </h3>
            <p className="text-[11px] text-[#848d97]">
              Sindicación en las 5 redes oficiales.
            </p>
          </div>

          <button
            onClick={() => setContentTab('parrilla')}
            className="text-xs text-[#848d97] hover:text-white flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver parrilla</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e2129] text-[11px] text-[#848d97] font-medium">
                <th className="py-2 px-3">Plataforma</th>
                <th className="py-2 px-3">Cuenta</th>
                <th className="py-2 px-3 text-right">Stock virgen</th>
                <th className="py-2 px-3 text-right">Programados</th>
                <th className="py-2 px-3 text-right">Publicados</th>
                <th className="py-2 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2129]">
              {platformsList.map((p) => {
                const stockCount = filteredClips.filter(
                  (c) => c.platforms[p.key]?.status === 'PENDING'
                ).length;
                const schedCount = filteredClips.filter(
                  (c) => c.platforms[p.key]?.status === 'SCHEDULED'
                ).length;
                const pubCount = filteredClips.filter(
                  (c) => c.platforms[p.key]?.status === 'PUBLISHED'
                ).length;

                return (
                  <tr key={p.key} className="hover:bg-[#181b21] transition">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <PlatformIcon platform={p.iconKey} size={15} />
                        <span className="font-semibold text-white">{p.label}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-[#848d97]">
                      {p.handle}
                    </td>

                    <td className="py-2.5 px-3 text-right tabular-nums text-white font-medium">
                      {stockCount} clips
                    </td>

                    <td className="py-2.5 px-3 text-right tabular-nums text-[#848d97]">
                      {schedCount}
                    </td>

                    <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 font-medium">
                      {pubCount}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setContentTab('parrilla')}
                        className="text-[11px] px-2 py-0.5 rounded border border-[#262a34] bg-[#16181e] text-[#848d97] hover:text-white hover:border-[#2c313d] transition cursor-pointer"
                      >
                        Programar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};