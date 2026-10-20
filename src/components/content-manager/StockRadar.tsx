'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Radar,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const StockRadar: React.FC = () => {
  const { channels, clips, currentChannel, setSelectedChannelId, setContentTab } = useHolding();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#121217] p-5 shadow-lg">
        <div className="flex items-center space-x-2">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${currentChannel.accentColor}25`,
              color: currentChannel.accentColor,
            }}
          >
            CENTINELA DE STOCK & RUNWAY
          </span>
          <span className="text-xs text-zinc-400 font-mono">Algoritmo Ripple Shift</span>
        </div>
        <h2 className="mt-1.5 text-xl font-extrabold text-white tracking-tight sm:text-2xl">
          Radar de Stock y Monitoreo de Runway
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Auditoría de días de inventario virgen restante para evitar baches en la grilla diaria de cada canal.
        </p>
      </div>

      {/* Runway Cards for All Channels with Official Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {channels.map((ch) => {
          const chClips = clips.filter((c) => c.channelId === ch.id);
          const publishedCount = chClips.filter((c) =>
            Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
          ).length;
          const virginCount = chClips.length - publishedCount;
          const daysRemaining = Math.max(0, Math.floor(virginCount / ch.shortsPerDay));
          const isCritical = daysRemaining <= 2;
          const isCurrent = ch.id === currentChannel.id;

          return (
            <div
              key={ch.id}
              className={`rounded-2xl border p-5 backdrop-blur-sm transition-all duration-200 ${
                isCurrent
                  ? 'border-amber-500/60 bg-[#161620] shadow-xl shadow-amber-500/10'
                  : 'border-zinc-800/80 bg-[#121217] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                    alt={ch.name}
                    className="h-11 w-11 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {ch.name}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {ch.shortsPerDay} shorts/día
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
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
                      <span>SALUDABLE</span>
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs text-zinc-400 mt-3 line-clamp-1">
                {ch.niche}
              </p>

              <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-black/60 p-2.5 border border-zinc-800/50">
                  <div className="text-[9px] uppercase font-mono text-zinc-400 font-bold">STOCK VIRGEN</div>
                  <div className="text-lg font-black text-white mt-0.5">{virginCount} clips</div>
                </div>

                <div className="rounded-xl bg-black/60 p-2.5 border border-zinc-800/50">
                  <div className="text-[9px] uppercase font-mono text-zinc-400 font-bold">DÍAS COBERTURA</div>
                  <div className={`text-lg font-black mt-0.5 ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {daysRemaining} días
                  </div>
                </div>
              </div>

              {/* Channel Action */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                {isCurrent ? (
                  <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Canal Activo</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedChannelId(ch.id)}
                    className="text-xs font-bold text-zinc-400 hover:text-white transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Seleccionar este canal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedChannelId(ch.id);
                    setContentTab('parrilla');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition cursor-pointer"
                >
                  Ver Parrilla
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};