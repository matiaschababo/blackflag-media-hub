'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Platform } from '../../types';
import {
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const ParrillaPublicacion: React.FC = () => {
  const { currentChannel, filteredClips } = useHolding();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'ALL'>('ALL');

  const platformsList: { key: Platform; label: string; color: string }[] = [
    { key: 'YOUTUBE_SHORT', label: 'YouTube Shorts', color: 'text-red-400' },
    { key: 'INSTAGRAM_REEL', label: 'Instagram Reels', color: 'text-pink-400' },
    { key: 'FACEBOOK_REEL', label: 'Facebook Reels', color: 'text-blue-400' },
    { key: 'TIKTOK', label: 'TikTok', color: 'text-cyan-400' },
    { key: 'X_TWITTER', label: 'X (Twitter)', color: 'text-sky-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Platform Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${currentChannel.accentColor}25`,
                color: currentChannel.accentColor,
              }}
            >
              SCHEDULE 24/7
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Slots Oficiales: {currentChannel.timeSlots.join(' | ')}
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
            Parrilla de Sindicación Multi-Plataforma
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Despacho coordinado y autónomo a través de APIs oficiales a costo $0.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 rounded-xl bg-zinc-950 p-1 border border-zinc-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedPlatform('ALL')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition whitespace-nowrap ${
              selectedPlatform === 'ALL'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todas
          </button>
          {platformsList.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPlatform(p.key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition whitespace-nowrap ${
                selectedPlatform === p.key
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Scheduled / Published Items */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 font-mono">
              <tr>
                <th className="py-3 px-4">Clip</th>
                <th className="py-3 px-4">Horario / Slot</th>
                <th className="py-3 px-4">Gancho (0:03s)</th>
                <th className="py-3 px-4 text-center">YouTube</th>
                <th className="py-3 px-4 text-center">Instagram</th>
                <th className="py-3 px-4 text-center">Facebook</th>
                <th className="py-3 px-4 text-center">TikTok</th>
                <th className="py-3 px-4 text-center">X / Twitter</th>
                <th className="py-3 px-4 text-right">Links en Vivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredClips.map((clip) => {
                return (
                  <tr key={clip.id} className="hover:bg-zinc-800/20 transition">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-[11px] font-mono font-bold text-amber-400">
                          #{clip.clipNumber}
                        </span>
                        <span className="max-w-[180px] truncate">{clip.title}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 rounded bg-zinc-950 px-2 py-0.5 border border-zinc-800">
                        <Clock className="h-3 w-3 text-amber-400" />
                        <span>{clip.platforms.YOUTUBE_SHORT.slotTime || '14:00 ART'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate text-[11px]">
                      &ldquo;{clip.hook}&rdquo;
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          clip.platforms.YOUTUBE_SHORT.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : clip.platforms.YOUTUBE_SHORT.status === 'SCHEDULED'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {clip.platforms.YOUTUBE_SHORT.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          clip.platforms.INSTAGRAM_REEL.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : clip.platforms.INSTAGRAM_REEL.status === 'SCHEDULED'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {clip.platforms.INSTAGRAM_REEL.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          clip.platforms.FACEBOOK_REEL.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : clip.platforms.FACEBOOK_REEL.status === 'SCHEDULED'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {clip.platforms.FACEBOOK_REEL.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          clip.platforms.TIKTOK.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : clip.platforms.TIKTOK.status === 'SCHEDULED'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {clip.platforms.TIKTOK.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          clip.platforms.X_TWITTER.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : clip.platforms.X_TWITTER.status === 'SCHEDULED'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {clip.platforms.X_TWITTER.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {clip.platforms.YOUTUBE_SHORT.url ? (
                        <a
                          href={clip.platforms.YOUTUBE_SHORT.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 rounded bg-zinc-800 px-2 py-1 text-[10px] font-medium text-emerald-400 hover:bg-zinc-700 transition"
                        >
                          <span>Ver Short</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
