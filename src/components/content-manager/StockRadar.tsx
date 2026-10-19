'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Radar,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const StockRadar: React.FC = () => {
  const { channels, clips, currentChannel } = useHolding();

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
            CENTINELA DE STOCK
          </span>
          <span className="text-xs text-zinc-400 font-mono">Algoritmo Ripple Shift</span>
        </div>
        <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          Radar de Stock y Monitoreo de Runway
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Auditoría de días de inventario virgen restante para evitar baches en la grilla diaria.
        </p>
      </div>

      {/* Runway Cards for All Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {channels.map((ch) => {
          const chClips = clips.filter((c) => c.channelId === ch.id);
          const publishedCount = chClips.filter((c) =>
            Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
          ).length;
          const virginCount = chClips.length - publishedCount;
          const daysRemaining = Math.max(0, Math.floor(virginCount / ch.shortsPerDay));
          const isCritical = daysRemaining <= 2;

          return (
            <div
              key={ch.id}
              className={`rounded-2xl border p-5 backdrop-blur-sm transition ${
                ch.id === currentChannel.id
                  ? 'border-amber-500/50 bg-amber-950/10 shadow-lg'
                  : 'border-zinc-800/80 bg-zinc-900/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{ch.shortCode}</span>
                <span
                  className={`inline-flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {isCritical ? (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      <span>STOCK BAJO</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>RUNWAY SALUDABLE</span>
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-2">{ch.name}</h3>
              <p className="text-xs text-zinc-400 line-clamp-1">{ch.niche}</p>

              <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-zinc-950/70 p-2.5 border border-zinc-800/50">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">STOCK VIRGEN</div>
                  <div className="text-lg font-black text-white">{virginCount} clips</div>
                </div>

                <div className="rounded-xl bg-zinc-950/70 p-2.5 border border-zinc-800/50">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">DÍAS COBERTURA</div>
                  <div className={`text-lg font-black ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {daysRemaining} días
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                <span>Cadencia: {ch.shortsPerDay}/día</span>
                <span>Slots: {ch.timeSlots.length} fijos</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ripple Shift Doctrine Explanation */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center space-x-2 text-amber-400">
          <Flame className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
            Protocolo de Ingesta Dinámica & Ripple Shift (Zero-Waste)
          </h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          En este holding ningún clip de archivo se descarta jamás. Cuando el equipo de edición o un agente de IA suelta un clip fresco con el flag de prioridad, el motor ejecuta un <strong>desplazamiento en cascada (+1 slot)</strong>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400 font-mono">
          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-amber-400 font-bold block mb-1">1. Entrada Prioritaria</span>
            El clip fresco toma el turno de mañana a primera hora del canal.
          </div>
          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-amber-400 font-bold block mb-1">2. Ripple Shift (+1)</span>
            Todos los clips de archivo pre-programados se corren un horario hacia adelante.
          </div>
          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-amber-400 font-bold block mb-1">3. Freeze Window (3h)</span>
            Los turnos de las próximas 3 horas quedan congelados para garantizar estabilidad.
          </div>
        </div>
      </div>
    </div>
  );
};
