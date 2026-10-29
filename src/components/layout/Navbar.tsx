'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { AppMode } from '../../types';
import {
  ChevronDown,
  Layers,
  Database,
  Tv,
  Share2,
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
    isDbConnected,
    allClips,
    copyShareLink,
  } = useHolding();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-50 w-full border-b border-[#1e2129] bg-[#0b0c0e]">
      <div className="mx-auto flex h-14 max-w-[1640px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Clean Channel Dropdown */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-8 w-8 rounded-lg object-cover border border-[#2a2e39]"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[#1e2129] bg-[#13151a] hover:border-[#2c313d] hover:bg-[#181b21] transition cursor-pointer text-left"
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-[#848d97] font-medium hidden sm:inline">Canal:</span>
                <span className="text-sm font-bold text-[#f0f2f5] truncate max-w-[180px]">
                  {currentChannel.name}
                </span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#848d97] transition-transform duration-150 ${
                  isDropdownOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 z-50 rounded-xl border border-[#262a34] bg-[#13151a] p-1.5 shadow-2xl">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#848d97] border-b border-[#1e2129] mb-1">
                  Canales del holding
                </div>

                <div className="space-y-0.5">
                  {/* Option: Todos los Canales */}
                  <button
                    onClick={() => {
                      setSelectedChannelId('all');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer ${
                      selectedChannelId === 'all'
                        ? 'bg-[#1e2129] text-white'
                        : 'text-[#848d97] hover:bg-[#181b21] hover:text-[#f0f2f5]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="h-6 w-6 rounded-md bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold text-sky-400 shrink-0">
                        ALL
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-white truncate">
                          Todos los Canales
                        </div>
                        <div className="text-[10px] text-[#848d97] truncate">
                          Stock global ({allClips.length} clips)
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Individual Channels */}
                  {channels.map((ch) => {
                    const isSelected = selectedChannelId === ch.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedChannelId(ch.id);
                          setIsDropdownOpen(false);
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
                            className="h-6 w-6 rounded-md object-cover border border-[#2a2e39] shrink-0"
                          />
                          <div className="overflow-hidden">
                            <div className="text-xs font-semibold text-[#f0f2f5] truncate">
                              {ch.name}
                            </div>
                            <div className="text-[10px] text-[#848d97] truncate">
                              {ch.niche}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-1 pt-1 border-t border-[#1e2129]">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenNewChannelModal();
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg text-xs font-medium text-[#848d97] hover:text-white hover:bg-[#181b21] transition cursor-pointer"
                  >
                    + Agregar canal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean Functional Navigation Mode Switcher */}
        <div className="flex items-center space-x-1 bg-[#13151a] p-1 rounded-lg border border-[#1e2129]">
          <button
            onClick={() => setMode('content_manager')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              mode === 'content_manager'
                ? 'bg-[#1e2129] text-[#f0f2f5] font-bold shadow-sm'
                : 'text-[#848d97] hover:text-[#f0f2f5]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span className="text-xs">Content Manager</span>
          </button>

          <button
            onClick={() => setMode('metrics_hub')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              mode === 'metrics_hub'
                ? 'bg-[#1e2129] text-[#f0f2f5] font-bold shadow-sm'
                : 'text-[#848d97] hover:text-[#f0f2f5]'
            }`}
          >
            <Tv className="h-4 w-4" />
            <span className="text-xs">Metrics Hub</span>
          </button>
        </div>

        {/* Right: Share View + DB Status + New Channel */}
        <div className="flex items-center space-x-2.5">
          {/* Share View Button (One-click share for teammates) */}
          <button
            onClick={copyShareLink}
            title="Copiar enlace directo de esta pestaña para compartir con tu equipo"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#262a34] bg-[#16181e] text-xs font-semibold text-sky-400 hover:text-white hover:border-sky-500/40 hover:bg-[#1f232b] transition cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">Compartir vista</span>
          </button>

          {/* Live Supabase indicator badge */}
          <div
            title={isDbConnected ? "Conectado en vivo a Supabase PostgreSQL" : "Modo local / fallback"}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition bg-[#101914] border-emerald-500/30 text-emerald-400"
          >
            <Database className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden md:inline text-xs font-medium">Supabase DB</span>
          </div>

          <button
            onClick={onOpenNewChannelModal}
            title="Dar de alta nuevo canal en el holding"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-[#1e2129] bg-[#13151a] text-xs font-medium text-[#848d97] hover:border-[#2c313d] hover:text-white transition cursor-pointer"
          >
            <span className="text-sm leading-none">+</span>
            <span className="hidden lg:inline">Nuevo Canal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
