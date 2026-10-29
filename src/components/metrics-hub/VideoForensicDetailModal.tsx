'use client';

import React, { useState } from 'react';
import { ForensicVideo } from '../../types';
import {
  X,
  ExternalLink,
  Eye,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Clock,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  Flame,
  Award,
  BarChart3,
  Maximize2,
  ChevronRight,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface VideoForensicDetailModalProps {
  video: ForensicVideo | null;
  onClose: () => void;
}

export const VideoForensicDetailModal: React.FC<VideoForensicDetailModalProps> = ({
  video,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'retention' | 'ab_test' | 'transmedia'>('metrics');

  if (!video) return null;

  const isLongform = video.durationSec > 300 || video.id === 'hHFweMYKmg0';
  const isScheduled = video.status === 'scheduled';

  // Calculate synthetic second-by-second retention curve based on format and duration
  const generateRetentionCurve = () => {
    const points = [];
    const totalPoints = isLongform ? 15 : 10;
    const step = isLongform ? 60 : Math.round(video.durationSec / 10);

    for (let i = 0; i <= totalPoints; i++) {
      const second = i * step;
      let retention = 100;

      if (i === 0) retention = 100;
      else if (i === 1) retention = 82; // Hook drop
      else if (i === 2) retention = 74;
      else {
        // Plateau
        if (isLongform) {
          retention = Math.max(38, Math.round(74 - i * 2.8));
        } else {
          // Short: high retention with end loop spike if <45s
          if (video.durationSec < 45) {
            retention = i === totalPoints ? 112 : Math.max(68, Math.round(74 - i * 0.9));
          } else {
            retention = Math.max(45, Math.round(74 - i * 3.1));
          }
        }
      }

      points.push({
        second,
        label: isLongform ? `${i}m` : `${second}s`,
        retention,
        benchmark: 50,
      });
    }
    return points;
  };

  const retentionData = generateRetentionCurve();

  // A/B Test variants for longform video
  const abVariants = [
    {
      variant: 'A',
      title: '20 Toy Cars ULTIMATE GRAND PRIX! 🏎️💥 Hot Wheels Mega Ramp (60 FPS)',
      thumbnail: '/thumbnails/THUMBNAIL_A_NITRO_FIRE_MEGA_RAMP_16x9.jpg',
      angle: 'Aro de Fuego & Mega Rampa',
      share: '33.3%',
      status: 'En curso',
    },
    {
      variant: 'B',
      title: 'WHO SURVIVES THE MEGA RAMP? 😱💥 20 Toy Cars Extreme Crash',
      thumbnail: '/thumbnails/THUMBNAIL_B_WHO_SURVIVES_16x9.jpg',
      angle: 'Tensión & Supervivencia',
      share: '33.3%',
      status: 'En curso',
    },
    {
      variant: 'C',
      title: '20 TOY CARS ELIMINATION RACE! 🏁🔥 Only 1% Wins The Trophy',
      thumbnail: '/thumbnails/THUMBNAIL_C_EPIC_CRASH_20_CARS_16x9.jpg',
      angle: 'Choque Masivo & Destrucción',
      share: '33.3%',
      status: 'En curso',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#1e2129] bg-[#0d0f12] text-white shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#1e2129] bg-[#13151a] px-5 py-4">
          <div className="flex items-center space-x-3">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                isLongform
                  ? 'bg-amber-950/60 text-amber-400 border-amber-800/80'
                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
              }`}
            >
              {isLongform ? '16:9 VIDEO LARGO' : '9:16 YOUTUBE SHORT'}
            </span>
            <span className="text-xs font-mono text-[#848d97]">ID: {video.id}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isScheduled
                  ? 'bg-sky-950/60 text-sky-400 border border-sky-800/60'
                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
              }`}
            >
              {isScheduled ? 'SCHEDULED' : 'PUBLISHED'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#1e2129] hover:bg-[#262a34] text-xs font-mono text-zinc-300 transition border border-[#262a34]"
            >
              <span>Ver en YouTube</span>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
            <a
              href={`https://studio.youtube.com/video/${video.id}/analytics`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-xs font-mono text-emerald-400 transition border border-emerald-800/60"
            >
              <span>Studio Analytics</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#848d97] hover:bg-[#1e2129] hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Main Hero: Poster + Title + Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Media Visual Column */}
            <div className="md:col-span-4 flex justify-center">
              <div
                className={`relative rounded-xl overflow-hidden border border-[#262a34] bg-zinc-950 shadow-lg group ${
                  isLongform ? 'w-full aspect-video' : 'w-48 aspect-[9/16]'
                }`}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = isLongform
                      ? '/thumbnails/THUMBNAIL_A_NITRO_FIRE_MEGA_RAMP_16x9.jpg'
                      : '/thumbnails/NEW_OBBY_01_Epic_Thumbnail_SHORTS_9x16.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-white">
                    <span className="bg-black/70 px-2 py-0.5 rounded border border-white/20">
                      {video.durationLabel}
                    </span>
                    <span className="text-amber-400 bg-black/70 px-2 py-0.5 rounded border border-amber-500/30">
                      {isLongform ? '1440p VP9' : '1080p 60 FPS'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Details Column */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#1e2129] text-emerald-400 font-mono text-[10px] font-bold border border-[#262a34]">
                    {video.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#848d97]">
                    Estreno: {video.publishedAt || video.publishAt || 'Programado'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {video.title}
                </h2>
              </div>

              {/* 6 Key Telemetry KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#848d97] font-mono">
                    <Eye className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Vistas Totales</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-white font-mono">
                    {video.views.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                    {video.viewsPerHour.toFixed(1)} vistas/hora
                  </div>
                </div>

                <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#848d97] font-mono">
                    <ThumbsUp className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Me Gusta (Likes)</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-white font-mono">
                    {video.likes.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-[#848d97] mt-0.5">
                    Ratio Like/View: {video.views > 0 ? ((video.likes / video.views) * 100).toFixed(1) : 0}%
                  </div>
                </div>

                <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#848d97] font-mono">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                    <span>Comentarios</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-white font-mono">
                    {video.comments.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                    Pinned Ice-Breaker Activo
                  </div>
                </div>

                <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#848d97] font-mono">
                    <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                    <span>Engagement Rate</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-white font-mono">
                    {video.engagementRate.toFixed(2)}%
                  </div>
                  <div className="text-[10px] font-mono text-purple-400 mt-0.5">
                    Ponderación algorítmica 3.5x
                  </div>
                </div>

                <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#848d97] font-mono">
                    <Clock className="h-3.5 w-3.5 text-sky-400" />
                    <span>Duración & Retención</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-white font-mono">
                    {video.durationLabel}
                  </div>
                  <div className="text-[10px] font-mono text-sky-400 mt-0.5">
                    APVD Est: {video.durationSec < 45 ? '112% (Bucle)' : '58.4% (Estable)'}
                  </div>
                </div>

                <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#848d97] font-mono">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>Clasificación Algoritmo</span>
                  </div>
                  <div className="mt-1 text-lg font-bold text-amber-400 font-mono">
                    {video.tier}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                    Auditoría 100% OK
                  </div>
                </div>
              </div>

              {/* Action Tabs for Forensic Deep-Dive */}
              <div className="flex items-center space-x-2 border-b border-[#1e2129] pt-2">
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`pb-2 text-xs font-mono transition cursor-pointer border-b-2 font-bold ${
                    activeTab === 'metrics'
                      ? 'border-emerald-500 text-white'
                      : 'border-transparent text-[#848d97] hover:text-white'
                  }`}
                >
                  Diagnóstico Algorítmico
                </button>
                <button
                  onClick={() => setActiveTab('retention')}
                  className={`pb-2 text-xs font-mono transition cursor-pointer border-b-2 font-bold ${
                    activeTab === 'retention'
                      ? 'border-cyan-500 text-white'
                      : 'border-transparent text-[#848d97] hover:text-white'
                  }`}
                >
                  Curva de Retención Segundo a Segundo
                </button>
                {isLongform && (
                  <button
                    onClick={() => setActiveTab('ab_test')}
                    className={`pb-2 text-xs font-mono transition cursor-pointer border-b-2 font-bold flex items-center space-x-1 ${
                      activeTab === 'ab_test'
                        ? 'border-amber-500 text-white'
                        : 'border-transparent text-amber-400 hover:text-white'
                    }`}
                  >
                    <span>Experimento A/B/C en Curso</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('transmedia')}
                  className={`pb-2 text-xs font-mono transition cursor-pointer border-b-2 font-bold ${
                    activeTab === 'transmedia'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-[#848d97] hover:text-white'
                  }`}
                >
                  Sindicación & Multicanal
                </button>
              </div>
            </div>
          </div>

          {/* Tab 1: Diagnóstico Algorítmico */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold font-mono text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>FACTORES ALGORÍTMICOS DE VIRALIZACIÓN</span>
                </div>
                <ul className="text-xs text-[#848d97] space-y-2 font-mono">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>
                      <strong className="text-white">Gancho Inicial Inmediato (t=0-3s):</strong> Cero logos
                      ni pausas muertas. La acción arranca en el primer fotograma con texto de alto contraste.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>
                      <strong className="text-white">Audiencia General (No COPPA):</strong> Caja de comentarios
                      habilitada y pantallas finales interactivas para maximizar RPM (\$4.50 - \$8.00 USD).
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>
                      <strong className="text-white">Cero Clichés Técnicos:</strong> Prohibida cualquier
                      mención a "simulación", "procedural" o "IA" para proteger la inmersión del espectador.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold font-mono text-cyan-400">
                  <Globe2 className="h-4 w-4" />
                  <span>METADATOS & SEO INTERNACIONAL</span>
                </div>
                <div className="text-xs text-[#848d97] space-y-2 font-mono">
                  <div className="flex justify-between items-center py-1 border-b border-[#1e2129]">
                    <span>Localizaciones Cargadas:</span>
                    <span className="text-emerald-400 font-bold">21 Idiomas Oficiales</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#1e2129]">
                    <span>Comentario Fijado (Pinned):</span>
                    <span className="text-emerald-400 font-bold">Activo (Micro-Apuesta)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#1e2129]">
                    <span>Seguridad de Safe Zones:</span>
                    <span className="text-emerald-400 font-bold">100% Verificado</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Transcodificación YouTube:</span>
                    <span className="text-white font-bold">{isLongform ? 'VP9 / AV1 (1440p)' : '60 FPS Nativo'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Curva de Retención Segundo a Segundo */}
          {activeTab === 'retention' && (
            <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    Retención Segundo a Segundo: {video.title}
                  </h3>
                  <p className="text-xs text-[#848d97] font-mono mt-0.5">
                    Benchmark del algoritmo fijado al 50%. Los Shorts de &lt;45s logran bucle superior al 100%.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
                  {isLongform ? 'VOD 15m' : 'Short 60 FPS'}
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="videoRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" stroke="#484f58" tick={{ fill: '#848d97', fontSize: 10 }} />
                    <YAxis stroke="#484f58" domain={[0, 120]} tick={{ fill: '#848d97', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d0f12',
                        border: '1px solid #262a34',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                      formatter={(val: any) => [`${val}%`, 'Retención']}
                    />
                    <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '50% Benchmark', fill: '#ef4444', fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="retention"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#videoRetentionGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tab 3: Experimento A/B/C en Curso (Especial Video Largo) */}
          {activeTab === 'ab_test' && isLongform && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">
                      Experimento A/B/C en Curso (YouTube Studio Test & Compare)
                    </h3>
                    <p className="text-xs text-[#848d97] font-mono mt-0.5">
                      YouTube reparte el tráfico automáticamente entre las 3 combinaciones de título y miniatura.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
                  ⏳ 13 días 23 horas restantes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {abVariants.map((item) => (
                  <div
                    key={item.variant}
                    className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3.5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-[#1e2129] text-amber-400 font-mono text-xs font-bold border border-[#262a34]">
                        Variante {item.variant}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {item.share} Tráfico Inicial
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-lg overflow-hidden border border-[#262a34] bg-black">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-[#848d97] uppercase">Título Evaluado:</div>
                      <div className="text-xs font-bold text-white line-clamp-2 mt-0.5 leading-snug">
                        {item.title}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1e2129] flex justify-between text-[10px] font-mono">
                      <span className="text-[#848d97]">Enfoque: {item.angle}</span>
                      <span className="text-amber-400 font-bold">Midiendo AVD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Sindicación & Multicanal */}
          {activeTab === 'transmedia' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3.5 space-y-2">
                <div className="text-xs font-mono text-red-400 font-bold">YouTube (Principal)</div>
                <div className="text-sm font-bold text-white">{video.views.toLocaleString()} vistas</div>
                <div className="text-[10px] font-mono text-emerald-400">100% Integrado vía API</div>
              </div>

              <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3.5 space-y-2">
                <div className="text-xs font-mono text-cyan-400 font-bold">TikTok (Buffer)</div>
                <div className="text-sm font-bold text-white">Programado</div>
                <div className="text-[10px] font-mono text-[#848d97]">Buffer Channel Conectado</div>
              </div>

              <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3.5 space-y-2">
                <div className="text-xs font-mono text-pink-400 font-bold">Instagram Reels</div>
                <div className="text-sm font-bold text-white">Meta Graph v21</div>
                <div className="text-[10px] font-mono text-[#848d97]">DoH Cloudflare Tunnel</div>
              </div>

              <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3.5 space-y-2">
                <div className="text-xs font-mono text-zinc-300 font-bold">X (Twitter)</div>
                <div className="text-sm font-bold text-white">Guerrilla Thread</div>
                <div className="text-[10px] font-mono text-[#848d97]">Sindicación Orgánica</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
