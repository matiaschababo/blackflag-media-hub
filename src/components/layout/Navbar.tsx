'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Film,
  BarChart3,
  PlusCircle,
  ChevronDown,
  Check,
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090c]/95 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Prominent Channel Switcher Dropdown */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative group shrink-0">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover border border-white/20 shadow-xl transition-transform duration-200 group-hover:scale-105"
              style={{
                boxShadow: `0 4px 18px ${currentChannel.accentColor}33`,
              }}
            />
            <span
              className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#09090c] shadow-sm flex items-center justify-center"
              style={{ backgroundColor: currentChannel.accentColor }}
            />
          </div>

          {/* Interactive Channel Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-zinc-800/90 bg-[#121217] hover:border-zinc-700 hover:bg-zinc-800/60 transition cursor-pointer group"
            >
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    CANAL:
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-400 transition truncate max-w-[140px] sm:max-w-[200px]">
                    {currentChannel.name}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 group-hover:text-white ${
                  isDropdownOpen ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 z-50 rounded-2xl border border-zinc-700/80 bg-[#14141c] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                  <span>CANALES DEL HOLDING</span>
                  <span className="text-amber-400">{channels.length} CANALES</span>
                </div>

                <div className="space-y-1">
                  {channels.map((ch) => {
                    const isSelected = selectedChannelId === ch.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedChannelId(ch.id);
                          setIsDropdownOpen(false);
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

                <div className="mt-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenNewChannelModal();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-amber-400 border border-zinc-800 transition cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Dar de Alta Nuevo Canal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Dual-Mode Switcher */}
        <div className="flex items-center rounded-2xl bg-[#121217] p-1 border border-zinc-800/90 shadow-inner">
          <button
            onClick={() => setMode('content_manager')}
            className={`flex items-center space-x-2 rounded-xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
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
            className={`flex items-center space-x-2 rounded-xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
              mode === 'metrics_hub'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Metrics Hub</span>
          </button>
        </div>

        {/* Right: Quick Channel Pills + New Channel CTA */}
        <div className="hidden sm:flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-[#121217] p-1 rounded-2xl border border-zinc-800/90">
            {channels.map((ch) => {
              const isSelected = selectedChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  title={`Cambiar al canal ${ch.name}`}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
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
                    className="h-4 w-4 rounded-full object-cover border border-white/20 shrink-0"
                  />
                  <span className="font-mono text-[10px]">{ch.shortCode}</span>
                </button>
              );
            })}
          </div>

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