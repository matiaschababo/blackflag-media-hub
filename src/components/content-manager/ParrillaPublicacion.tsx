'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Platform } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const ParrillaPublicacion: React.FC = () => {
  const { currentChannel, filteredClips, updateClipStatus } = useHolding();
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Explicit slot assignment map: key is `${dayIdx}-${slotIdx}`, value is clipId or null
  const [slotAssignments, setSlotAssignments] = useState<Record<string, string | null>>({});

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
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={currentChannel.avatarUrl || '/channels/blackflag-logo.png'}
              alt={currentChannel.name}
              className="h-10 w-10 rounded-lg object-cover border border-[#2a2e39] shrink-0"
            />
            <div>
              <div className="text-xs text-[#848d97]">
                {currentChannel.name} • {currentChannel.shortsPerDay} shorts/día • Slots: {currentSlots.join(' • ')}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Parrilla de Publicación y Sindicación
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg bg-[#0b0c0e] p-0.5 border border-[#1e2129] text-xs">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  viewMode === 'calendar' ? 'bg-[#1e2129] text-white font-semibold' : 'text-[#848d97] hover:text-white'
                }`}
              >
                Grilla semanal
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#1e2129] text-white font-semibold' : 'text-[#848d97] hover:text-white'
                }`}
              >
                Lista de cola
              </button>
            </div>

            <button
              onClick={handleAutoSchedule}
              className="app-button app-button-secondary text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              <span>Auto-asignar slots</span>
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
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#181b21] border-[#383d4a] text-white font-semibold'
                      : 'bg-[#13151a] border-[#1e2129] text-[#848d97] hover:border-[#2a2e38] hover:text-[#f0f2f5]'
                  }`}
                >
                  <div className="text-[10px] text-[#848d97]">
                    {day.label}
                  </div>
                  <div className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-[#f0f2f5]'}`}>
                    {day.date}
                  </div>
                  <div className="mt-1 text-[10px] tabular-nums">
                    {slotsAssignedForDay > 0 ? (
                      <span className="text-white font-medium">{slotsAssignedForDay}/{currentChannel.shortsPerDay}</span>
                    ) : (
                      <span className="text-[#848d97]">0/{currentChannel.shortsPerDay}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Time Slots for Selected Day */}
          <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2129] pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-[#848d97]" />
                <h3 className="text-xs font-semibold text-white">
                  Turnos para {days[selectedDayIndex].label} {days[selectedDayIndex].date}
                </h3>
              </div>
              <span className="text-xs text-[#848d97]">
                America/Argentina/Buenos_Aires (ART)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSlots.map((slotTime, slotIdx) => {
                const assignedClipId = slotAssignments[`${selectedDayIndex}-${slotIdx}`];
                const assignedClip = assignedClipId
                  ? filteredClips.find((c) => c.id === assignedClipId)
                  : null;

                return (
                  <div
                    key={slotTime}
                    className={`rounded-lg border p-4 transition ${
                      assignedClip
                        ? 'bg-[#16181e] border-[#262a34]'
                        : 'bg-[#0f1013] border-dashed border-[#1e2129]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-[#1e2129] text-white text-xs font-semibold tabular-nums">
                          {slotTime.split(' ')[0]} ART
                        </span>
                        <span className="text-xs text-[#848d97]">
                          Turno #{slotIdx + 1}
                        </span>
                      </div>

                      {assignedClip ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
                            Programado
                          </span>
                          <button
                            onClick={() => handleRemoveAssignment(selectedDayIndex, slotIdx, assignedClip.id)}
                            title="Desasignar slot"
                            className="p-1 rounded hover:bg-[#22262f] text-[#848d97] hover:text-white transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#848d97]">
                          Disponible
                        </span>
                      )}
                    </div>

                    {assignedClip ? (
                      <div className="mt-3 space-y-2 pt-2 border-t border-[#1e2129]">
                        <div>
                          <div className="text-xs font-semibold text-white leading-tight">
                            #{String(assignedClip.clipNumber).padStart(2, '0')} {assignedClip.title}
                          </div>
                          <div className="text-[11px] text-[#848d97] mt-1 tabular-nums">
                            {assignedClip.file} • {assignedClip.durationSec}s
                          </div>
                        </div>

                        {/* Social Logos */}
                        <div className="flex items-center space-x-2 pt-2 border-t border-[#1e2129]">
                          <PlatformIcon platform="YOUTUBE" size={13} />
                          <PlatformIcon platform="INSTAGRAM" size={13} />
                          <PlatformIcon platform="TIKTOK" size={13} />
                          <PlatformIcon platform="FACEBOOK" size={13} />
                          <PlatformIcon platform="TWITTER" size={13} />
                          <span className="text-[10px] text-[#848d97] ml-auto">
                            5 redes
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-col items-center justify-center py-4 text-center">
                        <Clock className="h-5 w-5 text-[#848d97] mb-1" />
                        <span className="text-xs text-[#848d97]">Sin programar</span>
                        <button
                          onClick={() => handleAssignSingleSlot(selectedDayIndex, slotIdx)}
                          className="mt-2 text-xs font-medium text-white hover:text-[#848d97] flex items-center space-x-1 py-1 px-2.5 rounded border border-[#1e2129] bg-[#16181e] hover:bg-[#1e2129] transition cursor-pointer"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span>Asignar clip</span>
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
        <div className="rounded-xl border border-[#1e2129] bg-[#13151a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1e2129] text-[11px] text-[#848d97] font-medium">
                  <th className="py-2.5 px-3">Clip</th>
                  <th className="py-2.5 px-3">Archivo</th>
                  <th className="py-2.5 px-3 text-center">YouTube</th>
                  <th className="py-2.5 px-3 text-center">Instagram</th>
                  <th className="py-2.5 px-3 text-center">TikTok</th>
                  <th className="py-2.5 px-3 text-center">Facebook</th>
                  <th className="py-2.5 px-3 text-center">X (Twitter)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2129]">
                {filteredClips.map((clip) => (
                  <tr key={clip.id} className="hover:bg-[#181b21] transition">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      #{String(clip.clipNumber).padStart(2, '0')} {clip.title}
                    </td>
                    <td className="py-2.5 px-3 text-[#848d97] text-[11px] truncate max-w-xs">
                      {clip.file}
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${clip.platforms.YOUTUBE_SHORT.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.YOUTUBE_SHORT.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-[#848d97]'}`}>
                        {clip.platforms.YOUTUBE_SHORT.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${clip.platforms.INSTAGRAM_REEL.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.INSTAGRAM_REEL.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-[#848d97]'}`}>
                        {clip.platforms.INSTAGRAM_REEL.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${clip.platforms.TIKTOK.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.TIKTOK.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-[#848d97]'}`}>
                        {clip.platforms.TIKTOK.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${clip.platforms.FACEBOOK_REEL.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.FACEBOOK_REEL.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-[#848d97]'}`}>
                        {clip.platforms.FACEBOOK_REEL.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${clip.platforms.X_TWITTER.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : clip.platforms.X_TWITTER.status === 'SCHEDULED' ? 'text-amber-400 bg-amber-500/10' : 'text-[#848d97]'}`}>
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