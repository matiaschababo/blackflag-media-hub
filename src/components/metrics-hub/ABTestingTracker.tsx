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
  Info,
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
          Preparación de los 3 títulos y miniaturas de alto contraste antes de iniciar el test en YouTube Studio.
        </p>
      </div>

      {/* 3 Variants Cards (In Preparation / 0 Fake Numbers) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {abVariants.map((v, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C

          return (
            <div
              key={v.id}
              className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5 backdrop-blur-sm transition relative overflow-hidden hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-black text-amber-400 border border-zinc-700">
                    {letter}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    Variante {letter}
                  </span>
                </div>
                <span className="studio-pill bg-zinc-950 text-amber-400/90 border border-amber-500/30 text-[9px]">
                  Lista para Test
                </span>
              </div>

              {/* Title under test */}
              <div className="mt-4">
                <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">TÍTULO PROPUESTO</div>
                <h3 className="mt-1 text-sm font-bold text-white line-clamp-2 leading-snug">
                  {v.title}
                </h3>
              </div>

              {/* Thumbnail Asset Mock */}
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 flex items-center space-x-3">
                <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 font-bold">
                  16:9
                </div>
                <div className="overflow-hidden">
                  <div className="text-[9px] font-mono uppercase text-zinc-500">ASSET MINIATURA</div>
                  <div className="text-xs font-mono text-zinc-300 truncate">{v.thumbnailName}</div>
                </div>
              </div>

              {/* Performance Metrics (Standby) */}
              <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80 font-mono text-center">
                <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <div className="text-[9px] text-zinc-500">IMPRESIONES</div>
                  <div className="mt-0.5 text-xs font-bold text-zinc-400">0</div>
                </div>
                <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <div className="text-[9px] text-zinc-500">CLICS</div>
                  <div className="mt-0.5 text-xs font-bold text-zinc-400">0</div>
                </div>
                <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <div className="text-[9px] text-zinc-500">CTR</div>
                  <div className="mt-0.5 text-xs font-bold text-zinc-400">-- %</div>
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
            1. Las 3 variantes correrán un mínimo de 48 horas en YouTube Studio Test & Compare una vez lanzado el video.
          </p>
          <p>
            2. El algoritmo de YouTube seleccionará la variante ganadora automáticamente según la mayor tasa de clics (CTR).
          </p>
        </div>
      </div>
    </div>
  );
};
