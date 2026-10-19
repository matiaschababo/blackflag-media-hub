'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Film,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Tv,
} from 'lucide-react';

export const ContentOverview: React.FC = () => {
  const { currentChannel, filteredClips, episodes, setContentTab, setMode } = useHolding();
  const channelEpisodes = episodes.filter((e) => e.channelId === currentChannel.id);

  const publishedClips = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
  );
  const scheduledClips = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'SCHEDULED')
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Channel Hero */}
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-zinc-950 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span
              className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              {currentChannel.name} • CABINA DE CONTROL
            </span>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              Motor de Contenido & Sindicación Activa
            </h2>
            <p className="mt-1 text-xs text-zinc-400 max-w-xl">
              Nicho: <span className="text-zinc-200 font-semibold">{currentChannel.niche}</span>. Audiencia objetivo: <span className="text-zinc-200 font-semibold">{currentChannel.audience}</span>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setContentTab('clips_matrix')}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-zinc-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
            >
              <Layers className="h-4 w-4" />
              <span>Abrir 10 Clips</span>
            </button>
            <button
              onClick={() => setMode('metrics_hub')}
              className="flex items-center space-x-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
            >
              <span>Ver Métricas</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Tiles */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
            <div className="text-[10px] font-mono uppercase text-zinc-400">EPISODIOS PRODUCIDOS</div>
            <div className="mt-1 text-2xl font-black text-white">{channelEpisodes.length}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Formato 1440p VP9</div>
          </div>

          <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
            <div className="text-[10px] font-mono uppercase text-zinc-400">CLIPS EN STOCK</div>
            <div className="mt-1 text-2xl font-black text-amber-400">{filteredClips.length}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Estándar Corte Studio</div>
          </div>

          <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
            <div className="text-[10px] font-mono uppercase text-zinc-400">CLIPS PUBLICADOS</div>
            <div className="mt-1 text-2xl font-black text-emerald-400">{publishedClips.length}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">En las 5 plataformas</div>
          </div>

          <div className="rounded-xl bg-zinc-950/70 p-4 border border-zinc-800/60">
            <div className="text-[10px] font-mono uppercase text-zinc-400">PROGRAMADOS A FUTURO</div>
            <div className="mt-1 text-2xl font-black text-sky-400">{scheduledClips.length}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Grilla 24/7 en cola</div>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          onClick={() => setContentTab('clips_matrix')}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Layers className="h-5 w-5" />
            </span>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            Matriz de 10 Nodos Virales (Corte Studio)
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Control de los 10 clips del episodio con timestamps, hooks en segundo 0:03, subtítulos dinámicos de marca y semáforos de subida.
          </p>
        </div>

        <div
          onClick={() => setContentTab('parrilla')}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Calendar className="h-5 w-5" />
            </span>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-sky-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            Parrilla de Sindicación Multi-Plataforma
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Monitoreo en vivo de los turnos programados en YouTube Shorts, Instagram Reels, Facebook Reels, TikTok y X con sus links confirmados.
          </p>
        </div>
      </div>
    </div>
  );
};
