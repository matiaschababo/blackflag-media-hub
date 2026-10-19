'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Film,
  BarChart3,
  PlusCircle,
  Radio,
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090c]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Channel Active Avatar */}
        <div className="flex items-center space-x-3.5 shrink-0">
          <div className="relative group">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-10 w-10 rounded-xl object-cover border border-white/15 shadow-xl transition-transform duration-200 group-hover:scale-105"
              style={{
                boxShadow: `0 4px 18px ${currentChannel.accentColor}33`,
              }}
            />
            <span
              className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#09090c] shadow-sm flex items-center justify-center"
              style={{ backgroundColor: currentChannel.accentColor }}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-zinc-400">
                MEDIA HOLDING STUDIO
              </span>
              <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>{channels.length} CANALES</span>
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>{currentChannel.name}</span>
            </h1>
          </div>
        </div>

        {/* Center: Dual-Mode Switcher */}
        <div className="flex items-center rounded-2xl bg-[#121217] p-1 border border-zinc-800/90 shadow-inner">
          <button
            onClick={() => setMode('content_manager')}
            className={`flex items-center space-x-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
              mode === 'content_manager'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Content Manager</span>
          </button>

          <button
            onClick={() => setMode('metrics_hub')}
            className={`flex items-center space-x-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
              mode === 'metrics_hub'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Metrics Hub</span>
          </button>
        </div>

        {/* Right: Channel Switcher with Official Logos */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-[#121217] p-1 rounded-2xl border border-zinc-800/90">
            {channels.map((ch) => {
              const isSelected = selectedChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  title={`Cambiar al canal ${ch.name}`}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'text-white shadow-lg'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${ch.accentColor}25`,
                          color: ch.accentColor,
                          border: `1.5px solid ${ch.accentColor}90`,
                          boxShadow: `0 0 16px -2px ${ch.accentColor}35`,
                        }
                      : { border: '1.5px solid transparent' }
                  }
                >
                  <img
                    src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                    alt={ch.name}
                    className="h-5 w-5 rounded-full object-cover border border-white/20 shrink-0"
                  />
                  <span className="hidden md:inline">{ch.name}</span>
                  <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-black/40">
                    {ch.shortCode}
                  </span>
                </button>
              );
            })}
          </div>

          {/* New Channel Button */}
          <button
            onClick={onOpenNewChannelModal}
            title="Dar de alta nuevo canal en el Holding"
            className="flex items-center space-x-1 rounded-xl border border-zinc-800 bg-[#14141a] px-2.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white hover:border-amber-500/60 cursor-pointer active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden lg:inline">Nuevo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
