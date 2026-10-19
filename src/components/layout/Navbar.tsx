'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Film,
  BarChart3,
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0a0a0d]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Broadcast Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${currentChannel.accentColor}, #78350f)`,
              boxShadow: `0 4px 18px ${currentChannel.accentColor}33`,
            }}
          >
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-400">
                HOLDING MEDIA HUB
              </span>
              <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>{channels.length} CANALES ACTIVOS</span>
              </span>
            </div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>Empresa Contenido Digital</span>
            </h1>
          </div>
        </div>

        {/* Center: Dual-Mode Switcher (Content Manager vs Metrics Hub) */}
        <div className="flex items-center rounded-2xl bg-zinc-900/90 p-1 border border-zinc-800/80 shadow-inner">
          <button
            onClick={() => setMode('content_manager')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              mode === 'content_manager'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Content Manager</span>
          </button>

          <button
            onClick={() => setMode('metrics_hub')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
              mode === 'metrics_hub'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Metrics Hub</span>
          </button>
        </div>

        {/* Right: Visible Multi-Channel Selector Pills (Mix On style) */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800">
            {channels.map((ch) => {
              const isSelected = selectedChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  title={`Cambiar al canal ${ch.name}`}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'text-white shadow-lg'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${ch.accentColor}25`,
                          color: ch.accentColor,
                          border: `1.5px solid ${ch.accentColor}80`,
                          boxShadow: `0 0 14px -2px ${ch.accentColor}40`,
                        }
                      : { border: '1.5px solid transparent' }
                  }
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: ch.accentColor }}
                  ></span>
                  <span className="hidden sm:inline">{ch.name}</span>
                  <span className="font-mono text-[10px]">{ch.shortCode}</span>
                </button>
              );
            })}
          </div>

          {/* New Channel Button */}
          <button
            onClick={onOpenNewChannelModal}
            title="Dar de alta nuevo canal en el Holding"
            className="flex items-center space-x-1 rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white hover:border-amber-500/60 cursor-pointer active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Nuevo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
