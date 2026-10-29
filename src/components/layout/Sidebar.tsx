'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Layers,
  Calendar,
  Tv,
  Radar,
  LayoutDashboard,
  LineChart,
  Share2,
  SplitSquareVertical,
  ChevronDown,
  Check,
  PlusCircle,
  ExternalLink,
  Cpu,
  Table,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

interface SidebarProps {
  onOpenNewChannelModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewChannelModal }) => {
  const {
    channels,
    selectedChannelId,
    setSelectedChannelId,
    currentChannel,
    mode,
    contentTab,
    setContentTab,
    metricsTab,
    setMetricsTab,
    filteredClips,
  } = useHolding();

  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsChannelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publishedClipsCount = filteredClips.filter((c) =>
    Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
  ).length;

  return (
    <aside className="w-full shrink-0 border-r border-[#1e2129] bg-[#0c0d10] p-4 md:w-64 lg:w-72 md:min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
      <div className="space-y-5">
        {/* ========================================================= */}
        {/* 1. CHANNEL SELECTOR */}
        {/* ========================================================= */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
            className="w-full text-left rounded-xl border border-[#1e2129] bg-[#13151a] p-3.5 hover:border-[#2c313d] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#848d97] font-semibold uppercase tracking-wider">
                Canal activo
              </span>
              <div className="flex items-center space-x-1.5 text-[#848d97]">
                <span className="text-xs">Cambiar</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${
                    isChannelDropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </div>
            </div>

            <div className="mt-2.5 flex items-center space-x-3">
              <img
                src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
                alt={currentChannel.name}
                className="h-10 w-10 rounded-xl object-cover border border-[#262a34] shrink-0"
              />
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-bold text-white truncate">
                  {currentChannel.name}
                </div>
                <div className="text-xs text-[#848d97] truncate mt-0.5">
                  {currentChannel.niche}
                </div>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="mt-3 pt-2.5 border-t border-[#1e2129] flex items-center justify-between text-xs tabular-nums">
              <span className="text-[#848d97]">
                Stock: <strong className="text-white font-semibold">{filteredClips.length} clips</strong>
              </span>
              <span className="text-[#848d97]">
                Emitidos: <strong className="text-emerald-400 font-semibold">{publishedClipsCount}</strong>
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isChannelDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-[#262a34] bg-[#13151a] p-2 shadow-2xl">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#848d97] border-b border-[#1e2129] mb-1">
                Seleccionar canal
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedChannelId('all');
                    setIsChannelDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition cursor-pointer ${
                    selectedChannelId === 'all'
                      ? 'bg-[#1e2129] text-white font-semibold'
                      : 'text-[#848d97] hover:bg-[#181b21] hover:text-[#f0f2f5]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className="h-7 w-7 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-xs font-bold text-sky-400 shrink-0">
                      ALL
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">
                        Todos los Canales
                      </div>
                      <div className="text-xs text-[#848d97] truncate">Holding global</div>
                    </div>
                  </div>
                  {selectedChannelId === 'all' && <Check className="h-4 w-4 text-white shrink-0 ml-2" />}
                </button>

                {channels.map((ch) => {
                  const isSelected = selectedChannelId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannelId(ch.id);
                        setIsChannelDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e2129] text-white font-semibold'
                          : 'text-[#848d97] hover:bg-[#181b21] hover:text-[#f0f2f5]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <img
                          src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                          alt={ch.name}
                          className="h-7 w-7 rounded-lg object-cover border border-[#262a34] shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs sm:text-sm font-semibold text-white truncate">
                            {ch.name}
                          </div>
                          <div className="text-xs text-[#848d97] truncate">{ch.niche}</div>
                        </div>
                      </div>

                      {isSelected && <Check className="h-4 w-4 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {onOpenNewChannelModal && (
                <div className="mt-1.5 pt-1.5 border-t border-[#1e2129]">
                  <button
                    onClick={() => {
                      setIsChannelDropdownOpen(false);
                      onOpenNewChannelModal();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium text-[#848d97] hover:text-white hover:bg-[#181b21] transition cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Dar de alta canal</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 2. REDES VINCULADAS */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#848d97] mb-2 px-1">
            Redes oficiales
          </div>

          <div className="space-y-1 text-xs sm:text-sm">
            <a
              href={`https://youtube.com/${currentChannel.accounts.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-[#181b21] transition group cursor-pointer text-[#848d97] hover:text-white"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <PlatformIcon platform="YOUTUBE" size={16} />
                <span className="text-xs truncate">{currentChannel.accounts.youtube}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <a
              href={`https://instagram.com/${currentChannel.accounts.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-[#181b21] transition group cursor-pointer text-[#848d97] hover:text-white"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <PlatformIcon platform="INSTAGRAM" size={16} />
                <span className="text-xs truncate">{currentChannel.accounts.instagram}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <a
              href={`https://tiktok.com/${currentChannel.accounts.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-[#181b21] transition group cursor-pointer text-[#848d97] hover:text-white"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <PlatformIcon platform="TIKTOK" size={16} />
                <span className="text-xs truncate">{currentChannel.accounts.tiktok}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[#848d97]">
              <div className="flex items-center space-x-2.5 truncate">
                <PlatformIcon platform="FACEBOOK" size={16} />
                <span className="text-xs truncate">{currentChannel.accounts.facebook}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[#848d97]">
              <div className="flex items-center space-x-2.5 truncate">
                <PlatformIcon platform="TWITTER" size={16} />
                <span className="text-xs truncate">{currentChannel.accounts.x}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. OPERATIONAL MENU */}
        {/* ========================================================= */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-[#848d97]">
            {mode === 'content_manager' ? 'Operaciones Contenido' : 'Analítica & Métricas'}
          </div>

          {mode === 'content_manager' ? (
            <>
              <button
                onClick={() => setContentTab('overview')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  contentTab === 'overview'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="h-4 w-4 text-sky-400" />
                  <span>Inicio Resumen</span>
                </div>
              </button>

              <button
                onClick={() => setContentTab('episodes')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  contentTab === 'episodes'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Tv className="h-4 w-4 text-amber-400" />
                  <span>Episodios VOD</span>
                </div>
                <span className="text-xs font-mono text-[#848d97] px-1.5 py-0.5 rounded bg-zinc-800">
                  1440p
                </span>
              </button>

              <button
                onClick={() => setContentTab('parrilla')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  contentTab === 'parrilla'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span>Parrilla 24/7</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">Slots</span>
              </button>

              <button
                onClick={() => setContentTab('radar')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  contentTab === 'radar'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Radar className="h-4 w-4 text-purple-400" />
                  <span>Stock &amp; Runway</span>
                </div>
                <span className="text-xs font-mono text-purple-400">Runway</span>
              </button>

              <button
                onClick={() => setContentTab('clips_matrix')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  contentTab === 'clips_matrix'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="h-4 w-4 text-sky-400" />
                  <span>Matriz de Clips</span>
                </div>
                <span className="text-xs font-mono text-white bg-zinc-800 px-2 py-0.5 rounded-full font-bold">
                  {filteredClips.length}
                </span>
              </button>

              <button
                onClick={() => setContentTab('swarm_console')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  contentTab === 'swarm_console'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <span>Enjambre IA</span>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold">Live</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMetricsTab('overview')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  metricsTab === 'overview'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                <span>Visión Global</span>
              </button>

              <button
                onClick={() => setMetricsTab('forensic_table')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  metricsTab === 'forensic_table'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Table className="h-4 w-4 text-emerald-400" />
                  <span>Short por Short</span>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  20
                </span>
              </button>

              <button
                onClick={() => setMetricsTab('cross_analysis')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  metricsTab === 'cross_analysis'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <Sliders className="h-4 w-4 text-sky-400" />
                <span>Cruce Formatos</span>
              </button>

              <button
                onClick={() => setMetricsTab('retention')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  metricsTab === 'retention'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LineChart className="h-4 w-4 text-cyan-400" />
                  <span>Curvas Retención</span>
                </div>
                <span className="text-xs text-cyan-400 font-mono font-bold">&gt;50%</span>
              </button>

              <button
                onClick={() => setMetricsTab('platforms')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  metricsTab === 'platforms'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <Share2 className="h-4 w-4 text-amber-400" />
                <span>Multi-Red</span>
              </button>

              <button
                onClick={() => setMetricsTab('ab_testing')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  metricsTab === 'ab_testing'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <SplitSquareVertical className="h-4 w-4 text-pink-400" />
                  <span>Packaging CTR</span>
                </div>
                <span className="text-xs text-pink-400 font-mono font-bold">A/B</span>
              </button>

              <button
                onClick={() => setMetricsTab('ai_insights')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  metricsTab === 'ai_insights'
                    ? 'bg-[#1e2129] text-white font-semibold border border-zinc-700/60'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Diagnóstico IA</span>
                </div>
                <span className="text-xs text-purple-400 font-mono font-bold">IA</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Simple footer */}
      <div className="mt-5 pt-3.5 border-t border-[#1e2129] text-xs text-[#848d97] flex items-center justify-between">
        <span className="font-medium">Holding Studio</span>
        <span className="font-mono">ART (UTC-3)</span>
      </div>
    </aside>
  );
};
