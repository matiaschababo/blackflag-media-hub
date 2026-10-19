'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Eye,
  Clock,
  DollarSign,
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Zap,
  Radio,
} from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  const { currentChannel } = useHolding();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');

  const getNicheTargetRpm = (channelId: string) => {
    switch (channelId) {
      case 'blackflag':
        return '$15 - $25 USD (Finanzas B2B & High-Ticket)';
      case 'podmon':
        return '$7 - $12 USD (Gaming Storytelling Tier 1)';
      case 'neon_marbles':
        return '$4 - $8 USD (Sensory Co-Viewing Global)';
      default:
        return '$5 - $10 USD';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pre-launch Banner (Zero Hallucinations) */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-zinc-900/60 to-zinc-950 p-5 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-400">
                FASE DE PRE-LANZAMIENTO • {currentChannel.name}
              </span>
              <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                0 Métricas Acumuladas
              </span>
            </div>
            <h3 className="mt-1 text-base font-extrabold text-white">
              Canal en preparación para primera emisión
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400 max-w-2xl leading-relaxed">
              No hay reproducciones acumuladas todavía. Los contadores y gráficos en tiempo real se activarán automáticamente una vez subido el Episodio 01 y conectados los tokens de YouTube Data API v3 y Meta Graph.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="studio-pill bg-zinc-900 text-zinc-400 border border-zinc-800">
            APIs: Standby
          </span>
        </div>
      </div>

      {/* 6 Real Baseline KPI Cards (Zeros / Pre-launch) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Views */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">TOTAL VIEWS</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Eye className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">0</div>
          <div className="mt-1 text-xs text-zinc-500 font-medium">
            Esperando primera emisión
          </div>
        </div>

        {/* Watch Time */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">WATCH TIME</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">0 hs</div>
          <div className="mt-1 text-xs text-zinc-500 font-medium">
            Meta Partner Program: 4.000 hs
          </div>
        </div>

        {/* AVD % */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">AVD % (PERMANENCIA)</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-zinc-500">-- %</div>
          <div className="mt-1 text-xs text-zinc-500 font-medium">
            Benchmark Tier 1: &gt; 50%
          </div>
        </div>

        {/* Target RPM */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">RPM TARGET ESTIMADO</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-lg font-black text-amber-400 font-mono">
            {getNicheTargetRpm(currentChannel.id).split(' ')[0]}
          </div>
          <div className="mt-1 text-xs text-zinc-500 font-medium">
            {getNicheTargetRpm(currentChannel.id)}
          </div>
        </div>

        {/* Ingresos Acumulados */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">INGRESOS GENERADOS</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">$0.00 USD</div>
          <div className="mt-1 text-xs text-zinc-500 font-medium">
            AdSense + Afiliados
          </div>
        </div>

        {/* Audiencia */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400">AUDIENCIA CONSOLIDADA</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">0</div>
          <div className="mt-1 text-xs text-zinc-500 font-medium">
            Multi-plataforma (5 redes)
          </div>
        </div>
      </div>

      {/* Pre-flight Launch Checklist (Real Operational Status) */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
              Checklist de Salida a Producción ({currentChannel.name})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            3/4 PASOS LISTOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3.5 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>1. Guion Maestro</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Guion del Episodio 01 bloqueado y adaptado para el oído.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3.5 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>2. Audio & Render 3D</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              ElevenLabs v4 y render 60 FPS calibrado a -14 LUFS.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3.5 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>3. Matriz 10 Clips</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              10 nodos virales con Safe Zones (MarginV=720) listos en Content Manager.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-3.5 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <AlertCircle className="h-4 w-4" />
              <span>4. Tokens de API</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Pendiente conectar credenciales oficiales de YouTube y Meta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
