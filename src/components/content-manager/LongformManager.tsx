'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Episode, Clip, Platform } from '../../types';
import {
  Film,
  ExternalLink,
  Clock,
  Eye,
  CheckCircle2,
  Copy,
  Layers,
  Image as ImageIcon,
  HardDrive,
  Play,
  Sparkles,
  Trophy,
  Smartphone,
  Zap,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const LongformManager: React.FC = () => {
  const { filteredEpisodes, episodes, clips, channels, showToast, triggerRippleShift } =
    useHolding();

  const episodesToDisplay = filteredEpisodes.length > 0 ? filteredEpisodes : episodes;

  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    episodesToDisplay[0] || episodes[0]
  );

  // Active thumbnail variant (A, B, or C)
  const [activeVariantKey, setActiveVariantKey] = useState<'A' | 'B' | 'C'>('A');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    showToast(`¡Copiado al portapapeles: ${label}!`);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Find channel for the selected episode
  const episodeChannel = channels.find((c) => c.id === selectedEpisode?.channelId);

  // Thumbnail variants fallback
  const variants = selectedEpisode?.thumbnailVariants || [
    {
      id: 'default-a',
      variantKey: 'A' as const,
      label: 'Variante A: Impacto Primario',
      url: selectedEpisode?.thumbnailUrl || '/channels/blackflag-banner.png',
      ctrPrediction: '10.2%',
      concept: 'Composición cinematográfica de alto contraste con gradiente oscuro y tipografía deportiva 3D.',
      isWinner: true,
    },
    {
      id: 'default-b',
      variantKey: 'B' as const,
      label: 'Variante B: Macro Zoom / Misterio',
      url: selectedEpisode?.thumbnailUrl || '/channels/blackflag-banner.png',
      ctrPrediction: '8.7%',
      concept: 'Enfoque cerrado sobre elemento de tensión central y saturación focalizada.',
    },
    {
      id: 'default-c',
      variantKey: 'C' as const,
      label: 'Variante C: Contraste Dual',
      url: selectedEpisode?.thumbnailUrl || '/channels/blackflag-banner.png',
      ctrPrediction: '7.8%',
      concept: 'División simétrica de dos mundos en pugna con paleta complementaria cyan/ámbar.',
    },
  ];

  const currentVariant =
    variants.find((v) => v.variantKey === activeVariantKey) || variants[0];

  // Derived 10 clips from this longform episode
  const derivedClips: Clip[] = clips
    .filter(
      (c) =>
        c.episodeId === selectedEpisode?.id ||
        (c.channelId === selectedEpisode?.channelId && !c.episodeId)
    )
    .slice(0, 10);

  const platforms: Platform[] = [
    'YOUTUBE_SHORT',
    'TIKTOK',
    'INSTAGRAM_REEL',
    'FACEBOOK_REEL',
    'X_TWITTER',
  ];

  return (
    <div className="space-y-6" data-testid="longform-manager">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BANNER: LONGFORM INDUSTRIAL SUITE              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#0e1015] border border-[#1e2129] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Film className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center space-x-2.5">
              <span>Catálogo Industrial de Videos Largos (16:9 Master)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                {episodesToDisplay.length} Masters
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Producciones de 15 a 30 minutos (1440p VP9 / 60 FPS) que nutren la doctrina Clip-First (10 nodos virales derivados por entrega).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono shrink-0">
          <div className="bg-[#14161d] px-3 py-2 rounded-xl border border-[#232732]">
            <span className="text-zinc-400">Total Vistas Largos: </span>
            <span className="font-bold text-white">
              {episodesToDisplay.reduce((acc, e) => acc + (e.totalViews || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="bg-[#14161d] px-3 py-2 rounded-xl border border-[#232732]">
            <span className="text-zinc-400">Clips Derivados 9:16: </span>
            <span className="font-bold text-emerald-400">
              {episodesToDisplay.reduce((acc, e) => acc + (e.clipsCount || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MAIN TWO-COLUMN WORKSPACE: CATALOG LIST & INSPECTOR        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: EPISODES CATALOG CARDS (5 COLS) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1 flex items-center justify-between">
            <span>Entregas Master ({episodesToDisplay.length})</span>
            <span className="text-[10px] font-mono text-zinc-400">16:9 NATIVO</span>
          </div>

          <div className="space-y-2.5">
            {episodesToDisplay.map((ep) => {
              const isSelected = selectedEpisode?.id === ep.id;
              const chan = channels.find((c) => c.id === ep.channelId);

              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setSelectedEpisode(ep);
                    setActiveVariantKey('A');
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#181b24] border-amber-500/60 shadow-xl shadow-amber-950/20'
                      : 'bg-[#12141a] border-[#20242f] hover:border-[#2f3545] hover:bg-[#151720]'
                  }`}
                >
                  <div className="flex space-x-3">
                    {/* 16:9 Thumbnail preview */}
                    <div className="relative w-28 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-[#262a34]">
                      <img
                        src={ep.thumbnailUrl || '/channels/blackflag-banner.png'}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-zinc-200">
                        {ep.duration}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
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

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-[#1e222d]">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-zinc-400" />
                          <span>{(ep.totalViews || 0).toLocaleString()}</span>
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

        {/* RIGHT COLUMN: INSPECTOR, 16:9 CINEMATIC STUDIO & A/B/C (8 COLS) */}
        {selectedEpisode && (
          <div className="lg:col-span-8 bg-[#12141a] border border-[#20242f] rounded-2xl p-5 shadow-2xl space-y-6">
            {/* Top Bar of Inspector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e222d]">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-mono font-bold"
                    style={{
                      backgroundColor: `${episodeChannel?.accentColor || '#f59e0b'}20`,
                      color: episodeChannel?.accentColor || '#f59e0b',
                    }}
                  >
                    {episodeChannel?.name || selectedEpisode.channelId}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono font-bold">
                    ID: {selectedEpisode.id}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Lanzamiento: {selectedEpisode.releaseDate}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1.5">{selectedEpisode.title}</h2>
              </div>

              {/* Action Buttons: Direct Drive & YouTube links */}
              <div className="flex items-center space-x-2 shrink-0">
                {selectedEpisode.youtubeUrl && (
                  <a
                    href={selectedEpisode.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold transition"
                    title="Abrir entrega en YouTube Oficial"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>YouTube Master</span>
                    <ExternalLink className="h-3 w-3 ml-0.5 text-red-400" />
                  </a>
                )}

                {selectedEpisode.driveUrl && (
                  <a
                    href={selectedEpisode.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-xs font-semibold transition"
                    title="Abrir carpeta Google Drive con Master 4K / 1440p"
                  >
                    <HardDrive className="h-3.5 w-3.5 text-sky-400" />
                    <span>Drive Master 4K</span>
                    <ExternalLink className="h-3 w-3 ml-0.5 text-sky-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Cinematic 16:9 Video Master Frame */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7 rounded-xl overflow-hidden border border-[#2a2f3d] bg-black aspect-video relative group shadow-2xl">
                <img
                  src={currentVariant.url || selectedEpisode.thumbnailUrl || '/channels/blackflag-banner.png'}
                  alt={selectedEpisode.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-between p-3.5">
                  <span className="text-xs font-mono font-bold text-white bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                    16:9 MASTER • {selectedEpisode.duration} • 1440p VP9 / 60 FPS
                  </span>
                  {selectedEpisode.youtubeUrl && (
                    <a
                      href={selectedEpisode.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition shadow-lg"
                    >
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="md:col-span-5 space-y-2 font-mono text-xs">
                <div className="bg-[#181b24] p-2.5 rounded-xl border border-[#242938]">
                  <div className="text-[10px] text-zinc-400 uppercase">Motor de Render</div>
                  <div className="text-white font-semibold mt-0.5 truncate">{selectedEpisode.renderEngine}</div>
                </div>
                <div className="bg-[#181b24] p-2.5 rounded-xl border border-[#242938]">
                  <div className="text-[10px] text-zinc-400 uppercase">Motor de Audio & Voz</div>
                  <div className="text-white font-semibold mt-0.5 truncate">{selectedEpisode.audioEngine}</div>
                </div>
                <div className="bg-[#181b24] p-2.5 rounded-xl border border-[#242938] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Estado del Guion</div>
                    <div className="text-emerald-400 font-bold mt-0.5 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{selectedEpisode.scriptStatus}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-400 uppercase">AVD Meta</div>
                    <div className="text-sky-400 font-bold mt-0.5">{selectedEpisode.avdPercent || 55}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────── */}
            {/* 3. A/B/C THUMBNAIL TESTING STUDIO (16:9 FORMAT)           */}
            {/* ───────────────────────────────────────────────────────── */}
            <div className="bg-[#181b24] p-4 sm:p-5 rounded-xl border border-[#262b3a] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Estudio de Miniaturas 16:9 (Variantes A/B/C en Producción)
                  </h3>
                </div>

                {/* Tabs A / B / C */}
                <div className="flex items-center p-0.5 rounded-lg bg-[#12141a] border border-[#232732]">
                  {variants.map((v) => (
                    <button
                      key={v.variantKey}
                      onClick={() => setActiveVariantKey(v.variantKey)}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                        activeVariantKey === v.variantKey
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {v.isWinner && <Trophy className="h-3 w-3 text-amber-400" />}
                      <span>Variante {v.variantKey}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">({v.ctrPrediction})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Variant Inspector Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#12141a] p-3.5 rounded-xl border border-[#20242f]">
                <div className="md:col-span-4 aspect-video rounded-lg overflow-hidden border border-[#2a2f3d] relative">
                  <img
                    src={currentVariant.url}
                    alt={currentVariant.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    CTR Est: {currentVariant.ctrPrediction}
                  </div>
                  {currentVariant.isWinner && (
                    <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center space-x-1">
                      <Trophy className="h-3 w-3 text-emerald-400" />
                      <span>Ganadora en Producción</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{currentVariant.label}</h4>
                    <span className="text-[10px] font-mono text-zinc-400">Safe Zones 16:9 YouTube Móvil OK</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {currentVariant.concept}
                  </p>
                  <div className="flex items-center space-x-2 pt-1 font-mono text-[11px]">
                    <button
                      onClick={() => handleCopy(selectedEpisode.title, 'Título CTR Optimizado')}
                      className="px-2.5 py-1 rounded-lg bg-[#181b24] hover:bg-[#202532] text-zinc-300 border border-[#282d3d] transition cursor-pointer flex items-center space-x-1"
                    >
                      <Copy className="h-3 w-3 text-zinc-400" />
                      <span>Copiar Título CTR</span>
                    </button>
                    {selectedEpisode.driveUrl && (
                      <button
                        onClick={() => handleCopy(selectedEpisode.driveUrl || '', 'URL Drive Master')}
                        className="px-2.5 py-1 rounded-lg bg-[#181b24] hover:bg-[#202532] text-zinc-300 border border-[#282d3d] transition cursor-pointer flex items-center space-x-1"
                      >
                        <HardDrive className="h-3 w-3 text-sky-400" />
                        <span>Copiar Enlace Drive</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────── */}
            {/* 4. DERIVED 10 VIRAL CLIPS MATRIX (CLIP-FIRST: 9:16)       */}
            {/* ───────────────────────────────────────────────────────── */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-sky-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Nodos Virales Derivados de esta Entrega (10 Clips 9:16)
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {derivedClips.length} Cortes Disponibles
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Cada uno de los 10 cortes cuenta con gancho sonoro/visual, subtítulos quemados dorados ASS y tracking espacial a 60 FPS sindicado en las 5 redes.
              </p>

              <div className="space-y-2.5">
                {derivedClips.map((clip) => {
                  const publishedCount = Object.values(clip.platforms).filter(
                    (p) => p.status === 'PUBLISHED'
                  ).length;

                  return (
                    <div
                      key={clip.id}
                      className="p-3.5 rounded-xl bg-[#161822] border border-[#242938] hover:border-[#32394e] transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      {/* Left: Mini Preview + Index + Hook */}
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-black shrink-0 border border-[#2b3040]">
                          <img
                            src={clip.file ? `/thumbnails/${clip.id}.jpg` : '/channels/blackflag-logo.png'}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/channels/blackflag-logo.png';
                            }}
                            alt={clip.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0.5 right-0.5 px-1 bg-black/90 font-mono text-[8px] text-white rounded">
                            {clip.durationSec}s
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800/40 font-bold">
                              CLIP #{clip.clipNumber}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {clip.timestamps.start} - {clip.timestamps.end}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold hidden sm:inline">
                              ASS Gold Subtitles (#FFD700)
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate mt-1">{clip.title}</h4>
                          <blockquote className="text-[11px] text-zinc-400 italic truncate mt-0.5 font-sans">
                            &ldquo;{clip.hook}&rdquo;
                          </blockquote>
                        </div>
                      </div>

                      {/* Right: Syndication across 5 platforms & Ripple Shift */}
                      <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
                        <div className="flex items-center space-x-1">
                          {platforms.map((plat) => {
                            const rec = clip.platforms[plat];
                            const isPub = rec?.status === 'PUBLISHED';
                            const isSched = rec?.status === 'SCHEDULED';

                            return (
                              <div
                                key={plat}
                                className={`h-6 w-6 rounded-md flex items-center justify-center border text-[9px] font-mono ${
                                  isPub
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                    : isSched
                                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                                    : 'bg-zinc-800/40 border-zinc-700/40 text-zinc-400'
                                }`}
                                title={`${plat}: ${rec?.status || 'PENDING'}`}
                              >
                                <PlatformIcon platform={plat} size={12} />
                              </div>
                            );
                          })}
                        </div>

                        <span className="text-xs font-mono font-bold text-zinc-300 px-1.5">
                          {publishedCount}/5
                        </span>

                        <button
                          onClick={() => {
                            triggerRippleShift(clip.id);
                            showToast(`¡Ripple Shift inyectado para ${clip.id}!`);
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-semibold transition cursor-pointer flex items-center space-x-1"
                          title="Inyectar como próximo turno urgente en parrilla"
                        >
                          <Zap className="h-3 w-3 text-amber-400" />
                          <span className="hidden sm:inline">Ripple Shift</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
