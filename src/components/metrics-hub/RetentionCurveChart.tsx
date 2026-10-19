'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import { RETENTION_CURVE_DATA } from '../../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { LineChart, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const RetentionCurveChart: React.FC = () => {
  const { currentChannel } = useHolding();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span
            className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${currentChannel.accentColor}25`,
              color: currentChannel.accentColor,
            }}
          >
            RETENTION ENGINE
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Análisis Segundo a Segundo (AVD)
          </span>
        </div>
        <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          Curva Forense de Retención de Audiencia
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Diagnóstico de permanencia del Episodio 01. Línea verde de referencia fijada en el estándar de oro del 50%.
        </p>
      </div>

      {/* Main Chart Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <LineChart className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                Porcentaje de Espectadores Activos (%)
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">
                Episodio 01: 14:48 min • Muestra: 14.250 reproducciones
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="text-zinc-300">Retención Real</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-zinc-400">Objetivo 50% AVD</span>
            </div>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={RETENTION_CURVE_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#27272a',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(val: any) => [`${val ?? 0}%`, 'Retención']}
              />
              <ReferenceLine y={50} stroke="#10b981" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="retention"
                stroke="#00E5FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#retentionGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Audit Badges */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <div className="text-[10px] font-mono uppercase text-zinc-400">HOOK GATE (0:03s)</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">74.8%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Meta &gt; 70% (Aprobado)</div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <div className="text-[10px] font-mono uppercase text-zinc-400">MINUTO 1:00</div>
            <div className="text-lg font-bold text-white mt-0.5">54.8%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Filtro de curiosidad</div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <div className="text-[10px] font-mono uppercase text-zinc-400">MINUTO 5:00</div>
            <div className="text-lg font-bold text-white mt-0.5">48.7%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Meseta de desarrollo</div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <div className="text-[10px] font-mono uppercase text-zinc-400">FINAL (14:48)</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">42.1%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Conversión a Call to Action</div>
          </div>
        </div>
      </div>
    </div>
  );
};
