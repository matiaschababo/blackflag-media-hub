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
    <aside className="w-full shrink-0 border-r border-[#1e2129] bg-[#0c0d10] p-3.5 md:w-60 md:min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
      <div className="space-y-4">
        {/* ========================================================= */}
        {/* 1. CHANNEL SELECTOR (SOLID FLAT SURFACE, NO GLOW) */}
        {/* ========================================================= */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
            className="w-full text-left rounded-xl border border-[#1e2129] bg-[#13151a] p-3 hover:border-[#2c313d] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#848d97] font-medium">Canal activo</span>
              <div className="flex items-center space-x-1 text-[#848d97]">
                <span className="text-[10px]">Cambiar</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-150 ${
                    isChannelDropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2.5">
              <img
                src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
                alt={currentChannel.name}
                className="h-8 w-8 rounded-lg object-cover border border-[#262a34] shrink-0"
              />
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {currentChannel.name}
                </div>
                <div className="text-[10px] text-[#848d97] truncate">
                  {currentChannel.niche}
                </div>
              </div>
            </div>

            {/* Flat Metric Strip */}
            <div className="mt-2.5 pt-2 border-t border-[#1e2129] flex items-center justify-between text-[11px] tabular-nums">
              <span className="text-[#848d97]">Stock: <strong className="text-white font-semibold">{filteredClips.length} clips</strong></span>
              <span className="text-[#848d97]">Emitidos: <strong className="text-emerald-400 font-semibold">{publishedClipsCount}</strong></span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isChannelDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-[#262a34] bg-[#13151a] p-1.5 shadow-2xl">
              <div className="px-2 py-1 text-[10px] font-semibold text-[#848d97] border-b border-[#1e2129] mb-1">
                Seleccionar canal
              </div>

              <div className="space-y-0.5">
                {channels.map((ch) => {
                  const isSelected = selectedChannelId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannelId(ch.id);
                        setIsChannelDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e2129] text-white'
                          : 'text-[#848d97] hover:bg-[#181b21] hover:text-[#f0f2f5]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <img
                          src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                          alt={ch.name}
                          className="h-6 w-6 rounded-md object-cover border border-[#262a34] shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-semibold text-white truncate">
                            {ch.name}
                          </div>
                          <div className="text-[10px] text-[#848d97] truncate">{ch.niche}</div>
                        </div>
                      </div>

                      {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {onOpenNewChannelModal && (
                <div className="mt-1 pt-1 border-t border-[#1e2129]">
                  <button
                    onClick={() => {
                      setIsChannelDropdownOpen(false);
                      onOpenNewChannelModal();
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg text-xs font-medium text-[#848d97] hover:text-white hover:bg-[#181b21] transition cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Dar de alta canal</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 1-Click Segmented Tabs */}
          <div className="mt-1.5 grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[#13151a] border border-[#1e2129]">
            {channels.map((ch) => {
              const isSelected = selectedChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  title={ch.name}
                  className={`flex items-center justify-center space-x-1 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e2129] text-white font-semibold'
                      : 'text-[#848d97] hover:text-white'
                  }`}
                >
                  <img
                    src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                    alt={ch.name}
                    className="h-3.5 w-3.5 rounded object-cover"
                  />
                  <span>{ch.shortCode}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. REDES VINCULADAS (FLAT, NO PULSING BLOBS) */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-2.5">
          <div className="text-[10px] font-semibold text-[#848d97] mb-2 px-1">
            Redes oficiales
          </div>

          <div className="space-y-1 text-xs">
            <a
              href={`https://youtube.com/${currentChannel.accounts.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-[#181b21] transition group cursor-pointer text-[#848d97] hover:text-white"
            >
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="YOUTUBE" size={14} />
                <span className="text-[11px] truncate">{currentChannel.accounts.youtube}</span>
              </div>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <a
              href={`https://instagram.com/${currentChannel.accounts.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-[#181b21] transition group cursor-pointer text-[#848d97] hover:text-white"
            >
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="INSTAGRAM" size={14} />
                <span className="text-[11px] truncate">{currentChannel.accounts.instagram}</span>
              </div>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <a
              href={`https://tiktok.com/${currentChannel.accounts.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-[#181b21] transition group cursor-pointer text-[#848d97] hover:text-white"
            >
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="TIKTOK" size={14} />
                <span className="text-[11px] truncate">{currentChannel.accounts.tiktok}</span>
              </div>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </a>

            <div className="flex items-center justify-between rounded-lg px-2 py-1 text-[#848d97]">
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="FACEBOOK" size={14} />
                <span className="text-[11px] truncate">{currentChannel.accounts.facebook}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg px-2 py-1 text-[#848d97]">
              <div className="flex items-center space-x-2 truncate">
                <PlatformIcon platform="TWITTER" size={14} />
                <span className="text-[11px] truncate">{currentChannel.accounts.x}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. OPERATIONAL MENU (NEUTRAL ACTIVE PILLS, ZERO AI SLOP) */}
        {/* ========================================================= */}
        <div className="space-y-0.5">
          <div className="px-2 pb-1 text-[10px] font-semibold text-[#848d97]">
            {mode === 'content_manager' ? 'Operaciones' : 'Analítica'}
          </div>

          {mode === 'content_manager' ? (
            <>
              <button
                onClick={() => setContentTab('overview')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  contentTab === 'overview'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Inicio (Cabina de Mando)</span>
                </div>
              </button>

              <button
                onClick={() => setContentTab('episodes')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  contentTab === 'episodes'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Tv className="h-3.5 w-3.5" />
                  <span>Episodios VOD</span>
                </div>
                <span className="text-[10px] text-[#848d97]">1440p</span>
              </button>

              <button
                onClick={() => setContentTab('parrilla')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  contentTab === 'parrilla'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Parrilla 24/7</span>
                </div>
                <span className="text-[10px] text-[#848d97]">Slots</span>
              </button>

              <button
                onClick={() => setContentTab('radar')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  contentTab === 'radar'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Radar className="h-3.5 w-3.5" />
                  <span>Radar de Stock</span>
                </div>
                <span className="text-[10px] text-[#848d97]">Runway</span>
              </button>

              <button
                onClick={() => setContentTab('clips_matrix')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  contentTab === 'clips_matrix'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Matriz 10 Clips</span>
                </div>
                <span className="text-[10px] text-[#848d97] tabular-nums font-semibold">
                  {filteredClips.length}
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMetricsTab('overview')}
                className={`flex w-full items-center space-x-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  metricsTab === 'overview'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Rendimiento Global</span>
              </button>

              <button
                onClick={() => setMetricsTab('retention')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  metricsTab === 'retention'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LineChart className="h-3.5 w-3.5" />
                  <span>Curva de Retención</span>
                </div>
                <span className="text-[10px] text-[#848d97]">&gt;50%</span>
              </button>

              <button
                onClick={() => setMetricsTab('platforms')}
                className={`flex w-full items-center space-x-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  metricsTab === 'platforms'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Comparativa Multi-Red</span>
              </button>

              <button
                onClick={() => setMetricsTab('ab_testing')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  metricsTab === 'ab_testing'
                    ? 'bg-[#1e2129] text-white font-semibold'
                    : 'text-[#848d97] hover:bg-[#13151a] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <SplitSquareVertical className="h-3.5 w-3.5" />
                  <span>Tríada Packaging</span>
                </div>
                <span className="text-[10px] text-[#848d97]">CTR</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Simple footer without performative metadata */}
      <div className="mt-4 pt-3 border-t border-[#1e2129] text-[11px] text-[#848d97] flex items-center justify-between">
        <span>Holding Studio</span>
        <span>ART (UTC-3)</span>
      </div>
    </aside>
  );
};