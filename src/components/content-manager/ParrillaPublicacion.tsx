'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Clip, Platform, PublicationStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  Layers,
  Bot,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const ParrillaPublicacion: React.FC = () => {
  const { currentChannel, filteredClips, updateClipStatus, setContentTab } = useHolding();
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Generate 7 days starting from today (2026-10-19)
  const days = [
    { label: 'Lunes', date: '19 Oct' },
    { label: 'Martes', date: '20 Oct' },
    { label: 'Miércoles', date: '21 Oct' },
    { label: 'Jueves', date: '22 Oct' },
    { label: 'Viernes', date: '23 Oct' },
    { label: 'Sábado', date: '24 Oct' },
    { label: 'Domingo', date: '25 Oct' },
  ];

  const currentSlots = currentChannel.timeSlots;

  const autoScheduleNextSlots = () => {
    // Take pending clips and assign them to SCHEDULED
    filteredClips.forEach((clip, idx) => {
      if (idx < 4) {
        (['YOUTUBE_SHORT', 'INSTAGRAM_REEL', 'TIKTOK', 'FACEBOOK_REEL', 'X_TWITTER'] as Platform[]).forEach((p) => {
          updateClipStatus(clip.id, p, 'SCHEDULED');
        });
      }
    });
  };

  const getStatusBadge = (status: PublicationStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>PUBLICADO</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Clock className="h-2.5 w-2.5" />
            <span>PROGRAMADO</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
            <span>EN ESPERA</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="relative rounded-2xl border border-zinc-800/90 bg-[#101014] p-5 sm:p-6 backdrop-blur-xl shadow-xl overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-15 pointer-events-none -z-0"
          style={{ backgroundColor: currentChannel.accentColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${currentChannel.accentColor}25`,
                  color: currentChannel.accentColor,
                }}
              >
                GRILLA HORARIA 24/7
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {currentChannel.shortsPerDay} shorts/día • Slots: {currentSlots.join(' • ')}
              </span>
            </div>
            <h2 className="mt-1.5 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Parrilla de Publicación y Sindicación
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Planificación horaria sincronizada con el bot de Telegram y la YouTube Data API v3.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-zinc-900 p-1 border border-zinc-800 text-xs font-bold">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'calendar' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Grilla Semanal
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Lista de Cola
              </button>
            </div>

            <button
              onClick={autoScheduleNextSlots}
              className="studio-btn bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3.5 py-2 space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Auto-Asignar Slots</span>
            </button>

            <button
              onClick={() => setContentTab('telegram_bot')}
              className="studio-btn bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-2 space-x-1.5"
            >
              <Bot className="h-3.5 w-3.5 text-blue-400" />
              <span>Bot Telegram</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="space-y-4">
          {/* Day Pills Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500/80 shadow-md shadow-amber-500/10 text-white'
                      : 'bg-[#121217] border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">
                    {day.label}
                  </div>
                  <div className={`text-base font-extrabold mt-0.5 ${isSelected ? 'text-amber-400 font-mono' : 'text-white'}`}>
                    {day.date}
                  </div>
                  <div className="mt-1 text-[9px] font-mono text-zinc-400">
                    {idx === 0 ? 'Hoy' : `${currentChannel.shortsPerDay} slots`}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Time Slots for Selected Day */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Programación para {days[selectedDayIndex].label} {days[selectedDayIndex].date}
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Zona Horaria: America/Argentina/Buenos_Aires (ART)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSlots.map((slotTime, slotIdx) => {
                const assignedClip = filteredClips[slotIdx + selectedDayIndex * currentSlots.length] || null;
                const isScheduled = assignedClip && Object.values(assignedClip.platforms).some((p) => p.status === 'SCHEDULED');
                const isPublished = assignedClip && Object.values(assignedClip.platforms).some((p) => p.status === 'PUBLISHED');

                return (
                  <div
                    key={slotTime}
                    className={`rounded-xl border p-4 transition ${
                      assignedClip
                        ? 'bg-zinc-950/80 border-zinc-800/80'
                        : 'bg-zinc-950/40 border-dashed border-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center justify-center h-6 px-2 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-black border border-amber-500/20">
                          {slotTime.split(' ')[0]}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          Turno #{slotIdx + 1}
                        </span>
                      </div>

                      {assignedClip ? (
                        isPublished ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            EMITIDO
                          </span>
                        ) : isScheduled ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            PROGRAMADO POR BOT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                            LISTO EN DISCO
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-zinc-500 border border-zinc-800">
                          SLOT DISPONIBLE
                        </span>
                      )}
                    </div>

                    {assignedClip ? (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white leading-tight">
                              #{String(assignedClip.clipNumber).padStart(2, '0')} {assignedClip.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                              📁 {assignedClip.file} ({assignedClip.durationSec}s)
                            </div>
                          </div>
                        </div>

                        {/* Social Logos */}
                        <div className="flex items-center space-x-2 pt-1 border-t border-zinc-800/60">
                          <PlatformIcon platform="YOUTUBE" size={14} />
                          <PlatformIcon platform="INSTAGRAM" size={14} />
                          <PlatformIcon platform="TIKTOK" size={14} />
                          <PlatformIcon platform="FACEBOOK" size={14} />
                          <PlatformIcon platform="TWITTER" size={14} />
                          <span className="text-[10px] text-zinc-500 font-mono ml-auto">
                            Sindicación 5 redes
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col items-center justify-center py-4 text-center">
                        <p className="text-xs text-zinc-500">Ningún clip asignado a este horario.</p>
                        <button
                          onClick={autoScheduleNextSlots}
                          className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Asignar próximo clip del stock</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/60 text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800 font-mono">
                <tr>
                  <th className="py-3 px-4">Clip</th>
                  <th className="py-3 px-4">Target Slot</th>
                  <th className="py-3 px-4">Archivo .mp4</th>
                  <th className="py-3 px-4 text-center">YouTube</th>
                  <th className="py-3 px-4 text-center">Instagram</th>
                  <th className="py-3 px-4 text-center">TikTok</th>
                  <th className="py-3 px-4 text-center">Facebook</th>
                  <th className="py-3 px-4 text-center">X (Twitter)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredClips.map((clip) => (
                  <tr key={clip.id} className="hover:bg-zinc-900/50 transition">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      #{String(clip.clipNumber).padStart(2, '0')} {clip.title}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-amber-400 whitespace-nowrap">
                      {clip.platforms.YOUTUBE_SHORT.slotTime || '14:00 ART'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-zinc-500 truncate max-w-xs">
                      {clip.file}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(clip.platforms.YOUTUBE_SHORT.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(clip.platforms.INSTAGRAM_REEL.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(clip.platforms.TIKTOK.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(clip.platforms.FACEBOOK_REEL.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(clip.platforms.X_TWITTER.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
