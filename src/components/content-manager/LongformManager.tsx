'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Episode } from '../../types';
import {
  Film,
  ExternalLink,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  Layers,
  Image as ImageIcon,
  FolderDown,
  Play,
  Share2,
} from 'lucide-react';

export const LongformManager: React.FC = () => {
  const { filteredEpisodes, episodes, currentChannel, selectedChannelId, channels, showToast } =
    useHolding();

  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    filteredEpisodes[0] || episodes[0]
  );
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    showToast(`¡Copiado: ${label}!`);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const episodesToDisplay = filteredEpisodes.length > 0 ? filteredEpisodes : episodes;

  return (
    <div className="space-y-6" data-testid="longform-manager">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HEADER BANNER: LONGFORM SUITE & INVENTORY SUMMARY          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#12141a] border border-[#20242f] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Film className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Catálogo Industrial de Videos Largos (16:9 Master)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {episodesToDisplay.length} Entregas
                </span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Producciones de 15 a 30 minutos (1440p VP9 / 60 FPS) de las que derivan los 10 nodos virales para Shorts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-[#181b24] px-3 py-2 rounded-xl border border-[#242938]">
            <span className="text-zinc-400">Total Vistas Largos: </span>
            <span className="font-bold text-white">
              {episodesToDisplay.reduce((acc, e) => acc + (e.totalViews || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="bg-[#181b24] px-3 py-2 rounded-xl border border-[#242938]">
            <span className="text-zinc-400">Clips Derivados: </span>
            <span className="font-bold text-emerald-400">
              {episodesToDisplay.reduce((acc, e) => acc + (e.clipsCount || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MAIN TWO-COLUMN WORKSPACE: EPISODES LIST & DETAIL STUDIO   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: EPISODES CATALOG CARDS (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1">
            Entregas Master ({episodesToDisplay.length})
          </div>

          <div className="space-y-3">
            {episodesToDisplay.map((ep) => {
              const isSelected = selectedEpisode?.id === ep.id;
              const chan = channels.find((c) => c.id === ep.channelId);

              return (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEpisode(ep)}
                  className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#181b24] border-amber-500/50 shadow-xl shadow-amber-950/20'
                      : 'bg-[#12141a] border-[#20242f] hover:border-[#2f3545] hover:bg-[#151720]'
                  }`}
                >
                  <div className="flex space-x-3.5">
                    {/* Thumbnail preview */}
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-[#2a2e39]">
                      <img
                        src={ep.thumbnailUrl || '/channels/blackflag-banner.png'}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-zinc-200">
                        {ep.duration}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold"
                            style={{
                              backgroundColor: `${chan?.accentColor || '#888'}20`,
                              color: chan?.accentColor || '#888',
                            }}
                          >
                            {chan?.shortCode || ep.channelId}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            EP #{ep.episodeNumber}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-white truncate mt-1">{ep.title}</h3>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-[#1e222d]">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-zinc-400" />
                          <span>{(ep.totalViews || 0).toLocaleString()} vistas</span>
                        </span>
                        <span className="text-emerald-400 font-semibold">{ep.clipsCount} clips 9:16</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: INSPECTOR & PACKAGING STUDIO (7 COLS) */}
        {selectedEpisode && (
          <div className="lg:col-span-7 bg-[#12141a] border border-[#20242f] rounded-2xl p-5 shadow-2xl space-y-6">
            {/* Top Bar of Inspector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e222d]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                    ID: {selectedEpisode.id}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Lanzamiento: {selectedEpisode.releaseDate}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1.5">{selectedEpisode.title}</h2>
              </div>

              {selectedEpisode.youtubeUrl && (
                <a
                  href={selectedEpisode.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold transition shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Ver en YouTube</span>
                </a>
              )}
            </div>

            {/* Cinematic Preview & Key Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-[#2a2f3d] bg-black aspect-video relative group">
                <img
                  src={selectedEpisode.thumbnailUrl || '/channels/blackflag-banner.png'}
                  alt={selectedEpisode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                    16:9 • {selectedEpisode.duration} • 1440p VP9
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="bg-[#181b24] p-3 rounded-xl border border-[#242938]">
                  <div className="text-[10px] text-zinc-400 uppercase">Motor de Render</div>
                  <div className="text-white font-semibold mt-0.5">{selectedEpisode.renderEngine}</div>
                </div>
                <div className="bg-[#181b24] p-3 rounded-xl border border-[#242938]">
                  <div className="text-[10px] text-zinc-400 uppercase">Motor de Audio & Voz</div>
                  <div className="text-white font-semibold mt-0.5">{selectedEpisode.audioEngine}</div>
                </div>
                <div className="bg-[#181b24] p-3 rounded-xl border border-[#242938]">
                  <div className="text-[10px] text-zinc-400 uppercase">Estado del Guion</div>
                  <div className="text-emerald-400 font-bold mt-0.5 flex items-center space-x-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{selectedEpisode.scriptStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Packaging & Designer Directives */}
            <div className="bg-[#181b24] p-4 rounded-xl border border-[#262b3a] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-amber-400" />
                  <span>Flujo de Miniatura 16:9 & Directivas para el Diseñador</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  {selectedEpisode.thumbnailStatus || 'UPLOADED'}
                </span>
              </div>

              <div className="text-xs text-zinc-300 bg-[#12141a] p-3 rounded-lg border border-[#1f2330] leading-relaxed">
                <p className="font-semibold text-amber-300 mb-1">
                  Texto Gancho Miniatura: &quot;{selectedEpisode.title}&quot;
                </p>
                <p className="text-zinc-400">
                  Composición: Formato 16:9, arte hiper-contrastado, tipografía deportiva 3D con doble trazo y gradiente dual. Respetar safe zones de YouTube móvil (esquina inferior derecha reservada para el segundero).
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => handleCopy(selectedEpisode.title, 'Título CTR')}
                  className="px-3 py-1.5 rounded-lg bg-[#202532] hover:bg-[#282f40] text-xs font-medium text-zinc-300 border border-[#2c3345] transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Copiar Título CTR</span>
                </button>
                <button
                  onClick={() =>
                    handleCopy(
                      `https://youtube.com/watch?v=${selectedEpisode.id}`,
                      'URL del Video'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#202532] hover:bg-[#282f40] text-xs font-medium text-zinc-300 border border-[#2c3345] transition cursor-pointer flex items-center space-x-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Copiar Enlace Oficial</span>
                </button>
              </div>
            </div>

            {/* Derived 10 Clips Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-sky-400" />
                  <span>Nodos Virales Derivados (Doctrina Clip-First: 9:16)</span>
                </h4>
                <span className="text-xs font-mono text-zinc-400">
                  {selectedEpisode.clipsCount} Cortes Derivados
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cada uno de los 10 cortes de este episodio largo cuenta con su propio hook visual, subtítulos quemados dorados ASS y tracking espacial a 60 FPS mediante coordinates.json para Corte Studio.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
