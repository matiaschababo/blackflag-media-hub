'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
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
  Bot,
  Send,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

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
    <aside className="w-full shrink-0 border-r border-zinc-800/80 bg-[#0d0d11]/90 backdrop-blur-md p-4 md:w-64 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div>
        {/* Channel Identity Card with Real Avatar & Banner Backdrop */}
        <div
          className="mb-6 rounded-2xl border border-zinc-800/90 bg-[#121217] p-3.5 shadow-xl relative overflow-hidden group transition-all duration-300"
          style={{
            borderTop: `3px solid ${currentChannel.accentColor}`,
            boxShadow: `0 8px 24px -6px ${currentChannel.accentColor}20`,
          }}
        >
          {/* Subtle Banner Background */}
          {currentChannel.bannerUrl && (
            <div
              className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url(${currentChannel.bannerUrl})` }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${currentChannel.accentColor}25`,
                  color: currentChannel.accentColor,
                }}
              >
                {currentChannel.shortCode} CANAL
              </span>
              <span className="text-[10px] text-zinc-400 font-mono font-medium">
                {currentChannel.shortsPerDay} shorts/día
              </span>
            </div>

            <div className="mt-2.5 flex items-center space-x-2.5">
              <img
                src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
                alt={currentChannel.name}
                className="h-9 w-9 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
              />
              <div className="overflow-hidden">
                <h2 className="text-sm font-extrabold text-white leading-tight truncate">
                  {currentChannel.name}
                </h2>
                <p className="text-[10px] text-zinc-400 truncate">
                  {currentChannel.niche}
                </p>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="rounded-xl bg-black/60 p-2 border border-zinc-800/80">
                <span className="text-zinc-500 block text-[8px] uppercase tracking-wider">Stock</span>
                <span className="font-extrabold text-white text-xs">{filteredClips.length} clips</span>
              </div>
              <div className="rounded-xl bg-black/60 p-2 border border-zinc-800/80">
                <span className="text-zinc-500 block text-[8px] uppercase tracking-wider">Emitidos</span>
                <span className="font-extrabold text-emerald-400 text-xs">{publishedClipsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <div className="px-2 pb-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-500 font-mono flex items-center justify-between">
            <span>{mode === 'content_manager' ? 'MOTOR DE CONTENIDO' : 'INTELIGENCIA DE MÉTRICAS'}</span>
            <span className="h-1 w-1 rounded-full bg-amber-400"></span>
          </div>

          {mode === 'content_manager' ? (
            <>
              <button
                onClick={() => setContentTab('clips_matrix')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'clips_matrix'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
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
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Parrilla de Publicación</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">24/7</span>
              </button>

              <button
                onClick={() => setContentTab('telegram_bot')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'telegram_bot'
                    ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Bot className="h-4 w-4 text-blue-400" />
                  <span>Bot Telegram & API</span>
                </div>
                <span className="inline-flex items-center space-x-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Auto</span>
                </span>
              </button>

              <button
                onClick={() => setContentTab('episodes')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'episodes'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Tv className="h-4 w-4 text-amber-400" />
                  <span>Episodios Largos</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">1440p</span>
              </button>

              <button
                onClick={() => setContentTab('radar')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'radar'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Radar className="h-4 w-4 text-amber-400" />
                  <span>Radar de Stock</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">OK</span>
              </button>

              <button
                onClick={() => setContentTab('overview')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'overview'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
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
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
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
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
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
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
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
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
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

      {/* Linked Social Accounts Panel with Real SVG Logos */}
      <div className="mt-8 border-t border-zinc-800/80 pt-4">
        <div className="px-2 pb-2 text-[9px] font-black uppercase tracking-wider text-zinc-500 font-mono flex items-center justify-between">
          <span>REDES OFICIALES</span>
          <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-[9px]">
            <CheckCircle2 className="h-3 w-3" />
            <span>APIs OK</span>
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-2.5 py-2 border border-zinc-800/70 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <PlatformIcon platform="YOUTUBE" size={16} />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.youtube}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-2.5 py-2 border border-zinc-800/70 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <PlatformIcon platform="INSTAGRAM" size={16} />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.instagram}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-2.5 py-2 border border-zinc-800/70 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <PlatformIcon platform="FACEBOOK" size={16} />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.facebook}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-2.5 py-2 border border-zinc-800/70 hover:border-zinc-700 transition">
            <div className="flex items-center space-x-2 truncate">
              <PlatformIcon platform="TWITTER" size={16} />
              <span className="text-zinc-300 text-[11px] truncate">{currentChannel.accounts.x}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          </div>
        </div>
      </div>
    </aside>
  );
};
