'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import { PLATFORM_COMPARISON_DATA } from '../../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Share2 } from 'lucide-react';

const COLORS = ['#ef4444', '#ec4899', '#06b6d4', '#3b82f6', '#38bdf8'];

export const PlatformComparisonChart: React.FC = () => {
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
            SINDICACIÓN MULTI-RED
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            YouTube • Meta • Buffer • X
          </span>
        </div>
        <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          Comparativa de Tráfico y Rendimiento por Plataforma
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Distribución de reproducciones y tasa de interacción (ER%) en las 5 redes oficiales.
        </p>
      </div>

      {/* Main Bar Chart */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Share2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">
              Reproducciones Consolidadas por Red
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">
              Datos agregados de Shorts, Reels, TikToks y Tweets
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={PLATFORM_COMPARISON_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="platform"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#27272a',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(val: any) => [`${Number(val || 0).toLocaleString()} vistas`, 'Reproducciones']}
              />
              <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                {PLATFORM_COMPARISON_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="mt-6 overflow-x-auto pt-4 border-t border-zinc-800/80">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Plataforma</th>
                <th className="py-2.5 px-3">Reproducciones</th>
                <th className="py-2.5 px-3">Horas Vistas</th>
                <th className="py-2.5 px-3 text-right">Engagement Rate (ER)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {PLATFORM_COMPARISON_DATA.map((p, idx) => (
                <tr key={p.platform} className="hover:bg-zinc-800/20">
                  <td className="py-3 px-3 font-bold text-white flex items-center space-x-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: COLORS[idx] }}
                    ></span>
                    <span>{p.platform}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{p.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-zinc-400">{p.hours} hs</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">
                    {p.engagementRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
