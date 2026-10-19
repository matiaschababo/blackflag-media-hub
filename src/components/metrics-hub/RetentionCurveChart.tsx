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
import { LineChart, Clock, Radio, Info } from 'lucide-react';

export const RetentionCurveChart: React.FC = () => {
  const { currentChannel, retentionData, episodes } = useHolding();
  const currentEp = episodes.find((e) => e.channelId === currentChannel.id);

  const hasData = retentionData && retentionData.length > 0;

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
                {currentEp ? `${currentEp.title} • Duración: ${currentEp.duration} min` : currentChannel.name}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-zinc-400">Objetivo 50% AVD</span>
            </div>
          </div>
        </div>

        {hasData ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentChannel.accentColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={currentChannel.accentColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="label" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
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
                <ReferenceLine y={50} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
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
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-zinc-950/60 border border-zinc-800/60 my-2">
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3 shadow-inner">
              <Radio className="h-6 w-6 animate-pulse text-amber-400/80" />
            </div>
            <h4 className="text-sm font-bold text-white">Curva en Espera de Reproducciones</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-md leading-relaxed">
              El trazado segundo a segundo se generará automáticamente a partir de los datos de retención de YouTube Studio una vez publicado el Episodio 01.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-[11px] font-mono text-zinc-500">
              <Info className="h-3.5 w-3.5" />
              <span>Umbral de activación: primeras 100 vistas orgánicas</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
