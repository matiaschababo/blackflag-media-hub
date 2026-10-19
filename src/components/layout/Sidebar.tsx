'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import { ContentTab, MetricsTab } from '../../types';
import {
  Layers,
  Calendar,
  Tv,
  Radar,
  LayoutDashboard,
  LineChart,
  Share2,
  SplitSquareVertical,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon, XIcon } from '../ui/SocialIcons';

export const Sidebar: React.FC = () => {
  const {
    currentChannel,
    mode,
    contentTab,
    setContentTab,
    metricsTab,
    setMetricsTab,
    filteredClips,
  } = useHolding();

  const publishedClipsCount = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
  ).length;

  return (
    <aside className="w-full shrink-0 border-r border-zinc-800/80 bg-[#0d0d11]/80 backdrop-blur-md p-4 md:w-64 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div>
        {/* Channel Identity Card with Ambient Glow */}
        <div
          className="mb-6 rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-4 shadow-xl relative overflow-hidden group transition-all duration-300"
          style={{
            borderTop: `4px solid ${currentChannel.accentColor}`,
            boxShadow: `0 8px 24px -6px ${currentChannel.accentColor}1a`,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              {currentChannel.shortCode} CANAL
            </span>
            <span className="text-[10px] text-zinc-400 font-mono font-semibold">
              {currentChannel.shortsPerDay} clips/día
            </span>
          </div>

          <h2 className="mt-2.5 text-base font-extrabold text-white leading-tight">
            {currentChannel.name}
          </h2>
          <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
            {currentChannel.niche}
          </p>

          {/* Quick Metrics Badges */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="rounded-xl bg-zinc-950/80 p-2 border border-zinc-800/60">
              <span className="text-zinc-500 block text-[9px] uppercase">Stock</span>
              <span className="font-extrabold text-white text-xs">{filteredClips.length} clips</span>
            </div>
            <div className="rounded-xl bg-zinc-950/80 p-2 border border-zinc-800/60">
              <span className="text-zinc-500 block text-[9px] uppercase">Emitidos</span>
              <span className="font-extrabold text-emerald-400 text-xs">{publishedClipsCount}</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <div className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 font-mono flex items-center justify-between">
            <span>{mode === 'content_manager' ? 'MOTOR DE CONTENIDO' : 'INTELIGENCIA DE MÉTRICAS'}</span>
            <span className="h-1 w-1 rounded-full bg-amber-400"></span>
          </div>

          {mode === 'content_manager' ? (
            <>
              <button
                onClick={() => setContentTab('clips_matrix')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'clips_matrix'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="h-4 w-4 text-amber-400" />
                  <span>Matriz de 10 Clips</span>
                </div>
                <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300 border border-zinc-700/60">
                  {filteredClips.length}
                </span>
              </button>

              <button
                onClick={() => setContentTab('parrilla')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'parrilla'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Parrilla de Sindicación</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">24/7</span>
              </button>

              <button
                onClick={() => setContentTab('episodes')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'episodes'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Tv className="h-4 w-4 text-amber-400" />
                  <span>Episodios Largos (VOD)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">1440p</span>
              </button>

              <button
                onClick={() => setContentTab('radar')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'radar'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Radar className="h-4 w-4 text-amber-400" />
                  <span>Radar de Stock & Ripple</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Activo</span>
              </button>

              <button
                onClick={() => setContentTab('overview')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'overview'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-amber-400" />
                <span>Resumen del Canal</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMetricsTab('overview')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'overview'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                <span>Rendimiento Global</span>
              </button>

              <button
                onClick={() => setMetricsTab('retention')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'retention'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LineChart className="h-4 w-4 text-cyan-400" />
                  <span>Curva de Retención</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">&gt;50%</span>
              </button>

              <button
                onClick={() => setMetricsTab('platforms')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'platforms'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <Share2 className="h-4 w-4 text-cyan-400" />
                <span>Comparativa Multi-Red</span>
              </button>

              <button
                onClick={() => setMetricsTab('ab_testing')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'ab_testing'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <SplitSquareVertical className="h-4 w-4 text-cyan-400" />
                  <span>Tríada Packaging (A/B/C)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">CTR</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Linked Social Accounts Panel (Mix On style) */}
      <div className="mt-8 border-t border-zinc-800/80 pt-4">
        <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-zinc-500 font-mono flex items-center justify-between">
          <span>REDES VINCULADAS</span>
          <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-[9px]">
            <CheckCircle2 className="h-3 w-3" />
            <span>APIs OK</span>
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between rounded-xl bg-zinc-900/40 px-2.5 py-2 border border-zinc-800/60 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <YoutubeIcon className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.youtube}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-900/40 px-2.5 py-2 border border-zinc-800/60 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <InstagramIcon className="h-3.5 w-3.5 text-pink-400 shrink-0" />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.instagram}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-900/40 px-2.5 py-2 border border-zinc-800/60 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <FacebookIcon className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.facebook}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-900/40 px-2.5 py-2 border border-zinc-800/60 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <XIcon className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.x}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>
        </div>
      </div>
    </aside>
  );
};
