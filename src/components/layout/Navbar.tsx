'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Film,
  BarChart3,
  PlusCircle,
  ChevronDown,
  Check,
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
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Clean Channel Dropdown */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-7 w-7 rounded-lg object-cover border border-[#2a2e39]"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-[#1e2129] bg-[#13151a] hover:border-[#2c313d] hover:bg-[#181b21] transition cursor-pointer text-left"
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-[#848d97] font-medium">Canal:</span>
                <span className="text-xs font-bold text-[#f0f2f5] truncate max-w-[160px]">
                  {currentChannel.name}
                </span>
              </div>
              <ChevronDown
                className={`h-3 w-3 text-[#848d97] transition-transform duration-150 ${
                  isDropdownOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 z-50 rounded-xl border border-[#262a34] bg-[#13151a] p-1.5 shadow-2xl">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#848d97] border-b border-[#1e2129] mb-1">
                  Canales del holding
                </div>

                <div className="space-y-0.5">
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

                <div className="mt-1 pt-1 border-t border-[#1e2129]">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenNewChannelModal();
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg text-xs font-medium text-[#848d97] hover:text-white hover:bg-[#181b21] transition cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Dar de alta canal</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isDbConnected && (
            <div className="hidden lg:flex items-center space-x-1.5 px-2 py-1 rounded-md border border-[#1e2129] bg-[#13151a] text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span className="text-[#848d97] font-mono text-[10px]">DB</span>
              <span className="text-[#f0f2f5] font-medium">Supabase</span>
            </div>
          )}
        </div>

        {/* Center: Neutral Segmented Control (Zero Gradient Slop) */}
        <div className="flex items-center rounded-lg bg-[#13151a] p-0.5 border border-[#1e2129]">
          <button
            onClick={() => setMode('content_manager')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1 text-xs font-medium transition cursor-pointer ${
              mode === 'content_manager'
                ? 'bg-[#22262f] text-white font-semibold'
                : 'text-[#848d97] hover:text-white'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Content Manager</span>
          </button>

          <button
            onClick={() => setMode('metrics_hub')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1 text-xs font-medium transition cursor-pointer ${
              mode === 'metrics_hub'
                ? 'bg-[#22262f] text-white font-semibold'
                : 'text-[#848d97] hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Metrics Hub</span>
          </button>
        </div>

        {/* Right: Clean Channel Switcher Pills */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 bg-[#13151a] p-0.5 rounded-lg border border-[#1e2129]">
            {channels.map((ch) => {
              const isSelected = selectedChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  title={`Cambiar a ${ch.name}`}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#22262f] text-white font-semibold'
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

          <button
            onClick={onOpenNewChannelModal}
            title="Dar de alta nuevo canal"
            className="flex items-center space-x-1 rounded-lg border border-[#1e2129] bg-[#13151a] px-2.5 py-1 text-xs font-medium text-[#848d97] hover:text-white hover:border-[#2c313d] transition cursor-pointer"
          >
            <PlusCircle className="h-3 w-3" />
            <span className="hidden md:inline">Nuevo</span>
          </button>
        </div>
      </div>
    </header>
  );
};