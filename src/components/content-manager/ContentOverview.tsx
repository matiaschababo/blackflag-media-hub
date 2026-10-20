'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Film,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Tv,
  PlaySquare,
  Radar,
  AlertTriangle,
  ExternalLink,
  Flame,
  Radio,
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
    { key: 'X_TWITTER', label: 'X (Post / Video)', iconKey: 'TWITTER', handle: currentChannel.accounts.x },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. CHANNEL SELECTION BAR (ZERO-FRICTION CHANNEL SWITCHING) */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#121217] p-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">
              CANAL EN MANDO:
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              {currentChannel.name}
            </span>
          </div>

          {/* Quick 1-Click Channel Switcher Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-zinc-400 hidden md:inline">
              Cambiar a otro canal:
            </span>
            <div className="flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-zinc-800/70">
              {channels.map((ch) => {
                const isSelected = selectedChannelId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannelId(ch.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 text-white shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                    style={
                      isSelected
                        ? {
                            border: `1.5px solid ${ch.accentColor}90`,
                            boxShadow: `0 0 14px -2px ${ch.accentColor}30`,
                          }
                        : { border: '1.5px solid transparent' }
                    }
                  >
                    <img
                      src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                      alt={ch.name}
                      className="h-4 w-4 rounded-md object-cover border border-white/20"
                    />
                    <span>{ch.name}</span>
                    <span className="text-[9px] font-mono text-zinc-400 px-1 py-0.2 rounded bg-black/50">
                      {ch.shortCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. WELCOME HERO (CHANNEL IDENTITY & HEALTH) */}
      {/* ========================================================= */}
      <div className="relative rounded-2xl border border-zinc-800/90 bg-[#101014] p-6 backdrop-blur-xl shadow-xl overflow-hidden">
        {/* Subtle Accent Glow */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ backgroundColor: currentChannel.accentColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-white/20 shadow-2xl shrink-0"
              style={{
                boxShadow: `0 8px 30px ${currentChannel.accentColor}40`,
              }}
            />
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${currentChannel.accentColor}25`,
                    color: currentChannel.accentColor,
                  }}
                >
                  {currentChannel.name}
                </span>
                <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SINDICACIÓN ACTIVA</span>
                </span>
              </div>

              <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Cabina de Mando y Operaciones
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Nicho: <span className="text-zinc-200 font-semibold">{currentChannel.niche}</span>. Cadencia de publicación: <span className="text-amber-400 font-mono font-bold">{currentChannel.shortsPerDay} shorts/día</span> ({currentChannel.timeSlots.join(' y ')}).
              </p>
            </div>
          </div>

          {/* Quick Action CTA */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => setContentTab('parrilla')}
              className="studio-btn bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-4 py-2.5 space-x-2 shadow-lg shadow-amber-500/25"
            >
              <Calendar className="h-4 w-4" />
              <span>Ver Parrilla 24/7</span>
            </button>
            <button
              onClick={() => setMode('metrics_hub')}
              className="studio-btn bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 px-4 py-2.5 space-x-2"
            >
              <span>Metrics Hub</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4 High-Level Metric Tiles */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
          <div className="rounded-xl bg-black/50 p-3.5 border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400">EPISODIOS PRODUCIDOS</div>
            <div className="mt-1 text-2xl font-black text-white">{channelEpisodes.length}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Master 1440p VP9</div>
          </div>

          <div className="rounded-xl bg-black/50 p-3.5 border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400">CLIPS EN STOCK VIRGEN</div>
            <div className="mt-1 text-2xl font-black text-amber-400">{virginStockClips.length}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">10 nodos por episodio</div>
          </div>

          <div className="rounded-xl bg-black/50 p-3.5 border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400">CLIPS EMITIDOS</div>
            <div className="mt-1 text-2xl font-black text-emerald-400">{publishedClips.length}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">En las 5 plataformas</div>
          </div>

          <div className="rounded-xl bg-black/50 p-3.5 border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400">RUNWAY DISPONIBLE</div>
            <div className="mt-1 text-2xl font-black text-sky-400">{daysRemaining} Días</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">A 2 shorts/día</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FOUR ACTION CARDS (INSPIRED DIRECTLY BY MIX ON) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Episodios VOD */}
        <div
          onClick={() => setContentTab('episodes')}
          className="group relative glass-panel p-5 rounded-2xl border border-zinc-800/90 bg-[#121217] hover:border-amber-500/50 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
              <Tv className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition">
              Episodios VOD
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Video largo oficial 1440p VP9 con miniatura real y enlace a YouTube.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Ver episodios</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Parrilla 24/7 */}
        <div
          onClick={() => setContentTab('parrilla')}
          className="group relative glass-panel p-5 rounded-2xl border border-zinc-800/90 bg-[#121217] hover:border-amber-500/50 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
              <Calendar className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition">
              Parrilla 24/7
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Calendario de publicación horaria con slots libres y programados.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Ver slots 24/7</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Radar de Stock */}
        <div
          onClick={() => setContentTab('radar')}
          className="group relative glass-panel p-5 rounded-2xl border border-zinc-800/90 bg-[#121217] hover:border-emerald-500/50 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
              <Radar className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition">
              Radar de Stock
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Monitoreo del runway virgen y centinela contra baches en la grilla.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Auditar runway</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Matriz de 10 Clips */}
        <div
          onClick={() => setContentTab('clips_matrix')}
          className="group relative glass-panel p-5 rounded-2xl border border-zinc-800/90 bg-[#121217] hover:border-amber-500/50 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
              <Layers className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition">
              Matriz 10 Clips
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Hooks en 0:03, copys multi-plataforma y copiado rápido en 1 clic.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Explorar clips</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. FEATURED VIDEO SPOTLIGHT (REAL 16:9 THUMBNAIL & DATA) */}
      {/* ========================================================= */}
      {featuredEpisode && (
        <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Tv className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                VIDEO MASTER OFICIAL (16:9 1440P VP9)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {featuredEpisode.status === 'PUBLISHED' ? 'EN PRODUCCIÓN & PUBLICADO' : featuredEpisode.status}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* 16:9 Real Thumbnail */}
            <div className="relative aspect-video w-full lg:w-96 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl group bg-black">
              <img
                src={featuredEpisode.thumbnailUrl || '/thumbnails/ep01-blackflag.png'}
                alt={featuredEpisode.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Badges on Top of Thumbnail */}
              <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                <span className="bg-amber-500 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded shadow-md uppercase font-mono">
                  EPISODIO #{String(featuredEpisode.episodeNumber).padStart(2, '0')}
                </span>
              </div>

              <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white font-mono font-bold text-xs px-2 py-0.5 rounded border border-white/20">
                {featuredEpisode.duration}
              </div>

              <div className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-zinc-300">
                1440p VP9 / AV1 (60 FPS)
              </div>
            </div>

            {/* Video Details */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
                  <span>{currentChannel.name}</span>
                  <span>•</span>
                  <span>Episodio {featuredEpisode.episodeNumber}</span>
                  <span>•</span>
                  <span className="text-zinc-400">{featuredEpisode.clipsCount} clips virales derivados</span>
                </div>

                <h4 className="text-lg sm:text-xl font-extrabold text-white mt-1 leading-snug">
                  {featuredEpisode.title}
                </h4>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  El episodio master actúa como ancla de retención y distribuye audiencia hacia los 10 clips verticales sindicados en YouTube Shorts, Instagram Reels, TikTok, Facebook Reels y X.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="rounded-xl bg-black/50 p-2.5 border border-zinc-800/80">
                  <span className="text-[9px] uppercase text-zinc-400 block font-bold">Vistas YouTube</span>
                  <span className="text-sm font-extrabold text-white">{featuredEpisode.totalViews || 28} vistas</span>
                </div>
                <div className="rounded-xl bg-black/50 p-2.5 border border-zinc-800/80">
                  <span className="text-[9px] uppercase text-zinc-400 block font-bold">Audio Engine</span>
                  <span className="text-xs font-bold text-zinc-200 truncate block">ElevenLabs v4 (Matt)</span>
                </div>
                <div className="rounded-xl bg-black/50 p-2.5 border border-zinc-800/80">
                  <span className="text-[9px] uppercase text-zinc-400 block font-bold">Render Engine</span>
                  <span className="text-xs font-bold text-zinc-200 truncate block">Remotion 3D Bóveda</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={featuredEpisode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studio-btn bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 space-x-2 shadow-lg shadow-red-600/20"
                >
                  <PlatformIcon platform="YOUTUBE" size={15} />
                  <span>Ver en YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>

                <button
                  onClick={() => setContentTab('clips_matrix')}
                  className="studio-btn bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold px-4 py-2 space-x-2"
                >
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  <span>Ver los 10 Clips Asociados</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PLATFORM STOCK MATRIX (BENCHMARK MIX ON CONTENT MANAGER) */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">
                DISTRIBUCIÓN MULTI-RED
              </span>
              <span className="text-xs font-mono text-amber-400">Sindicación 5 Plataformas</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              Matriz de Stock por Plataforma
            </h3>
          </div>

          <button
            onClick={() => setContentTab('parrilla')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver parrilla completa</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Table / Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <th className="py-2.5 px-3">Plataforma</th>
                <th className="py-2.5 px-3">Cuenta Oficial</th>
                <th className="py-2.5 px-3 text-center">Stock Virgen</th>
                <th className="py-2.5 px-3 text-center">Programados</th>
                <th className="py-2.5 px-3 text-center">Publicados</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
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
                  <tr key={p.key} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2.5">
                        <PlatformIcon platform={p.iconKey} size={18} />
                        <span className="font-extrabold text-white">{p.label}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-300">
                      {p.handle}
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-extrabold border border-amber-500/20">
                        {stockCount} clips
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
                        {schedCount} en cola
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {pubCount} emitidos
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setContentTab('parrilla')}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold transition cursor-pointer"
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