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
  Send,
  X,
  ExternalLink,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const ParrillaPublicacion: React.FC = () => {
  const { currentChannel, filteredClips, updateClipStatus, setContentTab } = useHolding();
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Explicit slot assignment map: key is `${dayIdx}-${slotIdx}`, value is clipId or null
  const [slotAssignments, setSlotAssignments] = useState<Record<string, string | null>>({});

  // 7 days starting from today (2026-10-19)
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

  // Auto-schedule available virgin stock into empty slots
  const handleAutoSchedule = () => {
    const newAssignments = { ...slotAssignments };
    const virginClips = filteredClips.filter(
      (c) => !Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
    );

    let clipPointer = 0;
    days.forEach((_, dIdx) => {
      currentSlots.forEach((_, sIdx) => {
        const slotKey = `${dIdx}-${sIdx}`;
        if (!newAssignments[slotKey] && clipPointer < virginClips.length) {
          const clip = virginClips[clipPointer];
          newAssignments[slotKey] = clip.id;
          // Update clip platforms to SCHEDULED
          (['YOUTUBE_SHORT', 'INSTAGRAM_REEL', 'TIKTOK', 'FACEBOOK_REEL', 'X_TWITTER'] as Platform[]).forEach((p) => {
            updateClipStatus(clip.id, p, 'SCHEDULED');
          });
          clipPointer++;
        }
      });
    });

    setSlotAssignments(newAssignments);
  };

  const handleAssignSingleSlot = (dayIdx: number, slotIdx: number) => {
    const slotKey = `${dayIdx}-${slotIdx}`;
    const unassignedClip = filteredClips.find(
      (c) =>
        !Object.values(slotAssignments).includes(c.id) &&
        !Object.values(c.platforms).some((p) => p.status === 'PUBLISHED')
    );

    if (unassignedClip) {
      setSlotAssignments((prev) => ({ ...prev, [slotKey]: unassignedClip.id }));
      (['YOUTUBE_SHORT', 'INSTAGRAM_REEL', 'TIKTOK', 'FACEBOOK_REEL', 'X_TWITTER'] as Platform[]).forEach((p) => {
        updateClipStatus(unassignedClip.id, p, 'SCHEDULED');
      });
    }
  };

  const handleRemoveAssignment = (dayIdx: number, slotIdx: number, clipId: string) => {
    const slotKey = `${dayIdx}-${slotIdx}`;
    setSlotAssignments((prev) => {
      const copy = { ...prev };
      delete copy[slotKey];
      return copy;
    });
    (['YOUTUBE_SHORT', 'INSTAGRAM_REEL', 'TIKTOK', 'FACEBOOK_REEL', 'X_TWITTER'] as Platform[]).forEach((p) => {
      updateClipStatus(clipId, p, 'PENDING');
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card with Channel Logo & Real Cadence */}
      <div className="relative rounded-2xl border border-zinc-800/90 bg-[#101014] p-5 sm:p-6 backdrop-blur-xl shadow-xl overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-15 pointer-events-none -z-0"
          style={{ backgroundColor: currentChannel.accentColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-12 w-12 rounded-xl object-cover border border-white/20 shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${currentChannel.accentColor}25`,
                    color: currentChannel.accentColor,
                  }}
                >
                  {currentChannel.name}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {currentChannel.shortsPerDay} shorts/día • Slots: {currentSlots.join(' • ')}
                </span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Parrilla de Publicación y Sindicación
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Planificación horaria real. Los slots vacíos permanecen disponibles hasta que asignes material.
              </p>
            </div>
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
              onClick={handleAutoSchedule}
              className="studio-btn bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3.5 py-2 space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Auto-Asignar Slots</span>
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
              const slotsAssignedForDay = currentSlots.filter(
                (_, sIdx) => !!slotAssignments[`${idx}-${sIdx}`]
              ).length;

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
                  <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400">
                    {day.label}
                  </div>
                  <div className={`text-base font-extrabold mt-0.5 ${isSelected ? 'text-amber-400 font-mono' : 'text-white'}`}>
                    {day.date}
                  </div>
                  <div className="mt-1 text-[9px] font-mono">
                    {slotsAssignedForDay > 0 ? (
                      <span className="text-amber-400 font-bold">{slotsAssignedForDay}/{currentChannel.shortsPerDay} asignados</span>
                    ) : (
                      <span className="text-zinc-400">Libre (0/{currentChannel.shortsPerDay})</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Time Slots for Selected Day */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Horarios para {days[selectedDayIndex].label} {days[selectedDayIndex].date}
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Zona Horaria: America/Argentina/Buenos_Aires (ART)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSlots.map((slotTime, slotIdx) => {
                const assignedClipId = slotAssignments[`${selectedDayIndex}-${slotIdx}`];
                const assignedClip = assignedClipId
                  ? filteredClips.find((c) => c.id === assignedClipId)
                  : null;

                return (
                  <div
                    key={slotTime}
                    className={`rounded-2xl border p-4.5 transition-all ${
                      assignedClip
                        ? 'bg-[#16161e] border-zinc-700/80 shadow-md'
                        : 'bg-black/30 border-dashed border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
                          alt={currentChannel.name}
                          className="h-5 w-5 rounded-md object-cover border border-white/20"
                        />
                        <span className="flex items-center justify-center h-6 px-2.5 rounded-lg bg-amber-500/10 text-amber-400 font-mono text-xs font-black border border-amber-500/20">
                          {slotTime.split(' ')[0]} ART
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          Turno #{slotIdx + 1}
                        </span>
                      </div>

                      {assignedClip ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            PROGRAMADO
                          </span>
                          <button
                            onClick={() => handleRemoveAssignment(selectedDayIndex, slotIdx, assignedClip.id)}
                            title="Desasignar slot"
                            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800">
                          SLOT DISPONIBLE (Sin Programar)
                        </span>
                      )}
                    </div>

                    {assignedClip ? (
                      <div className="mt-3 space-y-2.5 pt-2 border-t border-zinc-800/60">
                        <div>
                          <div className="text-xs font-extrabold text-white leading-tight">
                            #{String(assignedClip.clipNumber).padStart(2, '0')} {assignedClip.title}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono mt-1 flex items-center gap-2">
                            <span>📁 {assignedClip.file}</span>
                            <span>•</span>
                            <span>{assignedClip.durationSec}s</span>
                          </div>
                        </div>

                        {/* Social Logos */}
                        <div className="flex items-center space-x-2 pt-2 border-t border-zinc-800/60">
                          <PlatformIcon platform="YOUTUBE" size={15} />
                          <PlatformIcon platform="INSTAGRAM" size={15} />
                          <PlatformIcon platform="TIKTOK" size={15} />
                          <PlatformIcon platform="FACEBOOK" size={15} />
                          <PlatformIcon platform="TWITTER" size={15} />
                          <span className="text-[10px] text-zinc-400 font-mono ml-auto">
                            Sindicación 5 redes
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col items-center justify-center py-5 text-center">
                        <Clock className="h-6 w-6 text-zinc-600 mb-1" />
                        <p className="text-xs text-zinc-400">Sin clip programado para este turno.</p>
                        <button
                          onClick={() => handleAssignSingleSlot(selectedDayIndex, slotIdx)}
                          className="mt-2.5 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 py-1 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Asignar Clip de Stock</span>
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
        <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/60 text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800 font-mono">
                <tr>
                  <th className="py-3 px-4">Clip</th>
                  <th className="py-3 px-4">Canal</th>
                  <th className="py-3 px-4">Archivo .mp4</th>
                  <th className="py-3 px-4 text-center">YouTube</th>
                  <th className="py-3 px-4 text-center">Instagram</th>
                  <th className="py-3 px-4 text-center">TikTok</th>
                  <th className="py-3 px-4 text-center">Facebook</th>
                  <th className="py-3 px-4 text-center">X (Twitter)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {filteredClips.map((clip) => (
                  <tr key={clip.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 font-sans font-bold text-white">
                      #{String(clip.clipNumber).padStart(2, '0')} {clip.title}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <img
                          src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
                          alt={currentChannel.name}
                          className="h-4 w-4 rounded-md object-cover"
                        />
                        <span className="text-[11px] font-sans font-medium">{currentChannel.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px] truncate max-w-xs">
                      {clip.file}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${clip.platforms.YOUTUBE_SHORT.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.YOUTUBE_SHORT.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 bg-zinc-900'}`}>
                        {clip.platforms.YOUTUBE_SHORT.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${clip.platforms.INSTAGRAM_REEL.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.INSTAGRAM_REEL.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 bg-zinc-900'}`}>
                        {clip.platforms.INSTAGRAM_REEL.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${clip.platforms.TIKTOK.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.TIKTOK.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 bg-zinc-900'}`}>
                        {clip.platforms.TIKTOK.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${clip.platforms.FACEBOOK_REEL.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.FACEBOOK_REEL.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 bg-zinc-900'}`}>
                        {clip.platforms.FACEBOOK_REEL.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${clip.platforms.X_TWITTER.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.X_TWITTER.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-400 bg-zinc-900'}`}>
                        {clip.platforms.X_TWITTER.status}
                      </span>
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