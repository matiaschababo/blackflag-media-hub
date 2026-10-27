'use client';

import React, { useState } from 'react';
import { Clip, Platform } from '../../types';
import { useHolding } from '../../context/HoldingContext';
import {
  X,
  Copy,
  Check,
  Smartphone,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

interface ClipDetailModalProps {
  clip: Clip | null;
  onClose: () => void;
}

export const ClipDetailModal: React.FC<ClipDetailModalProps> = ({ clip, onClose }) => {
  const { currentChannel, triggerRippleShift } = useHolding();
  const [activeTab, setActiveTab] = useState<'instagram' | 'facebook' | 'x' | 'youtube'>('instagram');
  const [copied, setCopied] = useState(false);

  if (!clip) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCopyText = () => {
    switch (activeTab) {
      case 'instagram':
        return clip.captions.instagram;
      case 'facebook':
        return clip.captions.facebook;
      case 'x':
        return clip.captions.x;
      case 'youtube':
        return clip.captions.youtube;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-black font-mono text-xs">
              #{clip.clipNumber}
            </span>
            <div>
              <h3 className="text-base font-bold text-white sm:text-lg">{clip.title}</h3>
              <p className="text-xs text-zinc-400 font-mono">
                {clip.file} • {clip.durationSec}s • Timestamps: {clip.timestamps.start} - {clip.timestamps.end}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 2-Column: Left = Mobile 9:16 Safe Zone Simulator, Right = Copy & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Mobile 9:16 Simulator (4 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="text-[11px] font-mono text-zinc-400 font-semibold mb-2 flex items-center space-x-1.5">
              <Smartphone className="h-3.5 w-3.5 text-amber-400" />
              <span>Safe Zone 9:16</span>
            </div>

            {/* Phone Body */}
            <div className="relative w-56 aspect-[9/16] rounded-3xl border-4 border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col justify-between p-3 select-none">
              {/* Top status bar simulation */}
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 border-b border-zinc-800/40 pb-1">
                <span>{currentChannel.name.split(' ')[0]}</span>
                <span className="text-amber-400 font-bold">60 FPS</span>
              </div>

              {/* Center: Dynamic Subtitle Safe Zone (`MarginV=720`) */}
              <div className="space-y-2 text-center my-auto px-2">
                <div
                  className="rounded-lg px-2.5 py-1.5 text-xs font-black tracking-wide shadow-md"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: currentChannel.accentColor,
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  &ldquo;{clip.hook.slice(0, 50)}...&rdquo;
                </div>
                <div className="text-[9px] font-mono text-zinc-400">
                  ASS Subtitle • MarginV=720
                </div>
              </div>

              {/* Bottom: Simulated TikTok/Reels UI overlay */}
              <div className="border-t border-zinc-800/60 pt-2 space-y-1">
                <div className="text-[9px] font-bold text-white truncate">
                  @{currentChannel.name.replace(/\s+/g, '').toLowerCase()}
                </div>
                <div className="text-[8px] text-zinc-400 truncate">
                  {clip.title} #fyp #viral
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy & Metadata (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            {/* Tab Switcher with Official Platform Icons */}
            <div className="flex items-center space-x-1 rounded-xl bg-zinc-900 p-1 border border-zinc-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('instagram')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'instagram' ? 'bg-pink-600/25 text-pink-400 border border-pink-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PlatformIcon platform="INSTAGRAM" size={14} />
                <span>Instagram</span>
              </button>
              <button
                onClick={() => setActiveTab('facebook')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'facebook' ? 'bg-blue-600/25 text-blue-400 border border-blue-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PlatformIcon platform="FACEBOOK" size={14} />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => setActiveTab('x')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'x' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PlatformIcon platform="TWITTER" size={14} />
                <span>X</span>
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'youtube' ? 'bg-red-600/25 text-red-400 border border-red-500/40' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PlatformIcon platform="YOUTUBE" size={14} />
                <span>YouTube</span>
              </button>
            </div>

            {/* Copy Content Box */}
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 min-h-[220px]">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="font-medium text-white">Copy</span>
                <button
                  onClick={() => handleCopy(getCopyText())}
                  className="inline-flex items-center space-x-1 rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-700 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                value={getCopyText()}
                className="w-full h-44 rounded-xl bg-zinc-950 p-3 text-xs text-zinc-200 font-mono border border-zinc-800/80 resize-none focus:outline-none"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  triggerRippleShift(clip.id);
                  onClose();
                }}
                className="app-button app-button-primary text-xs flex items-center space-x-1.5"
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Despachar turno</span>
              </button>

              <button
                onClick={onClose}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
