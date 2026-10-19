'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  TrendingUp,
  Eye,
  Clock,
  DollarSign,
  Users,
  Target,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  const { currentChannel } = useHolding();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');

  // Dynamic AI Insights inspired by Mix On Metrics Hub
  const getAiInsights = () => {
    const list: { type: 'success' | 'warning' | 'info'; title: string; text: string }[] = [];

    if (currentChannel.stats.avgAvd >= 50) {
      list.push({
        type: 'success',
        title: 'Retención Tier 1 Superior',
        text: `La permanencia promedio (${currentChannel.stats.avgAvd}%) supera ampliamente el estándar del 50%. El algoritmo favorece las recomendaciones up-next y sugeridos.`,
      });
    } else {
      list.push({
        type: 'warning',
        title: 'Optimización de Hook Necesaria',
        text: `Permanencia en ${currentChannel.stats.avgAvd}%. Se recomienda acortar los primeros 3 segundos a micro-beats de corte antes del segundo 0:08.`,
      });
    }

    if (currentChannel.stats.rpm >= 10) {
      list.push({
        type: 'success',
        title: 'RPM de Alta Rentabilidad B2B',
        text: `Monetización premium de $${currentChannel.stats.rpm.toFixed(2)} USD por millar. El perfil de audiencia (fundadores y directores de IT) maximiza los ingresos por anunciante.`,
      });
    } else {
      list.push({
        type: 'info',
        title: 'Escala por Volumen Masivo',
        text: `Nicho enfocado en reproducción masiva y multi-idioma. Con un RPM de $${currentChannel.stats.rpm.toFixed(2)} USD, el crecimiento de ingresos responde al volumen y co-viewing.`,
      });
    }

    list.push({
      type: 'info',
      title: 'Sindicación Ripple Shift Activa',
      text: `La distribución simultánea en Shorts, Reels, TikTok y X multiplica el alcance orgánico sin costo adicional de producción ($0 API fee).`,
    });

    return list;
  };

  const insights = getAiInsights();

  return (
    <div className="space-y-6">
      {/* Header & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              MÉTRICAS AUDITADAS
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              YouTube Data API + Meta Graph + Buffer
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
            Rendimiento Consolidado de Audiencia ({currentChannel.name})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Analítica de retención, permanencia (AVD), monetización y conversión multi-red.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center space-x-1 rounded-xl bg-zinc-950 p-1 border border-zinc-800">
          {(['7D', '30D', '90D', 'ALL'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                timeRange === r
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r === 'ALL' ? 'Histórico' : r}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Views */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">TOTAL VIEWS</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Eye className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-white sm:text-3xl">
            {currentChannel.stats.totalViews.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+24.8% vs período anterior</span>
          </div>
        </div>

        {/* Watch Time (Hours) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">WATCH TIME</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-white sm:text-3xl">
            {currentChannel.stats.watchHours.toLocaleString()} hs
          </div>
          <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>100% elegible monetización</span>
          </div>
        </div>

        {/* AVD % (Average View Duration) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">AVD % (PERMANENCIA)</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-400 sm:text-3xl">
            {currentChannel.stats.avgAvd}%
          </div>
          <div className="mt-1 text-xs text-zinc-400 font-medium">
            Benchmark Tier 1: <strong className="text-emerald-400">&gt; 50%</strong> (Cumplido)
          </div>
        </div>

        {/* RPM ($ USD) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">RPM ESTIMADO</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-white sm:text-3xl">
            ${currentChannel.stats.rpm.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-zinc-400 font-medium">
            Nicho: {currentChannel.niche.split('&')[0]}
          </div>
        </div>

        {/* Est. Revenue */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">INGRESOS PROYECTADOS</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-400 sm:text-3xl">
            ${currentChannel.stats.estimatedRevenue.toLocaleString()} USD
          </div>
          <div className="mt-1 text-xs text-zinc-400 font-medium">
            AdSense + Afiliados B2B
          </div>
        </div>

        {/* Subscribers / Audience */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">AUDIENCIA TOTAL</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-white sm:text-3xl">
            {currentChannel.stats.subscribers.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-zinc-400 font-medium">
            Seguidores multi-plataforma
          </div>
        </div>
      </div>

      {/* AI Insights Panel (Replicated from Mix On Metrics Hub) */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-zinc-900/40 to-zinc-950 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-2 text-cyan-400 mb-4">
          <Zap className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
            AI Insights & Diagnóstico de Crecimiento ({currentChannel.name})
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 space-y-2 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2">
                {ins.type === 'success' && <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />}
                {ins.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />}
                {ins.type === 'info' && <Target className="h-4 w-4 text-cyan-400 shrink-0" />}
                <h4 className="text-xs font-bold text-white">{ins.title}</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Plan & Monetization Milestones */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
              Plan de Crecimiento & Hitos de Monetización
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">FASE ACTIVA: PRODUCCIÓN & ESCALA</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span>Hito 1: Partner Program</span>
              <span className="text-emerald-400 font-mono text-[11px]">100% OK</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-full"></div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              4,000 hs de visualización y 1,000 suscriptores superados.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span>Hito 2: Monopolio Up-Next</span>
              <span className="text-amber-400 font-mono text-[11px]">84%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[84%]"></div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              CTR en test A/B/C sostenido &gt; 8% y playlists seriadas activas.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span>Hito 3: Sindicación Masiva 5x</span>
              <span className="text-cyan-400 font-mono text-[11px]">En Proceso</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[65%]"></div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              10 Shorts distribuidos en YouTube, Meta, TikTok y X con Ripple Shift.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
