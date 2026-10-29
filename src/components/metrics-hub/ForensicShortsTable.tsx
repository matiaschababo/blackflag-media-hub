'use client';

import React, { useState, useMemo } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { ForensicVideo, ForensicAnalyticsData } from '../../types';
import levelpopForensicFallback from '../../data/levelpop_forensic_analytics.json';
import { VideoForensicDetailModal } from './VideoForensicDetailModal';
import {
  Search,
  ExternalLink,
  Flame,
  Clock,
  ThumbsUp,
  Eye,
  TrendingUp,
  Zap,
  Filter,
} from 'lucide-react';

export const ForensicShortsTable: React.FC = () => {
  const { currentChannel } = useHolding();
  const [selectedVideo, setSelectedVideo] = useState<ForensicVideo | null>(null);

  // Load forensic data from current channel or fallback to levelpop JSON
  const forensicData: ForensicAnalyticsData = useMemo(() => {
    if (currentChannel.stats?.forensic_analytics?.videos?.length) {
      return currentChannel.stats.forensic_analytics;
    }
    return levelpopForensicFallback as unknown as ForensicAnalyticsData;
  }, [currentChannel]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'views' | 'velocity' | 'er' | 'duration'>('views');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    forensicData.videos.forEach((v) => set.add(v.category));
    return ['ALL', ...Array.from(set)];
  }, [forensicData]);

  // Filtered and sorted videos
  const filteredVideos = useMemo(() => {
    return forensicData.videos
      .filter((v) => {
        const matchesSearch =
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || v.category === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return b.views - a.views;
        if (sortBy === 'velocity') return b.viewsPerHour - a.viewsPerHour;
        if (sortBy === 'er') return b.engagementRate - a.engagementRate;
        if (sortBy === 'duration') return a.durationSec - b.durationSec;
        return 0;
      });
  }, [forensicData, searchQuery, categoryFilter, statusFilter, sortBy]);

  const maxViews = useMemo(() => {
    return Math.max(...forensicData.videos.map((v) => v.views), 1);
  }, [forensicData]);

  return (
    <div className="space-y-6">
      {/* 4 Quick Stat Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            <span>TOTAL SHORTS</span>
            <Eye className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            {forensicData.videos.length}
          </div>
          <div className="mt-1 text-xs text-zinc-400 font-mono">
            14 Emitidos • 6 Programados
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            <span>VISTAS AUDITADAS</span>
            <Flame className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight tabular-nums">
            {forensicData.channel.auditedViewsSum.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-zinc-400 font-mono">
            Promedio: {Math.round(forensicData.channel.auditedViewsSum / 14)} vistas/short
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            <span>TOP PERFORMER</span>
            <TrendingUp className="h-5 w-5 text-sky-400" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            1,352
          </div>
          <div className="mt-1 text-xs text-sky-400 font-mono font-semibold truncate">
            Bridge Assault (37s)
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            <span>MAX VELOCIDAD</span>
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-purple-400 tracking-tight tabular-nums">
            75.2 v/h
          </div>
          <div className="mt-1 text-xs text-zinc-400 font-mono truncate">
            Sky Block Obby (1.2K en 24h)
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 space-y-3 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o Video ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category */}
            <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-300">
              <Filter className="h-4 w-4 text-zinc-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-white text-xs sm:text-sm focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-zinc-900 text-white">
                    {cat === 'ALL' ? 'Todos los formatos' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todos los estados</option>
              <option value="public">Públicos (14)</option>
              <option value="scheduled">Programados (6)</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none cursor-pointer font-mono"
            >
              <option value="views">Ordenar: Vistas</option>
              <option value="velocity">Ordenar: Velocidad (v/h)</option>
              <option value="er">Ordenar: Engagement (ER%)</option>
              <option value="duration">Ordenar: Duración</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-xs font-mono uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 w-20">Preview</th>
                <th className="py-3.5 px-4 min-w-[300px]">Título y Formato</th>
                <th className="py-3.5 px-4 w-28">Duración</th>
                <th className="py-3.5 px-4 w-32">Estado</th>
                <th className="py-3.5 px-4 w-40 text-right">Vistas</th>
                <th className="py-3.5 px-4 w-32 text-right">Likes / ER%</th>
                <th className="py-3.5 px-4 w-32 text-right">Velocidad</th>
                <th className="py-3.5 px-4 w-32 text-center">Tier</th>
                <th className="py-3.5 px-4 w-20 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
              {filteredVideos.map((video, idx) => {
                const isOutlier = video.views > 1000;
                const isScheduled = video.status === 'scheduled';
                const percentOfMax = Math.round((video.views / maxViews) * 100);

                return (
                  <tr
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`hover:bg-zinc-800/40 transition cursor-pointer ${
                      isOutlier ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-zinc-400">
                      {idx + 1}
                    </td>

                    {/* Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="relative h-16 w-10 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white truncate max-w-sm sm:max-w-md">
                        {video.title}
                      </div>
                      <div className="mt-1 flex items-center space-x-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                          {video.category}
                        </span>
                        <span className="text-zinc-400">{video.id}</span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                          video.durationSec < 45
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                            : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>{video.durationLabel}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {isScheduled ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                            PROGRAMADO
                          </span>
                          {video.publishAt && (
                            <div className="text-xs font-mono text-zinc-400">
                              {video.publishAt.slice(11, 16)} UTC
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                          PUBLICADO
                        </span>
                      )}
                    </td>

                    {/* Views & Bar */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="font-extrabold text-white text-base tabular-nums">
                        {video.views > 0 ? video.views.toLocaleString() : '—'}
                      </div>
                      {video.views > 0 && (
                        <div className="mt-1 w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isOutlier ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentOfMax}%` }}
                          />
                        </div>
                      )}
                    </td>

                    {/* Likes & ER% */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <div className="flex items-center justify-end space-x-1.5 text-white font-bold">
                        <ThumbsUp className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{video.likes}</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {video.engagementRate > 0 ? `${video.engagementRate}% ER` : '—'}
                      </div>
                    </td>

                    {/* Velocity (Views/Hr) */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <div className="font-extrabold text-sky-400 text-sm sm:text-base">
                        {video.viewsPerHour > 0 ? `${video.viewsPerHour} v/h` : '—'}
                      </div>
                      <div className="text-xs text-zinc-400">Ritmo actual</div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold ${
                          video.tier.includes('TIER S')
                            ? 'bg-amber-400 text-black'
                            : video.tier.includes('TIER A')
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : video.tier.includes('TIER B')
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {video.tier.split(' ')[0]} {video.tier.split(' ')[1] || ''}
                      </span>
                    </td>

                    {/* YouTube Link & Detail Action */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVideo(video);
                          }}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-emerald-400 border border-zinc-700 transition cursor-pointer"
                          title="Ver desglose forense completo"
                        >
                          Métricas
                        </button>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                          title="Ver en YouTube Shorts"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Deep Dive Modal */}
      <VideoForensicDetailModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
};
