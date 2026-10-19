'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import { AB_VARIANTS } from '../../data/mockData';
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
            CTR OPTIMIZATION (MOBILE FIRST)
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Test & Compare Tríada A/B/C
          </span>
        </div>
        <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          Laboratorio de Tríada de Packaging (A/B/C Testing)
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Auditoría de tasa de clics (CTR) en YouTube Studio sobre títulos y miniaturas de alto contraste.
        </p>
      </div>

      {/* 3 Variants Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {AB_VARIANTS.map((v, idx) => {
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
                  <span>GANADOR OFICIAL</span>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-black font-mono text-white border border-zinc-700">
                  {letter}
                </span>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
                  VARIANTE {letter}
                </span>
              </div>

              {/* Simulated thumbnail */}
              <div className="aspect-video rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-center p-3 text-zinc-500 font-mono text-xs mb-4">
                🖼️ {v.thumbnailName}
              </div>

              <h3 className="text-sm font-bold text-white leading-snug min-h-[40px]">
                {v.title}
              </h3>

              <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-zinc-950/80 p-2 border border-zinc-800/60">
                  <div className="text-[9px] uppercase font-mono text-zinc-400">IMPRESIONES</div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {v.impressions.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-lg bg-zinc-950/80 p-2 border border-zinc-800/60">
                  <div className="text-[9px] uppercase font-mono text-zinc-400">CLICS</div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {v.clicks.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-lg bg-zinc-950/80 p-2 border border-zinc-800/60">
                  <div className="text-[9px] uppercase font-mono text-zinc-400">CTR %</div>
                  <div
                    className={`text-xs font-black mt-0.5 ${
                      v.isWinner ? 'text-amber-400 text-sm' : 'text-zinc-300'
                    }`}
                  >
                    {v.ctr}%
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
                <span>Estado: {v.isWinner ? 'Al aire' : 'Archivado'}</span>
                {v.isWinner && <span className="text-emerald-400 font-bold">+29% vs Variante B</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Packaging Golden Rules */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm space-y-3">
        <div className="flex items-center space-x-2 text-amber-400">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
            Doctrina de Empaque de Alto CTR para Móviles (2026)
          </h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Más del 75% del tráfico de YouTube se consume en pantallas móviles pequeñas. Todo empaque debe cumplir tres reglas inquebrantables:
        </p>
        <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-5 font-mono">
          <li><strong>Regla de los 3 Elementos:</strong> Máximo un sujeto principal, un fondo de contraste extremo y un texto de 3 palabras clave.</li>
          <li><strong>Safe Zone de Tiempo:</strong> Prohibido colocar texto o rostros en la esquina inferior derecha (tapada por el timer de YouTube).</li>
          <li><strong>Curiosidad Asimétrica:</strong> El título plantea la pregunta y la miniatura muestra el contexto sin responderla, obligando al clic.</li>
        </ul>
      </div>
    </div>
  );
};
