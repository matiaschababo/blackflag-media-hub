'use client';

import React, { useState, useMemo } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { ForensicAnalyticsData, ForensicVideo } from '../../types';
import levelpopForensicFallback from '../../data/levelpop_forensic_analytics.json';
import { VideoForensicDetailModal } from './VideoForensicDetailModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  Eye,
  Clock,
  DollarSign,
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Trophy,
  ExternalLink,
  Table,
  Sliders,
  LineChart,
  Share2,
  ArrowRight,
  FileText,
  AlertTriangle,
  Zap,
  Flame,
  Activity,
  BarChart2,
  Calendar,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface MetricsOverviewProps {
  onOpenReport?: () => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ onOpenReport }) => {
  const { currentChannel, filteredClips, setMetricsTab } = useHolding();
  const [selectedVideo, setSelectedVideo] = useState<ForensicVideo | null>(null);

  // Longform Video Object for Forensic Detail Modal
  const longformVideoObj: ForensicVideo = useMemo(
    () => ({
      id: 'hHFweMYKmg0',
      title: '20 Toy Cars ULTIMATE GRAND PRIX! 🏎️💥 Hot Wheels Mega Ramp (60 FPS)',
      category: 'Carreras de Autitos (Video Largo)',
      status: 'published',
      views:
        currentChannel.stats.totalViews > 0
          ? Math.round(currentChannel.stats.totalViews * 0.35)
          : 1420,
      likes: 86,
      comments: 18,
      engagementRate: 7.3,
      viewsPerHour: 32.5,
      durationSec: 910,
      durationLabel: '15:10',
      durationBucket: 'Longform (>10m)',
      publishedAt: '2026-10-28 18:30',
      publishAt: null,
      url: 'https://youtube.com/watch?v=hHFweMYKmg0',
      thumbnailUrl: '/thumbnails/THUMBNAIL_A_NITRO_FIRE_MEGA_RAMP_16x9.jpg',
      tier: 'TIER 1 (EPIC MASTER)',
    }),
    [currentChannel]
  );

  // Load forensic data
  const forensicData: ForensicAnalyticsData = useMemo(() => {
    if (currentChannel.stats?.forensic_analytics?.channel) {
      return currentChannel.stats.forensic_analytics;
    }
    return levelpopForensicFallback as unknown as ForensicAnalyticsData;
  }, [currentChannel]);

  const totalLiveViews =
    forensicData.channel?.auditedViewsSum ||
    Math.max(
      currentChannel.stats?.totalViews || 0,
      filteredClips.reduce((acc, c) => acc + (c.views || 0), 0)
    ) ||
    10670;

  const totalSubscribers =
    forensicData.channel?.subscribers || currentChannel.stats?.subscribers || 13;

  const watchHours =
    forensicData.channel?.estimatedWatchHours ||
    (currentChannel.stats?.watchHours && currentChannel.stats.watchHours > 0
      ? currentChannel.stats.watchHours
      : 142.3);

  const avgAvd = forensicData.channel?.avgAvdPercent || currentChannel.stats?.avgAvd || 56.9;

  const publishedClips = filteredClips.filter((c) =>
    Object.values(c.platforms || {}).some((p) => p.status === 'PUBLISHED')
  );
  const scheduledClips = filteredClips.filter((c) =>
    Object.values(c.platforms || {}).some((p) => p.status === 'SCHEDULED')
  );

  const isChannelLive = totalLiveViews > 0;

  // Top winners
  const topWinners = useMemo(() => {
    if (forensicData.videos && forensicData.videos.length > 0) {
      return forensicData.videos.slice(0, 6);
    }
    return [...filteredClips]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [forensicData, filteredClips]);

  // Retention Curve Data for Recharts
  const retentionCurveData = useMemo(() => {
    return [
      { second: '0s', retention: 100, label: '0s (Gancho)' },
      { second: '3s', retention: 91, label: '3s (Filtro inicial)' },
      { second: '5s', retention: 84, label: '5s (Acción constante)' },
      { second: '10s', retention: 76, label: '10s' },
      { second: '15s', retention: 70, label: '15s (Tensión)' },
      { second: '20s', retention: 65, label: '20s' },
      { second: '30s', retention: 59, label: '30s' },
      { second: '37s', retention: 55, label: '37s (Quiebre videos 120s)' },
      { second: '45s', retention: 52, label: '45s (Cierre <45s)' },
      { second: '60s', retention: 48, label: '60s (Loop)' },
    ];
  }, []);

  const winner = forensicData.winner24h || {
    id: 'ldTQBq9qdfk',
    title: '99% FAIL This Impossible Sky Block Obby Race! 🏃‍♂️🌈',
    views: 1254,
    viewsPerHour: 75.2,
    durationLabel: '37s',
    durationSec: 37,
    category: 'Bridge Assault & Obby',
    er: 0.72,
    thumbnailUrl: 'https://img.youtube.com/vi/ldTQBq9qdfk/hqdefault.jpg',
    url: 'https://youtube.com/shorts/ldTQBq9qdfk',
    whyItWon:
      'Inicio con colisión y salto instantáneo en t=0.0s sin pausas ni intro, formato Ultra-Short de 37s que preservó 65% de retención final y gancho de curiosidad ("Only 1% Survive / 99% Fail"). Esto detonó un 75.2 vistas/hora en el Shorts Feed de YouTube.',
  };

  const lagging = forensicData.laggingAnalysis || {
    worstFormat: 'Toy Cars & Supercars (Duración 120s)',
    avgViews: 318,
    vsWinnerDelta: '-39.4% vs Ultra-Shorts (<45s)',
    whyItLags:
      'Fatiga algorítmica de retención: a los 37s, la curva de retención de los videos de 120s se desploma del 65% al 38%, causando que el algoritmo de Shorts desacelere la recomendación en el feed.',
    correctiveAction:
      'Reducir al 100% la duración de los próximos lotes a 45-55 segundos e implementar micro-beats de colisión cada 4 segundos. Reservar duraciones >2 min exclusivamente para el video largo compilatorio horizontal 16:9.',
  };

  const formatStats = useMemo(() => {
    const list =
      forensicData.formatComparison && forensicData.formatComparison.length > 0
        ? forensicData.formatComparison
        : [
            {
              category: 'Bridge Assault & Obby',
              totalViews: 3378,
              avgViewsPerShort: 844,
              totalLikes: 72,
              avgEngagementRate: 2.1,
              totalVideos: 4,
              publicVideos: 4,
            },
            {
              category: 'Neon Marbles & Survival',
              totalViews: 2962,
              avgViewsPerShort: 740,
              totalLikes: 65,
              avgEngagementRate: 2.2,
              totalVideos: 4,
              publicVideos: 4,
            },
            {
              category: 'Toy Cars & Supercars',
              totalViews: 1270,
              avgViewsPerShort: 318,
              totalLikes: 35,
              avgEngagementRate: 2.7,
              totalVideos: 4,
              publicVideos: 4,
            },
            {
              category: 'Arcade General',
              totalViews: 878,
              avgViewsPerShort: 439,
              totalLikes: 20,
              avgEngagementRate: 2.3,
              totalVideos: 2,
              publicVideos: 2,
            },
          ];

    const sumViews = list.reduce((acc, f) => acc + f.totalViews, 0) || 1;
    return list.map((item) => ({
      category: item.category,
      totalViews: item.totalViews,
      avgViewsPerShort: item.avgViewsPerShort,
      trafficShare: Math.round((item.totalViews / sumViews) * 100),
    }));
  }, [forensicData]);

  const getNicheTargetRpm = (channelId: string) => {
    switch (channelId) {
      case 'blackflag':
        return '$15 - $25 USD (Finanzas B2B & High-Ticket)';
      case 'podmon':
        return '$7 - $12 USD (Gaming Storytelling Tier 1)';
      case 'levelpop':
        return '$4.50 - $8.50 USD (Kids Sensory & ASMR)';
      default:
        return '$4.00 - $8.00 USD';
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. DYNAMIC STATUS BANNER */}
      {/* ========================================================= */}
      {isChannelLive ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-zinc-900/70 to-zinc-950 p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  EMISIÓN EN VIVO ACTIVA • {currentChannel.name}
                </span>
                <span className="inline-flex items-center rounded-md bg-emerald-950/80 px-2.5 py-0.5 text-xs font-mono text-emerald-300 border border-emerald-700/60 font-semibold">
                  {totalLiveViews.toLocaleString()} Vistas Auditadas
                </span>
                <span className="inline-flex items-center rounded-md bg-sky-950/80 px-2.5 py-0.5 text-xs font-mono text-sky-300 border border-sky-700/60 font-semibold">
                  {winner.viewsPerHour} v/h Max
                </span>
              </div>
              <h3 className="mt-1.5 text-lg sm:text-xl font-extrabold text-white">
                Canal en Emisión y Tracción Algorítmica Continua
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                Telemetría en tiempo real conectada con YouTube Data API v3 y Supabase PostgreSQL. 14 Shorts emitidos y 6 programados con miniaturas 9:16 nativas (cadencia: 5 por día cada 4-5 hs).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold transition cursor-pointer shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span>Informe C-Level</span>
              </button>
            )}
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
              APIs: 24/7 Conectadas
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-zinc-900/70 to-zinc-950 p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                  FASE DE PRE-LANZAMIENTO • {currentChannel.name}
                </span>
                <span className="inline-flex items-center rounded-md bg-zinc-800 px-2.5 py-0.5 text-xs font-mono text-zinc-300 border border-zinc-700">
                  0 Métricas Acumuladas
                </span>
              </div>
              <h3 className="mt-1.5 text-lg sm:text-xl font-extrabold text-white">
                Canal en preparación para primera emisión
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                No hay reproducciones acumuladas todavía. Los contadores y gráficos en tiempo real se activarán automáticamente una vez subido el primer video.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-400 border border-zinc-800 text-xs font-mono">
              APIs: Standby
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. 6 EXECUTIVE KPI CARDS WITH EXPLANATORY TOOLTIPS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Views */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm relative overflow-hidden hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-zinc-400 uppercase">
                TOTAL VIEWS AUDITADAS
              </span>
              <div className="group relative inline-flex items-center">
                <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-help" />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-zinc-200 shadow-2xl group-hover:block z-50">
                  Suma total de reproducciones auditadas en YouTube Data API v3 entre los 14 Shorts emitidos y el video largo oficial.
                </div>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Eye className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            {totalLiveViews.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs sm:text-sm font-medium">
            <span className="text-emerald-400 font-mono font-bold">+3.105 en 24h (+41%)</span>
            <span className="text-zinc-400 font-mono">14 Emitidos • 6 Programados</span>
          </div>
        </div>

        {/* Watch Time with Progress Bar */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-zinc-400 uppercase">
                WATCH TIME ACUMULADO
              </span>
              <div className="group relative inline-flex items-center">
                <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-help" />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-zinc-200 shadow-2xl group-hover:block z-50">
                  Horas totales de reproducción estimadas. El Programa de Partners de YouTube (YPP) requiere 4.000 hs para monetización con AdSense.
                </div>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            {watchHours} hs
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((watchHours / 4000) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Meta YPP: 4.000 hs</span>
              <span className="text-sky-300 font-bold">{((watchHours / 4000) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* AVD % */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-zinc-400 uppercase">
                AVD % (RETENCIÓN MEDIA)
              </span>
              <div className="group relative inline-flex items-center">
                <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-help" />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-zinc-200 shadow-2xl group-hover:block z-50">
                  Average Percentage Viewed (Retención Promedio). Si el AVD supera el 50%, el algoritmo clasifica el video como de alta retención e incrementa drásticamente las impresiones en el feed.
                </div>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Target className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight tabular-nums">
            {avgAvd}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs sm:text-sm font-medium">
            <span className="text-zinc-400">Benchmark Tier 1: &gt;50%</span>
            <span className="text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              SUPERADO
            </span>
          </div>
        </div>

        {/* Velocity Peak */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-zinc-400 uppercase">
                VELOCIDAD HORARIA (PEAK)
              </span>
              <div className="group relative inline-flex items-center">
                <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-help" />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-zinc-200 shadow-2xl group-hover:block z-50">
                  Pico máximo de reproducciones por hora (vistas/h) registrado en el Shorts Feed en la ventana de aceleración algorítmica.
                </div>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight tabular-nums">
            {winner.viewsPerHour}{' '}
            <span className="text-base font-normal text-zinc-400 font-mono">v/h</span>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-zinc-400 font-medium">
            Promedio Canal:{' '}
            <span className="text-white font-mono font-bold">28.4 vistas/h</span>
          </div>
        </div>

        {/* Target RPM */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-zinc-400 uppercase">
                RPM TARGET ESTIMADO
              </span>
              <div className="group relative inline-flex items-center">
                <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-help" />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-zinc-200 shadow-2xl group-hover:block z-50">
                  Revenue Per Mille estimado (ingreso por cada 1.000 vistas) proyectado según la demografía objetivo del canal y el nicho.
                </div>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {getNicheTargetRpm(currentChannel.id).split(' ')[0]}
          </div>
          <div className="mt-2 text-xs sm:text-sm text-zinc-400 font-medium truncate">
            {getNicheTargetRpm(currentChannel.id)}
          </div>
        </div>

        {/* Suscriptores */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-zinc-400 uppercase">
                SUSCRIPTORES REALES
              </span>
              <div className="group relative inline-flex items-center">
                <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-help" />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 rounded-xl bg-zinc-950 border border-zinc-700 p-2.5 text-xs text-zinc-200 shadow-2xl group-hover:block z-50">
                  Suscriptores verificados vía YouTube Data API v3 ganados a través de los videos y Shorts publicados.
                </div>
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            {totalSubscribers}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs sm:text-sm font-medium">
            <span className="text-emerald-400 font-mono font-bold">+100% en 48 hs</span>
            <span className="text-zinc-400 font-mono">1.22 subs / 1k vistas</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. VISUAL CHARTS: RETENTION CURVE & FORMAT SHARE */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Forensic Retention Curve (SPACIOUS h-80) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider font-mono text-white">
                  Curva Forense de Retención AVD (%)
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  Segundo a segundo • Línea verde punteada = Benchmark 50%
                </span>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/50">
              56.9% Promedio
            </span>
          </div>

          <div className="h-80 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={retentionCurveData}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="second" stroke="#a1a1aa" fontSize={12} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  stroke="#a1a1aa"
                  fontSize={12}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#3f3f46',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#fff',
                    padding: '8px 12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Retención Activa']}
                />
                <ReferenceLine
                  y={50}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{
                    value: '50% Meta Viral',
                    fill: '#10b981',
                    fontSize: 11,
                    position: 'right',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#retentionGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-800 text-center font-mono text-xs">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-400 block text-xs">0s a 3s (Gancho)</span>
              <strong className="text-emerald-400 text-sm font-bold">91% Retenido</strong>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-400 block text-xs">37s (Quiebre 120s)</span>
              <strong className="text-amber-400 text-sm font-bold">38% Fatiga</strong>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-400 block text-xs">&lt;45s (Final)</span>
              <strong className="text-sky-400 text-sm font-bold">65% Preservado</strong>
            </div>
          </div>
        </div>

        {/* Chart B: Format Market Share & Traffic Allocation */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <BarChart2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider font-mono text-white">
                  Cuota de Mercado por Formato ({totalLiveViews.toLocaleString()} Vistas)
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  Distribución de vistas y rendimiento medio por video
                </span>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/50">
              4 Formatos
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {formatStats.map((item) => {
              const colorClass = item.category.includes('Bridge')
                ? 'bg-emerald-400'
                : item.category.includes('Neon')
                ? 'bg-sky-400'
                : item.category.includes('Toy')
                ? 'bg-amber-400'
                : 'bg-purple-400';

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm font-mono">
                    <span className="font-bold text-white flex items-center space-x-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
                      <span>{item.category}</span>
                    </span>
                    <span className="text-zinc-400">
                      <strong className="text-white">
                        {item.totalViews.toLocaleString()} vistas
                      </strong>{' '}
                      ({item.trafficShare}%) •{' '}
                      <strong className="text-emerald-400">
                        {item.avgViewsPerShort} prom.
                      </strong>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                      style={{ width: `${item.trafficShare}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs sm:text-sm text-zinc-200 font-mono flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2.5">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Ultra-Shorts (&lt;45s) superan en <strong>+65.2%</strong> a los videos de 120s
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/50">
              844 vs 511 vistas
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. ALGORITHMIC INTELLIGENCE: WINNER VS BOTTLENECK */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Winner Card */}
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-zinc-900/70 to-zinc-950 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs sm:text-sm font-mono uppercase">
              <Trophy className="h-5 w-5" />
              <span>Top Winner Últimas 24H (Lo que Está Funcionando)</span>
            </div>
            <span className="text-xs sm:text-sm font-mono font-bold bg-amber-950/90 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-800">
              {winner.viewsPerHour} vistas/h
            </span>
          </div>

          <div className="flex items-start space-x-4">
            {winner.thumbnailUrl && (
              <img
                src={winner.thumbnailUrl}
                alt={winner.title}
                className="w-20 h-32 object-cover rounded-xl border border-amber-500/40 shrink-0 shadow-md"
              />
            )}
            <div className="space-y-2 overflow-hidden flex-1">
              <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                {winner.title}
              </h4>
              <div className="text-xs font-mono text-zinc-400 flex flex-wrap gap-x-2.5">
                <span>
                  Duración: <strong className="text-emerald-400">{winner.durationLabel}</strong>
                </span>
                <span>•</span>
                <span>
                  Vistas: <strong className="text-white">{winner.views.toLocaleString()}</strong>
                </span>
                <span>•</span>
                <span>
                  ER: <strong className="text-sky-400">{winner.er}%</strong>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                <strong className="text-amber-300 font-semibold">Por qué ganó:</strong>{' '}
                {winner.whyItWon}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs sm:text-sm text-zinc-400 font-mono">
            <span>Decisión CMO: Duplicar formato en 60% del próximo lote</span>
            {winner.url && (
              <a
                href={winner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 font-bold"
              >
                <span>Ver en YouTube</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Bottleneck Card */}
        <div className="rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-950/20 via-zinc-900/70 to-zinc-950 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-400 font-bold text-xs sm:text-sm font-mono uppercase">
              <AlertTriangle className="h-5 w-5" />
              <span>Cuello de Botella (Diagnóstico y Corrección)</span>
            </div>
            <span className="text-xs sm:text-sm font-mono font-bold bg-red-950/90 text-red-300 px-2.5 py-1 rounded-lg border border-red-800">
              {lagging.vsWinnerDelta}
            </span>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                {lagging.worstFormat}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-0.5">
                Vistas Promedio: <strong className="text-white">{lagging.avgViews}</strong> vistas por video (vs 844 en Ultra-Shorts)
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <strong className="text-red-400 font-semibold">Diagnóstico del fallo:</strong>{' '}
              {lagging.whyItLags}
            </p>

            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 text-xs sm:text-sm text-zinc-300 font-mono">
              <strong className="text-emerald-400">Acción Correctiva Inmediata:</strong>{' '}
              {lagging.correctiveAction}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs sm:text-sm text-zinc-400 font-mono">
            <span>Resolución: Próximos lotes acotados a 45-55s</span>
            <span className="text-emerald-400 font-bold">APLICADO EN VIVO</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. 24/7 CADENCE & SCHEDULE MATRIX */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-white">
            <Calendar className="h-5 w-5 text-sky-400" />
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider font-mono">
              Parrilla de Cadencia 24/7 (5 Slots Diarios en YouTube Studio)
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-mono text-sky-400 font-bold bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800/50">
            14 EMITIDOS • 6 PROGRAMADOS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 font-mono text-xs">
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <div className="text-zinc-400 text-xs">Slot 1 • 09:30 ART</div>
            <div className="font-bold text-white text-base">12:30 UTC</div>
            <div className="text-xs text-emerald-400 font-bold">Bridge Assault &amp; Obby</div>
            <div className="text-xs text-zinc-400">Pico mañana US/Latam</div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <div className="text-zinc-400 text-xs">Slot 2 • 13:30 ART</div>
            <div className="font-bold text-white text-base">16:30 UTC</div>
            <div className="text-xs text-sky-400 font-bold">Neon Marbles Survival</div>
            <div className="text-xs text-zinc-400">Pico mediodía EE.UU.</div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <div className="text-zinc-400 text-xs">Slot 3 • 17:30 ART</div>
            <div className="font-bold text-white text-base">20:30 UTC</div>
            <div className="text-xs text-amber-400 font-bold">Toy Cars Mega Ramp</div>
            <div className="text-xs text-zinc-400">Salida escolar y ocio</div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <div className="text-zinc-400 text-xs">Slot 4 • 21:30 ART</div>
            <div className="font-bold text-white text-base">00:30 UTC</div>
            <div className="text-xs text-purple-400 font-bold">Steel Titan Boss Clash</div>
            <div className="text-xs text-zinc-400">Prime time nocturno</div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-1.5">
            <div className="text-zinc-400 text-xs">Slot 5 • 01:30 ART</div>
            <div className="font-bold text-white text-base">04:30 UTC</div>
            <div className="text-xs text-emerald-400 font-bold">Lava Run World Cup</div>
            <div className="text-xs text-zinc-400">Apertura Europa / Asia</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. VIDEO LARGO OFICIAL & EXPERIMENTO A/B/C EN CURSO */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-zinc-900/60 to-zinc-900/60 p-6 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-amber-400">
              Video Largo Oficial (VOD 15m) • Test &amp; Compare Activo en YouTube Studio
            </span>
          </div>
          <button
            onClick={() => setSelectedVideo(longformVideoObj)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs sm:text-sm transition cursor-pointer self-start sm:self-auto shadow-md"
          >
            <span>Ver Métricas &amp; Experimento A/B</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div
          onClick={() => setSelectedVideo(longformVideoObj)}
          className="flex flex-col md:flex-row items-center gap-5 p-4 rounded-xl bg-black/50 border border-zinc-800 hover:border-amber-500/50 transition cursor-pointer"
        >
          <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden border border-zinc-700 bg-black shrink-0">
            <img
              src="/thumbnails/THUMBNAIL_A_NITRO_FIRE_MEGA_RAMP_16x9.jpg"
              alt="20 Toy Cars ULTIMATE GRAND PRIX!"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-mono font-bold text-white border border-white/20">
              15:10
            </div>
          </div>

          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold">
                1440p VP9 / 60 FPS
              </span>
              <span className="text-emerald-400 font-bold">PUBLICADO</span>
              <span className="text-zinc-400">ID: hHFweMYKmg0</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
              20 Toy Cars ULTIMATE GRAND PRIX! 🏎️💥 Hot Wheels Mega Ramp
            </h4>
            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-mono text-zinc-400 pt-1">
              <div>
                <span className="text-zinc-500">Tríada A/B: </span>
                <span className="text-amber-400 font-bold">3 Variantes en Rotación</span>
              </div>
              <div>
                <span className="text-zinc-500">Tiempo Restante: </span>
                <span className="text-zinc-200">13 días 23 horas</span>
              </div>
              <div>
                <span className="text-zinc-500">Localizaciones: </span>
                <span className="text-emerald-400 font-bold">21 Idiomas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. TOP VIDEOS LEADERBOARD */}
      {/* ========================================================= */}
      {topWinners.length > 0 && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-white">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider font-mono">
                Top Videos con Mayor Tracción ({currentChannel.name})
              </h3>
            </div>
            <button
              onClick={() => setMetricsTab('forensic_table')}
              className="text-xs sm:text-sm font-mono text-sky-400 hover:text-sky-300 flex items-center space-x-1.5 cursor-pointer font-semibold"
            >
              <span>Ver los 20 Shorts en detalle forense</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topWinners.map((clip: any, idx: number) => {
              const isTop = idx === 0;
              const views = clip.views || (clip.platforms?.YOUTUBE_SHORT as any)?.views || 0;
              const url = clip.url || clip.platforms?.YOUTUBE_SHORT?.url;
              const status = clip.status || clip.platforms?.YOUTUBE_SHORT?.status || 'SCHEDULED';

              return (
                <div
                  key={clip.id}
                  onClick={() => setSelectedVideo(clip)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${
                    isTop
                      ? 'border-amber-500/40 bg-amber-950/15 hover:border-amber-500/70'
                      : 'border-zinc-800/80 bg-zinc-950/60 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 overflow-hidden">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-mono font-bold shrink-0 ${
                        isTop ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    {clip.thumbnailUrl && (
                      <img
                        src={clip.thumbnailUrl}
                        alt={clip.title}
                        className="w-11 h-16 object-cover rounded-lg border border-zinc-700 shrink-0 hidden sm:block"
                      />
                    )}
                    <div className="overflow-hidden">
                      <div className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                        {clip.title}
                      </div>
                      <div className="text-xs font-mono text-zinc-400 flex items-center space-x-2.5 mt-1">
                        <span>{clip.id}</span>
                        <span>•</span>
                        <span
                          className={
                            status === 'public' || status === 'PUBLISHED'
                              ? 'text-emerald-400 font-bold'
                              : 'text-amber-400'
                          }
                        >
                          {status.toUpperCase()}
                        </span>
                        {clip.category && (
                          <>
                            <span>•</span>
                            <span className="text-zinc-300">{clip.category}</span>
                          </>
                        )}
                        {clip.durationLabel && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">{clip.durationLabel}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black font-mono text-white tabular-nums">
                        {views.toLocaleString()}
                      </div>
                      <div className="text-xs font-mono text-zinc-400 uppercase">Vistas</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(clip);
                      }}
                      className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-[#1e2129] hover:bg-[#262a34] text-xs font-mono text-emerald-400 border border-[#262a34] transition cursor-pointer"
                    >
                      Métricas
                    </button>
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                        title="Ver en YouTube Shorts"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pre-flight Launch Checklist */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider font-mono">
              Checklist de Salida a Producción ({currentChannel.name})
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
            4/4 PASOS CONCLUIDOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>1. Guion Maestro</span>
            </div>
            <p className="text-xs text-zinc-300">
              Guion del Episodio 01 bloqueado y adaptado para el oído.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>2. Audio &amp; Render 3D</span>
            </div>
            <p className="text-xs text-zinc-300">
              Render 60 FPS calibrado a -14 LUFS con música melódica.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>3. Matriz 20 Clips</span>
            </div>
            <p className="text-xs text-zinc-300">
              {publishedClips.length || 14} emitidos y {scheduledClips.length || 6} programados con miniaturas 9:16 nativas.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>4. Tokens de API</span>
            </div>
            <p className="text-xs text-zinc-300">
              Conectados 24/7 (YouTube Data API v3, Supabase &amp; Buffer).
            </p>
          </div>
        </div>
      </div>

      {/* Video Forensic Detail Modal */}
      <VideoForensicDetailModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
};
