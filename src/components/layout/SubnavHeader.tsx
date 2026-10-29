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
} from 'lucide-react';

interface SubnavHeaderProps {
  onOpenReport?: () => void;
}

export const SubnavHeader: React.FC<SubnavHeaderProps> = ({ onOpenReport }) => {
  const { mode, metricsTab, setMetricsTab, contentTab, setContentTab, currentChannel, allClips } =
    useHolding();

  const channelClipsCount =
    currentChannel.id === 'all'
      ? allClips.length
      : allClips.filter((c) => c.channelId === currentChannel.id).length;

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
                <span>Visión Global</span>
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
                <span>Short por Short (20)</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                  Auditado
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
                <span>Multi-Red</span>
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
              <button
                onClick={() => setContentTab('overview')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'overview'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-sky-400" />
                <span>Inicio Resumen</span>
              </button>

              <button
                onClick={() => setContentTab('episodes')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'episodes'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Tv className="h-4 w-4 text-amber-400" />
                <span>Episodios VOD</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  1440p
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
                <span>Stock &amp; Runway</span>
              </button>

              <button
                onClick={() => setContentTab('clips_matrix')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'clips_matrix'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Layers className="h-4 w-4 text-sky-400" />
                <span>Matriz de Clips ({channelClipsCount})</span>
              </button>

              <button
                onClick={() => setContentTab('swarm_console')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                  contentTab === 'swarm_console'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Cpu className="h-4 w-4 text-emerald-400" />
                <span>Enjambre IA</span>
              </button>
            </>
          )}
        </div>

        {/* Right CTA / Information */}
        {mode === 'metrics_hub' && onOpenReport && (
          <div className="shrink-0 flex items-center justify-end">
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer shadow-md border border-emerald-400/30"
            >
              <FileText className="h-4 w-4" />
              <span>Exportar Informe C-Level</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
