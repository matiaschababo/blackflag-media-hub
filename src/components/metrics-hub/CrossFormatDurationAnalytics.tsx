'use client';

import React, { useMemo } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { ForensicAnalyticsData } from '../../types';
import levelpopForensicFallback from '../../data/levelpop_forensic_analytics.json';
import {
  BarChart2,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const CrossFormatDurationAnalytics: React.FC = () => {
  const { currentChannel } = useHolding();

  const forensicData: ForensicAnalyticsData = useMemo(() => {
    if (currentChannel.stats?.forensic_analytics?.formatComparison?.length) {
      return currentChannel.stats.forensic_analytics;
    }
    return levelpopForensicFallback as unknown as ForensicAnalyticsData;
  }, [currentChannel]);

  const totalViews = forensicData.channel.auditedViewsSum || 8488;
  const maxAvgViews = Math.max(...forensicData.formatComparison.map((f) => f.avgViewsPerShort), 1);

  // Colors for format cards
  const formatColors: Record<string, { bar: string; text: string; bg: string; border: string }> = {
    'Bridge Assault & Obby': {
      bar: 'bg-emerald-400',
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/20',
      border: 'border-emerald-800/40',
    },
    'Neon Marbles & Survival': {
      bar: 'bg-cyan-400',
      text: 'text-cyan-400',
      bg: 'bg-cyan-950/20',
      border: 'border-cyan-800/40',
    },
    'Toy Cars & Supercars': {
      bar: 'bg-amber-400',
      text: 'text-amber-400',
      bg: 'bg-amber-950/20',
      border: 'border-amber-800/40',
    },
    'Arcade General': {
      bar: 'bg-purple-400',
      text: 'text-purple-400',
      bg: 'bg-purple-950/20',
      border: 'border-purple-800/40',
    },
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. CRUCE EMPÍRICO: DURACIÓN (<45s vs 120s) */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Clock className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider font-mono text-white">
              Cruce Empírico: Shorts Rápidos (&lt;45s) vs. Shorts Extendidos (120s)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/50 font-bold">
            DATO AUDITADO YOUTUBE API
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card Ultra-Shorts */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Shorts Rápidos (&lt;45 Segundos)
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-400 text-black">
                FORMATO GANADOR (+2.6x)
              </span>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                844
              </span>
              <span className="text-xs sm:text-sm text-zinc-400">vistas promedio por Short</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Total vistas acumuladas:</span>
                <span className="font-mono font-bold text-white">3,378 vistas (4 Shorts)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Retención estimada a t=37s:</span>
                <span className="font-mono font-bold text-emerald-400">65.0% (Alta)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Short outlier líder:</span>
                <span className="font-mono font-bold text-white">Bridge Assault (1,352)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-900/50 text-xs sm:text-sm text-emerald-200 leading-relaxed">
              El algoritmo de YouTube Shorts premia el porcentaje de completitud: al durar 37s, los usuarios ven el video completo y disparan la velocidad a más de 75 vistas/hora.
            </div>
          </div>

          {/* Card Long 120s */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Shorts Extendidos (120 Segundos / 2 Minutos)
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-800/60">
                FATIGA DE RETENCIÓN
              </span>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                511
              </span>
              <span className="text-xs sm:text-sm text-zinc-400">vistas promedio por Short</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Total vistas acumuladas:</span>
                <span className="font-mono font-bold text-white">5,108 vistas (10 Shorts)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Retención estimada a t=60s:</span>
                <span className="font-mono font-bold text-amber-400">27.0% (Caída abrupta)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Formato más afectado:</span>
                <span className="font-mono font-bold text-zinc-400">Toy Cars (318 vistas prom.)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              El formato de 120s sufre una caída a partir del segundo 45. Aunque suma horas brutas de reproducción, reduce el ratio de re-inyección en el feed de Shorts.
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RENDIMIENTO POR CATEGORÍA Y SHARE DEL CANAL */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BarChart2 className="h-5 w-5 text-sky-400" />
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider font-mono text-white">
              Rendimiento por Categoría y Cuota de Audiencia
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400 font-semibold">
            4 CATEGORÍAS AUDITADAS
          </span>
        </div>

        {/* Traffic Share Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-400">
            <span>Distribución de Vistas Totales ({totalViews.toLocaleString()})</span>
            <span className="font-mono text-white font-bold">100% Auditado</span>
          </div>
          <div className="h-3.5 w-full rounded-full bg-zinc-950 overflow-hidden flex">
            {forensicData.formatComparison.map((fmt) => {
              const share = Math.round((fmt.totalViews / totalViews) * 100);
              const color = formatColors[fmt.category]?.bar || 'bg-zinc-500';
              return (
                <div
                  key={fmt.category}
                  className={`h-full ${color}`}
                  style={{ width: `${share}%` }}
                  title={`${fmt.category}: ${share}% (${fmt.totalViews} vistas)`}
                />
              );
            })}
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {forensicData.formatComparison.map((fmt) => {
            const colors = formatColors[fmt.category] || {
              bar: 'bg-zinc-500',
              text: 'text-zinc-400',
              bg: 'bg-zinc-900',
              border: 'border-zinc-800',
            };
            const share = Math.round((fmt.totalViews / totalViews) * 100);
            const avgBarPct = Math.round((fmt.avgViewsPerShort / maxAvgViews) * 100);

            return (
              <div
                key={fmt.category}
                className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 space-y-3.5`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-mono font-bold ${colors.text} truncate`}>
                    {fmt.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-zinc-950 px-2 py-0.5 rounded border border-zinc-700">
                    {share}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                    {fmt.avgViewsPerShort.toLocaleString()}
                  </div>
                  <div className="text-xs text-zinc-400">Promedio por video emitido</div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                    <div className={`h-full ${colors.bar}`} style={{ width: `${avgBarPct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Total vistas:</span>
                    <span className="font-bold text-white">{fmt.totalViews.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{fmt.publicVideos} emitidos / {fmt.totalVideos} total</span>
                  <span className="text-white font-bold">{fmt.avgEngagementRate}% ER</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. METAS DE MONETIZACIÓN Y PROYECCIÓN */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
        <div className="flex items-center space-x-2.5">
          <Target className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider font-mono text-white">
            Plan de Aceleración y Proyección Semanal
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs sm:text-sm">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <span className="text-zinc-400 text-xs">Duración Recomendada Próximo Lote</span>
            <div className="font-extrabold text-white text-lg">37 a 48 Segundos</div>
            <p className="text-xs text-zinc-400 font-sans">
              Concentrar el 80% del stock en Ultra-Shorts para maximizar el índice de repetición y completitud.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <span className="text-zinc-400 text-xs">Cadencia Óptima</span>
            <div className="font-extrabold text-emerald-400 text-lg">5 Shorts Diarios</div>
            <p className="text-xs text-zinc-400 font-sans">
              Publicación desatendida espaciada cada 4-5 horas para capturar las 5 ventanas de tráfico global.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <span className="text-zinc-400 text-xs">Formato 16:9 Horizontal</span>
            <div className="font-extrabold text-sky-400 text-lg">1 VOD Compilatorio / Mes</div>
            <p className="text-xs text-zinc-400 font-sans">
              Reservar videos de más de 10 minutos para recopilatorios horizontales en 1440p para Watch Time bruto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
