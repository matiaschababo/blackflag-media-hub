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
} from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  const { currentChannel } = useHolding();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');

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

      {/* Strategic Niche Insight Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400">
          <ShieldCheck className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
            Diagnóstico Financiero & Monetización de Nicho
          </h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {currentChannel.id === 'blackflag' &&
            'BlackFlag Blueprint opera sobre el nicho de mayor RPM de todo YouTube: Finanzas Offshore e Incorporaciones Corporativas en EE.UU. Su rentabilidad no depende únicamente de las visitas de AdSense, sino del embudo High-Ticket de afiliados (Doola $1,800 CPA, Firstbase y bancos internacionales).'}
          {currentChannel.id === 'podmon' &&
            'Podmon aprovecha el algoritmo de retención prolongada de series cinemáticas en Farming Simulator 25. Con videos de 25-45 minutos y AVD > 55%, cada espectador reproduce entre 3 y 5 anuncios mid-roll en mercados Tier 1 (EE.UU., UK, Canadá).'}
          {currentChannel.id === 'neon_marbles' &&
            'Neon Marbles & Sensory Arcade está optimizado para monetización en Smart TVs bajo el estándar General Audience (No Made for Kids). Al ser 100% no-verbal, un solo video compila vistas en más de 100 países conservando anuncios personalizados activos.'}
        </p>
      </div>
    </div>
  );
};
