'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Activity,
  Table,
  Sliders,
  LineChart,
  Share2,
  Sparkles,
  SplitSquareVertical,
  FileText,
  LayoutDashboard,
  Tv,
  Calendar,
  Radar,
  Layers,
  Cpu,
  Film,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface SubnavHeaderProps {
  onOpenReport?: () => void;
}

export const SubnavHeader: React.FC<SubnavHeaderProps> = ({ onOpenReport }) => {
  const { mode, metricsTab, setMetricsTab, contentTab, setContentTab, currentChannel, allClips, globalStats } =
    useHolding();

  return (
    <div className="mb-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-2 backdrop-blur-md shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Navigation Tabs Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {mode === 'metrics_hub' ? (
            <>
              <button
                onClick={() => setMetricsTab('overview')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  metricsTab === 'overview'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Métricas Generales</span>
              </button>

              <button
                onClick={() => setMetricsTab('forensic_table')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  metricsTab === 'forensic_table'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Table className="h-4 w-4 text-emerald-400" />
                <span>Auditoría Short por Short</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                  {allClips.length}
                </span>
              </button>

              <button
                onClick={() => setMetricsTab('cross_analysis')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  metricsTab === 'cross_analysis'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Sliders className="h-4 w-4 text-sky-400" />
                <span>Cruce Formatos &amp; Duración</span>
              </button>

              <button
                onClick={() => setMetricsTab('retention')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  metricsTab === 'retention'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <LineChart className="h-4 w-4 text-cyan-400" />
                <span>Curvas de Retención</span>
              </button>

              <button
                onClick={() => setMetricsTab('platforms')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  metricsTab === 'platforms'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Share2 className="h-4 w-4 text-amber-400" />
                <span>Comparativa 5 Plataformas</span>
              </button>

              <button
                onClick={() => setMetricsTab('ab_testing')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  metricsTab === 'ab_testing'
                    ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <SplitSquareVertical className="h-4 w-4 text-pink-400" />
                <span>A/B Miniaturas</span>
              </button>

              <button
                onClick={() => setMetricsTab('ai_insights')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  metricsTab === 'ai_insights'
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Diagnóstico Enjambre</span>
              </button>
            </>
          ) : (
            <>
              {/* CONTENT MANAGER TABS */}
              <button
                onClick={() => setContentTab('overview')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'overview'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-sky-400" />
                <span>{currentChannel.id === 'all' ? 'Holding General' : 'Inicio Resumen'}</span>
              </button>

              <button
                onClick={() => setContentTab('arbitrage_360')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'arbitrage_360'
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span>Arbitraje 360° ({globalStats.arbitrageRatio}x)</span>
              </button>

              <button
                onClick={() => setContentTab('longform')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'longform'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Film className="h-4 w-4 text-amber-400" />
                <span>Videos Largos (16:9)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {globalStats.uniqueEpisodesCount}
                </span>
              </button>

              <button
                onClick={() => setContentTab('clips_matrix')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'clips_matrix'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Smartphone className="h-4 w-4 text-sky-400" />
                <span>Shorts &amp; Clips (9:16)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800/50">
                  {globalStats.uniqueClipsCount}
                </span>
              </button>

              <button
                onClick={() => setContentTab('parrilla')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'parrilla'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span>Parrilla 24/7</span>
              </button>

              <button
                onClick={() => setContentTab('radar')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'radar'
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Radar className="h-4 w-4 text-purple-400" />
                <span>Stock &amp; Runway ({globalStats.runwayDays}d)</span>
              </button>

              <button
                onClick={() => setContentTab('swarm_console')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'swarm_console'
                    ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Cpu className="h-4 w-4 text-pink-400" />
                <span>Consola Enjambre</span>
              </button>
            </>
          )}
        </div>

        {/* C-Level Report Modal Trigger */}
        {onOpenReport && (
          <button
            onClick={onOpenReport}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-950/40 transition cursor-pointer shrink-0 border border-emerald-400/30"
          >
            <FileText className="h-4 w-4" />
            <span>Informe Ejecutivo CMO</span>
          </button>
        )}
      </div>
    </div>
  );
};
