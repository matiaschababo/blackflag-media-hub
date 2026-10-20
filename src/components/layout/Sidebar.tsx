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
  CheckCircle2,
  ChevronDown,
  Check,
  PlusCircle,
  ExternalLink,
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

  // Close dropdown on outside click
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
    <aside className="w-full shrink-0 border-r border-zinc-800/80 bg-[#0d0d11]/95 backdrop-blur-xl p-4 md:w-64 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="space-y-4">
        {/* ========================================================= */}
        {/* 1. INTERACTIVE CHANNEL SWITCHER (DROPDOWN + SEGMENTED PILLS) */}
        {/* ========================================================= */}
        <div className="relative" ref={dropdownRef}>
          {/* Main Channel Card Button (Triggers Dropdown) */}
          <button
            onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
            className="w-full text-left rounded-2xl border border-zinc-800/90 bg-[#121217] p-3 shadow-xl relative overflow-hidden group transition-all duration-200 hover:border-zinc-700 cursor-pointer"
            style={{
              borderTop: `3px solid ${currentChannel.accentColor}`,
              boxShadow: `0 8px 24px -6px ${currentChannel.accentColor}25`,
            }}
          >
            {/* Subtle Banner Backdrop */}
            {currentChannel.bannerUrl && (
              <div
                className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none transition-opacity group-hover:opacity-25"
                style={{ backgroundImage: `url(${currentChannel.bannerUrl})` }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${currentChannel.accentColor}25`,
                    color: currentChannel.accentColor,
                  }}
                >
                  {currentChannel.shortCode} CANAL ACTIVO
                </span>
                <div className="flex items-center space-x-1 text-zinc-400 group-hover:text-white transition">
                  <span className="text-[10px] font-mono">Cambiar</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isChannelDropdownOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="mt-2.5 flex items-center space-x-2.5">
                <img
                  src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
                  alt={currentChannel.name}
                  className="h-10 w-10 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
                />
                <div className="overflow-hidden flex-1">
                  <h2 className="text-sm font-extrabold text-white leading-tight truncate">
                    {currentChannel.name}
                  </h2>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {currentChannel.niche}
                  </p>
                </div>
              </div>

              {/* Quick Metrics Badges */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="rounded-xl bg-black/60 p-1.5 px-2 border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[8px] uppercase tracking-wider">Stock</span>
                  <span className="font-extrabold text-white text-xs">{filteredClips.length} clips</span>
                </div>
                <div className="rounded-xl bg-black/60 p-1.5 px-2 border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[8px] uppercase tracking-wider">Emitidos</span>
                  <span className="font-extrabold text-emerald-400 text-xs">{publishedClipsCount}</span>
                </div>
              </div>
            </div>
          </button>

          {/* Dropdown Menu Popup */}
          {isChannelDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-zinc-700/80 bg-[#16161e] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                <span>SELECCIONAR CANAL</span>
                <span className="text-amber-400">{channels.length} DISPONIBLES</span>
              </div>

              <div className="space-y-1">
                {channels.map((ch) => {
                  const isSelected = selectedChannelId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannelId(ch.id);
                        setIsChannelDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-800/90 text-white border border-amber-500/40 shadow-md'
                          : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <img
                          src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                          alt={ch.name}
                          className="h-8 w-8 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{ch.name}</span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/50 text-zinc-400">
                              {ch.shortCode}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">{ch.niche}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 text-amber-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {onOpenNewChannelModal && (
                <div className="mt-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setIsChannelDropdownOpen(false);
                      onOpenNewChannelModal();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-amber-400 border border-zinc-800 transition cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Dar de Alta Nuevo Canal</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 1-Click Segmented Switcher Strip (Instant Channel Access) */}
          <div className="mt-2 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#121217] border border-zinc-800/80">
            {channels.map((ch) => {
              const isSelected = selectedChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  title={`Cambiar a ${ch.name}`}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                  style={
                    isSelected
                      ? {
                          border: `1.5px solid ${ch.accentColor}90`,
                          boxShadow: `0 0 12px -2px ${ch.accentColor}30`,
                        }
                      : {}
                  }
                >
                  <img
                    src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                    alt={ch.name}
                    className="h-5 w-5 rounded-md object-cover border border-white/20 mb-0.5"
                  />
                  <span className="text-[9px] font-extrabold truncate max-w-full">
                    {ch.shortCode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. REDES OFICIALES (TOP POSITION - ALWAYS VISIBLE!) */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-3 shadow-lg">
          <div className="pb-2 text-[9px] font-black uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between border-b border-zinc-800/80">
            <span>REDES OFICIALES</span>
            <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-[9px]">
              <CheckCircle2 className="h-2.5 w-2.5" />
              <span>APIs OK</span>
            </span>
          </div>

          <div className="mt-2 space-y-1.5 text-xs font-mono">
            <a
              href={`https://youtube.com/${currentChannel.accounts.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-black/40 px-2.5 py-1.5 border border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-900/60 transition group cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="YOUTUBE" size={15} />
                <span className="text-zinc-300 text-[11px] truncate group-hover:text-white">
                  {currentChannel.accounts.youtube}
                </span>
              </div>
              <ExternalLink className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <a
              href={`https://instagram.com/${currentChannel.accounts.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-black/40 px-2.5 py-1.5 border border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-900/60 transition group cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="INSTAGRAM" size={15} />
                <span className="text-zinc-300 text-[11px] truncate group-hover:text-white">
                  {currentChannel.accounts.instagram}
                </span>
              </div>
              <ExternalLink className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <a
              href={`https://tiktok.com/${currentChannel.accounts.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-black/40 px-2.5 py-1.5 border border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-900/60 transition group cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="TIKTOK" size={15} />
                <span className="text-zinc-300 text-[11px] truncate group-hover:text-white">
                  {currentChannel.accounts.tiktok}
                </span>
              </div>
              <ExternalLink className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <div className="flex items-center justify-between rounded-xl bg-black/40 px-2.5 py-1.5 border border-zinc-800/70">
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="FACEBOOK" size={15} />
                <span className="text-zinc-300 text-[11px] truncate">
                  {currentChannel.accounts.facebook}
                </span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-black/40 px-2.5 py-1.5 border border-zinc-800/70">
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="TWITTER" size={15} />
                <span className="text-zinc-300 text-[11px] truncate">
                  {currentChannel.accounts.x}
                </span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PRIMARY OPERATIONAL NAVIGATION (MIX ON CLEAN STANDARD) */}
        {/* ========================================================= */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[9px] font-black uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between">
            <span>{mode === 'content_manager' ? 'OPERACIONES' : 'ANALÍTICA'}</span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: currentChannel.accentColor }}
            />
          </div>

          {mode === 'content_manager' ? (
            <>
              {/* 1. Inicio / Overview (FIRST ITEM - EXACTLY LIKE MIX ON) */}
              <button
                onClick={() => setContentTab('overview')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'overview'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="h-4 w-4 text-amber-400" />
                  <span>Inicio (Cabina de Mando)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Hub</span>
              </button>

              {/* 2. Episodios VOD */}
              <button
                onClick={() => setContentTab('episodes')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'episodes'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Tv className="h-4 w-4 text-amber-400" />
                  <span>Episodios VOD</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold">1440p</span>
              </button>

              {/* 3. Parrilla 24/7 */}
              <button
                onClick={() => setContentTab('parrilla')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'parrilla'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Parrilla 24/7</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">Slots</span>
              </button>

              {/* 4. Radar de Stock */}
              <button
                onClick={() => setContentTab('radar')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'radar'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Radar className="h-4 w-4 text-amber-400" />
                  <span>Radar de Stock</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Runway</span>
              </button>

              {/* 5. Matriz de 10 Clips */}
              <button
                onClick={() => setContentTab('clips_matrix')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  contentTab === 'clips_matrix'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="h-4 w-4 text-amber-400" />
                  <span>Matriz de 10 Clips</span>
                </div>
                <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-mono font-bold text-zinc-300 border border-zinc-700/60">
                  {filteredClips.length}
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Metrics Hub Navigation */}
              <button
                onClick={() => setMetricsTab('overview')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'overview'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                <span>Rendimiento Global</span>
              </button>

              <button
                onClick={() => setMetricsTab('retention')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'retention'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LineChart className="h-4 w-4 text-cyan-400" />
                  <span>Curva de Retención</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">&gt;50%</span>
              </button>

              <button
                onClick={() => setMetricsTab('platforms')}
                className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'platforms'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <Share2 className="h-4 w-4 text-cyan-400" />
                <span>Comparativa Multi-Red</span>
              </button>

              <button
                onClick={() => setMetricsTab('ab_testing')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  metricsTab === 'ab_testing'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <SplitSquareVertical className="h-4 w-4 text-cyan-400" />
                  <span>Tríada Packaging (A/B/C)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">CTR</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
        <span>HOLDING STUDIO 2026</span>
        <span className="text-zinc-400">ART (UTC-3)</span>
      </div>
    </aside>
  );
};