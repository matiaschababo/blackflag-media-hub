'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const StockRadar: React.FC = () => {
  const { channels, clips, currentChannel, setSelectedChannelId, setContentTab } = useHolding();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Radar de Stock y Monitoreo de Runway
        </h2>
        <p className="text-xs text-[#848d97] mt-0.5">
          Auditoría de días de inventario virgen restante para evitar baches en la grilla diaria.
        </p>
      </div>

      {/* Runway Cards for All Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              className={`rounded-xl border p-4 transition ${
                isCurrent
                  ? 'border-[#383d4a] bg-[#16181e]'
                  : 'border-[#1e2129] bg-[#13151a] hover:border-[#2c313d]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                    alt={ch.name}
                    className="h-8 w-8 rounded-lg object-cover border border-[#2a2e39] shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {ch.name}
                    </h3>
                    <span className="text-[11px] text-[#848d97]">
                      {ch.shortsPerDay} shorts/día
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-medium ${
                    isCritical
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isCritical ? (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span>Stock bajo</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      <span>Saludable</span>
                    </>
                  )}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1e2129] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-[#848d97] block">Stock virgen</span>
                  <div className="text-base font-bold text-white tabular-nums mt-0.5">{virginCount} clips</div>
                </div>

                <div>
                  <span className="text-[10px] text-[#848d97] block">Cobertura</span>
                  <div className={`text-base font-bold tabular-nums mt-0.5 ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {daysRemaining} días
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-3 pt-3 border-t border-[#1e2129] flex items-center justify-between">
                {isCurrent ? (
                  <span className="text-xs text-white font-medium">Canal en vista</span>
                ) : (
                  <button
                    onClick={() => setSelectedChannelId(ch.id)}
                    className="text-xs text-[#848d97] hover:text-white transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Seleccionar</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedChannelId(ch.id);
                    setContentTab('parrilla');
                  }}
                  className="px-2 py-0.5 rounded text-xs border border-[#262a34] bg-[#16181e] text-[#848d97] hover:text-white transition cursor-pointer"
                >
                  Parrilla
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};