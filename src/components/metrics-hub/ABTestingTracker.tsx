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
  const isLevelPop = currentChannel.id === 'levelpop';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              {isLevelPop ? '🔴 TEST & COMPARE ACTIVO' : 'CTR OPTIMIZATION'}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Test &amp; Compare Tríada A/B/C • {currentChannel.name}
            </span>
          </div>
          {isLevelPop && (
            <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-400 border border-amber-800 text-xs font-mono font-bold animate-pulse">
              ⏳ 13 días 23 horas restantes
            </span>
          )}
        </div>
        <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
          {isLevelPop
            ? 'Experimento A/B/C en Curso en YouTube Studio'
            : `Laboratorio de Tríada de Packaging (A/B/C Testing) (${currentChannel.shortCode})`}
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          {isLevelPop
            ? 'YouTube Studio está repartiendo el tráfico equitativamente entre las 3 combinaciones de título y miniatura para determinar el ganador por tiempo de reproducción.'
            : 'Preparación de los 3 títulos y miniaturas de alto contraste antes de iniciar el test en YouTube Studio.'}
        </p>
      </div>

      {/* 3 Variants Cards */}
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
                  {isLevelPop ? 'En Curso (33.3%)' : 'Lista para Test'}
                </span>
              </div>

              {/* Title under test */}
              <div className="mt-4">
                <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">TÍTULO EN COMPETENCIA</div>
                <h3 className="mt-1 text-sm font-bold text-white line-clamp-2 leading-snug">
                  {v.title}
                </h3>
              </div>

              {/* Thumbnail Real Preview */}
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-2 overflow-hidden">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                  <img
                    src={`/thumbnails/${v.thumbnailName}`}
                    alt={v.title}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="mt-2 px-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="truncate max-w-[180px]">{v.thumbnailName}</span>
                  <span className="text-emerald-400 font-bold">1920x1080</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80 font-mono text-center">
                <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <div className="text-[9px] text-zinc-500">TRÁFICO</div>
                  <div className="mt-0.5 text-xs font-bold text-emerald-400">{isLevelPop ? '33.3%' : '0'}</div>
                </div>
                <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <div className="text-[9px] text-zinc-500">TIEMPO VIS.</div>
                  <div className="mt-0.5 text-xs font-bold text-amber-400">{isLevelPop ? 'Midiendo' : '0'}</div>
                </div>
                <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <div className="text-[9px] text-zinc-500">ESTADO</div>
                  <div className="mt-0.5 text-xs font-bold text-zinc-400">{isLevelPop ? 'Activo' : '--'}</div>
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
