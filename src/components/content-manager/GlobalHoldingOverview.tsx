'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Platform } from '../../types';
import {
  Layers,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Zap,
  TrendingUp,
  BarChart3,
  Globe,
  Film,
  Smartphone,
  ShieldCheck,
  Target,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const GlobalHoldingOverview: React.FC = () => {
  const {
    channels,
    clips,
    episodes,
    globalStats,
    setSelectedChannelId,
    setContentTab,
    triggerRippleShift,
    showToast,
  } = useHolding();

  const [platformFilter, setPlatformFilter] = useState<'ALL' | Platform>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const platforms: Platform[] = [
    'YOUTUBE_SHORT',
    'TIKTOK',
    'INSTAGRAM_REEL',
    'FACEBOOK_REEL',
    'X_TWITTER',
  ];

  const filteredClipsList = clips.filter((clip) => {
    if (channelFilter !== 'ALL' && clip.channelId !== channelFilter) return false;
    if (platformFilter !== 'ALL') {
      const rec = clip.platforms[platformFilter];
      if (!rec || rec.status !== 'PUBLISHED') return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        clip.title.toLowerCase().includes(q) ||
        clip.hook.toLowerCase().includes(q) ||
        clip.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8" data-testid="global-holding-overview">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. EXECUTIVE KPI MATRIX (ZERO-SLOP NUMERICAL CARDS)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Piezas Únicas Creadas */}
        <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-4 shadow-lg hover:border-sky-500/40 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Piezas Únicas</span>
            <Layers className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {globalStats.totalUniquePieces}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center space-x-1.5 font-mono">
            <span>{globalStats.uniqueClipsCount} clips</span>
            <span>•</span>
            <span>{globalStats.uniqueEpisodesCount} largos</span>
          </div>
        </div>

        {/* Metric 2: Publicaciones Totales Realizadas */}
        <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Publicaciones</span>
            <Share2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {globalStats.totalPublications}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            En 5 redes oficiales
          </div>
        </div>

        {/* Metric 3: Tasa de Arbitraje Multiplataforma */}
        <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-4 shadow-lg hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Tasa Arbitraje</span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
            {globalStats.arbitrageRatio}x
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            Meta omnicanal: 5.0x
          </div>
        </div>

        {/* Metric 4: Fugas de Arbitraje / Piezas Huérfanas */}
        <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Fugas Arbitraje</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {globalStats.orphanedPiecesCount}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            Piezas sin replicar 100%
          </div>
        </div>

        {/* Metric 5: Runway de Stock en Días */}
        <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Runway Stock</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            {globalStats.runwayDays}d
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            A 9 shorts/día holding
          </div>
        </div>

        {/* Metric 6: Vistas Totales Auditadas */}
        <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-4 shadow-lg hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Vistas Globales</span>
            <BarChart3 className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {globalStats.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            {globalStats.totalWatchHours.toFixed(1)} hs reproducidas
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. CHANNELS SUMMARY COMPARISON CARDS                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Globe className="h-5 w-5 text-sky-400" />
              <span>Desglose de Producción y Arbitraje por Canal</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Auditoría de activos únicos vs publicaciones efectivas para cada propiedad digital del holding.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {globalStats.channelMetrics.map((cm) => {
            const chanObj = channels.find((c) => c.id === cm.channelId);
            return (
              <div
                key={cm.channelId}
                className="bg-[#12141a] border border-[#20242f] hover:border-[#2f3545] rounded-2xl p-5 shadow-xl transition relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: chanObj?.accentColor || '#38bdf8' }}
                />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={chanObj?.avatarUrl || '/channels/blackflag-logo.png'}
                      alt={cm.channelName}
                      className="h-10 w-10 rounded-xl object-cover border border-[#2a2f3d]"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{cm.channelName}</h3>
                      <p className="text-xs text-zinc-400">{chanObj?.niche}</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-mono font-bold"
                    style={{
                      backgroundColor: `${chanObj?.accentColor || '#38bdf8'}20`,
                      color: chanObj?.accentColor || '#38bdf8',
                    }}
                  >
                    {cm.shortCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                  <div className="bg-[#181b24] p-2.5 rounded-xl border border-[#242938]">
                    <div className="text-[10px] text-zinc-400 uppercase">Piezas Únicas</div>
                    <div className="text-lg font-bold text-white mt-0.5">{cm.uniquePieces}</div>
                  </div>
                  <div className="bg-[#181b24] p-2.5 rounded-xl border border-[#242938]">
                    <div className="text-[10px] text-zinc-400 uppercase">Publicaciones</div>
                    <div className="text-lg font-bold text-emerald-400 mt-0.5">{cm.publications}</div>
                  </div>
                  <div className="bg-[#181b24] p-2.5 rounded-xl border border-[#242938]">
                    <div className="text-[10px] text-zinc-400 uppercase">Ratio Arbitraje</div>
                    <div className="text-lg font-bold text-indigo-400 mt-0.5">{cm.arbitrageRatio}x</div>
                  </div>
                  <div className="bg-[#181b24] p-2.5 rounded-xl border border-[#242938]">
                    <div className="text-[10px] text-zinc-400 uppercase">Runway Stock</div>
                    <div className="text-lg font-bold text-amber-400 mt-0.5">{cm.runwayDays} días</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChannelId(cm.channelId)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#181b24] hover:bg-[#202532] text-xs font-semibold text-zinc-200 border border-[#292f3f] transition cursor-pointer"
                >
                  <span>Abrir Centro de Mando de {cm.channelName}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. 360° MULTI-CHANNEL OMNICHANNEL ARBITRAGE MATRIX            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#1d212b]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Matriz de Arbitraje 360° (Control Omnicanal de Piezas)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Auditoría exhaustiva: cada fila es una pieza única. Verifica en qué redes está publicada y dónde falta replicar.
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {/* Filter by channel in table */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#181b24] border border-[#292f3f] text-xs text-zinc-200 cursor-pointer"
            >
              <option value="ALL">Todos los Canales ({clips.length})</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Filter by platform in table */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#181b24] border border-[#292f3f] text-xs text-zinc-200 cursor-pointer"
            >
              <option value="ALL">Todas las Redes</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar por título o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#181b24] border border-[#292f3f] text-xs text-zinc-200 placeholder-zinc-500 w-48"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#20242f] text-zinc-400 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-3 px-3">ID / Pieza Única</th>
                <th className="py-3 px-3">Canal</th>
                <th className="py-3 px-3">Título & Hook</th>
                <th className="py-3 px-2 text-center">YouTube</th>
                <th className="py-3 px-2 text-center">TikTok</th>
                <th className="py-3 px-2 text-center">Instagram</th>
                <th className="py-3 px-2 text-center">Facebook</th>
                <th className="py-3 px-2 text-center">X / Twitter</th>
                <th className="py-3 px-3 text-right">Cobertura</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b24]">
              {filteredClipsList.map((clip) => {
                const chan = channels.find((c) => c.id === clip.channelId);
                const publishedCount = Object.values(clip.platforms).filter(
                  (p) => p.status === 'PUBLISHED'
                ).length;
                const coveragePercent = Math.round((publishedCount / 5) * 100);

                return (
                  <tr key={clip.id} className="hover:bg-[#161822] transition">
                    {/* ID */}
                    <td className="py-3 px-3 font-mono text-zinc-400 whitespace-nowrap">
                      <span className="bg-[#181b24] px-2 py-0.5 rounded border border-[#242938] text-[11px] font-bold text-zinc-200">
                        {clip.id}
                      </span>
                    </td>

                    {/* Canal */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        style={{
                          backgroundColor: `${chan?.accentColor || '#888'}20`,
                          color: chan?.accentColor || '#888',
                        }}
                      >
                        {chan?.shortCode || clip.channelId}
                      </span>
                    </td>

                    {/* Título & Hook */}
                    <td className="py-3 px-3 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-zinc-200 truncate">{clip.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate mt-0.5 font-sans">
                        {clip.hook}
                      </div>
                    </td>

                    {/* 5 Platforms Badges */}
                    {platforms.map((plat) => {
                      const rec = clip.platforms[plat];
                      const isPub = rec?.status === 'PUBLISHED';
                      const isSched = rec?.status === 'SCHEDULED';

                      return (
                        <td key={plat} className="py-3 px-2 text-center whitespace-nowrap">
                          {isPub ? (
                            <a
                              href={rec.url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono hover:bg-emerald-500/25 transition"
                              title="Publicado - Abrir enlace"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>OK</span>
                            </a>
                          ) : isSched ? (
                            <span
                              className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono"
                              title={`Programado para ${rec?.slotTime || 'Turno'}`}
                            >
                              <Clock className="h-3 w-3" />
                              <span>PROG</span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-800/40 border border-zinc-700/40 text-zinc-400 text-[10px] font-mono"
                              title="Pendiente de publicación en esta red"
                            >
                              PEND
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Cobertura */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono">
                      <span
                        className={`font-bold ${
                          coveragePercent === 100
                            ? 'text-emerald-400'
                            : coveragePercent >= 40
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {publishedCount}/5 ({coveragePercent}%)
                      </span>
                    </td>

                    {/* Acción: Ripple Shift */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          triggerRippleShift(clip.id);
                          showToast(`¡Ripple Shift inyectado para ${clip.id}! Turno prioritario asignado en 5 redes.`);
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition cursor-pointer flex items-center space-x-1 ml-auto"
                        title="Inyectar como próximo turno urgente en todas las plataformas"
                      >
                        <Zap className="h-3 w-3 text-amber-400" />
                        <span>Ripple Shift</span>
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
