'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  SplitSquareVertical,
  Trophy,
  MousePointerClick,
  Eye,
  Percent,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ABTestingTracker: React.FC = () => {
  const { currentChannel, abVariants } = useHolding();

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
            CTR OPTIMIZATION (MOBILE FIRST)
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Test & Compare Tríada A/B/C • {currentChannel.name}
          </span>
        </div>
        <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          Laboratorio de Tríada de Packaging (A/B/C Testing) ({currentChannel.shortCode})
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Auditoría de tasa de clics (CTR) en YouTube Studio sobre títulos y miniaturas de alto contraste.
        </p>
      </div>

      {/* 3 Variants Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {abVariants.map((v, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C

          return (
            <div
              key={v.id}
              className={`rounded-2xl border p-5 backdrop-blur-sm transition relative overflow-hidden ${
                v.isWinner
                  ? 'border-amber-500/60 bg-amber-950/15 shadow-xl shadow-amber-500/10'
                  : 'border-zinc-800/80 bg-zinc-900/40'
              }`}
            >
              {v.isWinner && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-zinc-950 font-black text-[10px] px-3 py-1 rounded-bl-xl flex items-center space-x-1 shadow-md">
                  <Trophy className="h-3 w-3" />
                  <span>VARIANTE GANADORA (WINNER)</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-black text-amber-400 border border-zinc-700">
                  {letter}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {v.isWinner ? 'Desplegada en Producción' : 'Variante Retirada'}
                </span>
              </div>

              {/* Title under test */}
              <div className="mt-4">
                <div className="text-[10px] font-mono uppercase text-zinc-400">TÍTULO EVALUADO</div>
                <h3 className="mt-1 text-sm font-bold text-white line-clamp-2 leading-snug">
                  {v.title}
                </h3>
              </div>

              {/* Thumbnail Asset Mock */}
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 flex items-center space-x-3">
                <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                  16:9
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">ASSET MINIATURA</div>
                  <div className="text-xs font-mono text-zinc-300 truncate">{v.thumbnailName}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80">
                <div>
                  <div className="text-[10px] font-mono text-zinc-400">IMPRESIONES</div>
                  <div className="mt-0.5 text-xs font-bold text-white font-mono">
                    {v.impressions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-400">CLICS</div>
                  <div className="mt-0.5 text-xs font-bold text-white font-mono">
                    {v.clicks.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-400">CTR REAL</div>
                  <div
                    className={`mt-0.5 text-sm font-black font-mono ${
                      v.isWinner ? 'text-emerald-400' : 'text-zinc-300'
                    }`}
                  >
                    {v.ctr}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 flex items-start space-x-3.5">
        <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-200">
            Protocolo de Decisión de Tríada de Packaging:
          </p>
          <p>
            1. Cada variante corre un mínimo de 48 horas en YouTube Studio Test & Compare hasta alcanzar significancia estadística (&gt;95% de confianza).
          </p>
          <p>
            2. El thumbnail ganador se bloquea automáticamente como miniatura definitiva en VOD y nutre las carátulas secundarias de los 10 Shorts.
          </p>
        </div>
      </div>
    </div>
  );
};
