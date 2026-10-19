'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Film,
  BarChart3,
  Globe2,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenNewChannelModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewChannelModal }) => {
  const {
    channels,
    selectedChannelId,
    setSelectedChannelId,
    currentChannel,
    mode,
    setMode,
  } = useHolding();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Holding Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 shadow-lg shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-zinc-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-wider text-amber-400">HOLDING ENGINE</span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                LIVE 24/7
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white sm:text-base">
              BlackFlag Media Hub
            </h1>
          </div>
        </div>

        {/* Center: Dual-Mode Switcher */}
        <div className="flex items-center rounded-xl bg-zinc-900 p-1 border border-zinc-800">
          <button
            onClick={() => setMode('content_manager')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === 'content_manager'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Content Manager</span>
          </button>

          <button
            onClick={() => setMode('metrics_hub')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === 'metrics_hub'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Metrics Hub</span>
          </button>
        </div>

        {/* Right: Channel Switcher & Actions */}
        <div className="flex items-center space-x-3">
          {/* Timezone indicators */}
          <div className="hidden items-center space-x-2 rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-400 lg:flex">
            <Clock className="h-3 w-3 text-amber-400" />
            <span>ART (UTC-3)</span>
            <span className="text-zinc-600">|</span>
            <span>EST (UTC-5)</span>
          </div>

          {/* Active Channel Selector */}
          <div className="relative">
            <select
              value={selectedChannelId}
              onChange={(e) => setSelectedChannelId(e.target.value)}
              className="appearance-none rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 pl-3 pr-8 text-xs font-bold text-white shadow-sm transition hover:border-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id} className="bg-zinc-900 text-white">
                  {ch.name} ({ch.shortCode})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
              <Globe2 className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Add Channel Button */}
          <button
            onClick={onOpenNewChannelModal}
            title="Dar de alta nuevo canal en el Holding"
            className="flex items-center space-x-1 rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-amber-500/60 hover:text-white hover:bg-zinc-800"
          >
            <PlusCircle className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Nuevo Canal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
