'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
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
  const { currentChannel, retentionData, episodes } = useHolding();
  const currentEp = episodes.find((e) => e.channelId === currentChannel.id);

  const hookGateVal = retentionData.find((d) => d.second === 3)?.retention ?? 75;
  const min1Val = retentionData.find((d) => d.second === 60)?.retention ?? 55;
  const midVal = retentionData.find((d) => d.second >= 300 && d.second <= 600)?.retention ?? 50;
  const endPoint = retentionData[retentionData.length - 1];

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
            Análisis Segundo a Segundo (AVD) • {currentChannel.name}
          </span>
        </div>
        <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          Curva Forense de Retención de Audiencia ({currentChannel.shortCode})
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Diagnóstico de permanencia por segundo. Línea verde de referencia fijada en el estándar del 50% de AVD.
        </p>
      </div>

      {/* Main Chart Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <LineChart className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                Porcentaje de Espectadores Activos (%)
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">
                {currentEp
                  ? `${currentEp.title} • Duración: ${currentEp.duration} min • Muestra: ${currentChannel.stats.totalViews.toLocaleString()} views`
                  : `${currentChannel.name} • Datos de Audiencia`}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: currentChannel.accentColor }}
              ></span>
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
              data={retentionData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentChannel.accentColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentChannel.accentColor} stopOpacity={0.0} />
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
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(val: any) => [`${val}%`, 'Retención']}
              />
              <ReferenceLine
                y={50}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Objetivo 50%',
                  fill: '#10b981',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
              <Area
                type="monotone"
                dataKey="retention"
                stroke={currentChannel.accentColor}
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
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{hookGateVal}%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Meta &gt; 70% (Aprobado)</div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <div className="text-[10px] font-mono uppercase text-zinc-400">MINUTO 1:00</div>
            <div className="text-lg font-bold text-white mt-0.5">{min1Val}%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Filtro de curiosidad</div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <div className="text-[10px] font-mono uppercase text-zinc-400">DESARROLLO</div>
            <div className="text-lg font-bold text-white mt-0.5">{midVal}%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Meseta de retención</div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <div className="text-[10px] font-mono uppercase text-zinc-400">FINAL ({endPoint?.label || 'Fin'})</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{endPoint?.retention || 42}%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Conversión a CTA / Up-Next</div>
          </div>
        </div>
      </div>
    </div>
  );
};
