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
    <aside className="w-full shrink-0 border-r border-zinc-800/80 bg-zinc-950/60 p-4 md:w-64 md:min-h-[calc(100vh-4rem)]">
      {/* Channel Identity Card */}
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3.5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: `${currentChannel.accentColor}20`,
              color: currentChannel.accentColor,
            }}
          >
            {currentChannel.shortCode} CANAL
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {currentChannel.shortsPerDay} clips/día
          </span>
        </div>
        <h2 className="mt-2 text-sm font-bold text-white leading-tight">
          {currentChannel.name}
        </h2>
        <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2">
          {currentChannel.niche}
        </p>

        {/* Small stats pill */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-950/60 p-2 text-[10px] border border-zinc-800/50">
          <div className="text-zinc-400">
            Stock: <span className="font-bold text-white">{filteredClips.length} clips</span>
          </div>
          <div className="text-zinc-400">
            Emitidos: <span className="font-bold text-emerald-400">{publishedClipsCount}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-1">
        <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
          {mode === 'content_manager' ? 'MOTOR DE CONTENIDO' : 'INTELIGENCIA DE MÉTRICAS'}
        </div>

        {mode === 'content_manager' ? (
          <>
            <button
              onClick={() => setContentTab('clips_matrix')}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                contentTab === 'clips_matrix'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="h-4 w-4" />
                <span>Matriz de 10 Clips</span>
              </div>
              <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] font-mono text-zinc-300">
                10
              </span>
            </button>

            <button
              onClick={() => setContentTab('parrilla')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                contentTab === 'parrilla'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Parrilla de Sindicación</span>
            </button>

            <button
              onClick={() => setContentTab('episodes')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                contentTab === 'episodes'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Tv className="h-4 w-4" />
              <span>Episodios Largos (VOD)</span>
            </button>

            <button
              onClick={() => setContentTab('radar')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                contentTab === 'radar'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Radar className="h-4 w-4" />
              <span>Radar de Stock & Ripple</span>
            </button>

            <button
              onClick={() => setContentTab('overview')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                contentTab === 'overview'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Resumen del Canal</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setMetricsTab('overview')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                metricsTab === 'overview'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Resumen Ejecutivo</span>
            </button>

            <button
              onClick={() => setMetricsTab('retention')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                metricsTab === 'retention'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <LineChart className="h-4 w-4" />
              <span>Curva de Retención</span>
            </button>

            <button
              onClick={() => setMetricsTab('platforms')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                metricsTab === 'platforms'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Share2 className="h-4 w-4" />
              <span>Comparativa Multi-Red</span>
            </button>

            <button
              onClick={() => setMetricsTab('ab_testing')}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                metricsTab === 'ab_testing'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <SplitSquareVertical className="h-4 w-4" />
              <span>Tríada A/B/C Testing</span>
            </button>
          </>
        )}
      </div>

      {/* Connected Accounts & Health Footer */}
      <div className="mt-8 border-t border-zinc-800/80 pt-4">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between">
          <span>REDES VINCULADAS</span>
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
        </div>
        <div className="space-y-1.5 text-[11px] text-zinc-400">
          <div className="flex items-center justify-between rounded-lg bg-zinc-900/40 px-2.5 py-1.5 border border-zinc-800/40">
            <div className="flex items-center space-x-2">
              <YoutubeIcon className="h-3.5 w-3.5 text-red-400" />
              <span className="truncate max-w-[120px]">{currentChannel.accounts.youtube}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-zinc-900/40 px-2.5 py-1.5 border border-zinc-800/40">
            <div className="flex items-center space-x-2">
              <InstagramIcon className="h-3.5 w-3.5 text-pink-400" />
              <span className="truncate max-w-[120px]">{currentChannel.accounts.instagram}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-zinc-900/40 px-2.5 py-1.5 border border-zinc-800/40">
            <div className="flex items-center space-x-2">
              <FacebookIcon className="h-3.5 w-3.5 text-blue-400" />
              <span className="truncate max-w-[120px]">{currentChannel.accounts.facebook}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-zinc-900/40 px-2.5 py-1.5 border border-zinc-800/40">
            <div className="flex items-center space-x-2">
              <XIcon className="h-3.5 w-3.5 text-sky-400" />
              <span className="truncate max-w-[120px]">{currentChannel.accounts.x}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>
        </div>
      </div>
    </aside>
  );
};
