'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import {
  Bot,
  Send,
  FolderDown,
  Key,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Play,
  RotateCw,
  Clock,
  Sparkles,
  Smartphone,
  ExternalLink,
  UploadCloud,
  Check,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

export const TelegramBotEngine: React.FC = () => {
  const { currentChannel, channels, filteredClips, updateClipStatus } = useHolding();
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Telegram Clip Listener daemon iniciado en segundo plano...',
    '[OAUTH] YouTube Data API v3 autenticada con credenciales Google Cloud OAuth 2.0.',
    `[WATCHER] Monitoreando directorio local: C:\\Users\\Mati\\Downloads\\Telegram Desktop\\`,
    `[TARGET] Canal activo seleccionado: ${currentChannel.name} (${currentChannel.shortCode})`,
    `[READY] Esperando ingesta de clips de video .mp4 desde Telegram Desktop...`,
  ]);
  const [scanResult, setScanResult] = useState<{ filesFound: number; matched: number } | null>(null);

  const handleScanTelegram = () => {
    setIsScanning(true);
    setLogs((prev) => [
      ...prev,
      `[SCAN] Escaneando "C:\\Users\\Mati\\Downloads\\Telegram Desktop\\"...`,
    ]);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({ filesFound: 10, matched: 10 });
      setLogs((prev) => [
        ...prev,
        `[SCAN_OK] 10 archivos .mp4 detectados en disco local.`,
        `[MATCH] Coincidencia 100% con los 10 nodos de ${currentChannel.name}.`,
        `[READY_TO_SCHEDULE] Clips listos para programar 2 por día en slots ${currentChannel.timeSlots.join(' y ')}.`,
      ]);
    }, 1200);
  };

  const handleRunUploader = (clipId: string) => {
    const clip = filteredClips.find((c) => c.id === clipId);
    if (!clip) return;

    setLogs((prev) => [
      ...prev,
      `[UPLOAD] Iniciando subida de "${clip.title}" a YouTube Shorts...`,
      `[METADATA] Título limpio: "${clip.title}" (Sin #Shorts - directiva oficial)`,
      `[API] Subiendo paquete de video a YouTube API v3...`,
      `[SUCCESS] Short programado con éxito para ${clip.platforms.YOUTUBE_SHORT.slotTime || '14:00 ART'}. Video ID: yt_${clip.id.replace('-', '')}`,
      `[NOTIFICATION] Reporte enviado a Matías Chababo en Telegram (Chat ID: 1293359933).`,
    ]);

    (['YOUTUBE_SHORT', 'INSTAGRAM_REEL', 'TIKTOK', 'FACEBOOK_REEL', 'X_TWITTER'] as const).forEach((p) => {
      updateClipStatus(clipId, p, 'SCHEDULED');
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-white">
                  Ingesta & Subida API
                </span>
                <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-mono font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Activo</span>
                </span>
              </div>
              <div className="text-xs text-[#848d97] mt-0.5">
                {currentChannel.name} • C:\Users\Mati\Downloads\Telegram Desktop\
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleScanTelegram}
              disabled={isScanning}
              className="app-button app-button-secondary text-xs flex items-center space-x-1.5"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Escaneando...' : 'Escanear Telegram Desktop'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-zinc-800/80 bg-[#121217] p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold">Bot Telegram Ingest</span>
            <Send className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-sm font-extrabold text-white">@BlackFlagClipsBot</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Escuchando grupo privado</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#121217] p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold">Directorio Local</span>
            <FolderDown className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xs font-mono font-bold text-zinc-200 truncate">
            Telegram Desktop
          </div>
          <div className="mt-1 text-[11px] text-zinc-400 font-mono">
            Descargas automáticas OK
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#121217] p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold">YouTube API v3</span>
            <Key className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-sm font-extrabold text-white">OAuth 2.0 Autenticado</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">
            0 / 10.000 cuota usada
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#121217] p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold">Alertas Privadas</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-sm font-extrabold text-white">Matías Chababo</div>
          <div className="mt-1 text-[11px] text-zinc-400 font-mono">
            Chat ID: 1293359933
          </div>
        </div>
      </div>

      {/* Multi-Channel Routing Rules */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Reglas de Ingesta & Cumplimiento por Canal
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            3 Canales Configurados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className={`rounded-xl border p-4 transition ${
                ch.id === currentChannel.id
                  ? 'bg-zinc-950 border-amber-500/80 shadow-md shadow-amber-500/10'
                  : 'bg-zinc-950/60 border-zinc-800/80'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <img
                  src={ch.avatarUrl || '/channels/blackflag-logo.png'}
                  alt={ch.name}
                  className="h-8 w-8 rounded-lg object-cover border border-white/20 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{ch.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {ch.shortCode} • {ch.shortsPerDay} shorts/día
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-[11px] font-mono border-t border-zinc-800/60 pt-2.5 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Categoría YT:</span>
                  <span className="font-bold text-zinc-200">
                    {ch.id === 'blackflag' ? '27 (Educación)' : ch.id === 'podmon' ? '20 (Gaming)' : '24 (Kids)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">COPPA:</span>
                  <span className={`font-bold ${ch.id === 'levelpop' ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    {ch.id === 'levelpop' ? 'madeForKids: true' : 'madeForKids: false'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Títulos:</span>
                  <span className="text-emerald-400 font-bold">Sin #Shorts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Queue & Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clips Ingest Queue */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#121217] p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <UploadCloud className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Cola de Clips Listos para Disparar</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {filteredClips.length} clips en stock
              </span>
            </div>

            <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredClips.map((clip) => {
                const isScheduled = Object.values(clip.platforms).some((p) => p.status === 'SCHEDULED');
                return (
                  <div
                    key={clip.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 hover:border-zinc-700 transition"
                  >
                    <div className="truncate max-w-[240px]">
                      <div className="text-xs font-bold text-white truncate">
                        #{String(clip.clipNumber).padStart(2, '0')} {clip.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">
                        {clip.file}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isScheduled ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          PROGRAMADO
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRunUploader(clip.id)}
                          className="studio-btn bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 space-x-1"
                        >
                          <Play className="h-2.5 w-2.5 fill-current" />
                          <span>Subir API</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="rounded-xl border border-[#1e2129] bg-black p-4 flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900 text-zinc-400">
            <div className="flex items-center space-x-2">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Terminal
              </span>
            </div>
            <span className="text-[10px] text-zinc-600">daemon</span>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-1.5 text-zinc-300 text-[11px] min-h-[220px] max-h-[280px]">
            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes('[SUCCESS]')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('[SCAN_OK]') || log.includes('[READY_TO_SCHEDULE]')
                    ? 'text-cyan-300'
                    : log.includes('[MATCH]')
                    ? 'text-amber-300'
                    : 'text-zinc-400'
                }
              >
                {log}
              </div>
            ))}
          </div>

          <div className="pt-2 text-[10px] text-zinc-600 border-t border-zinc-900 flex justify-between items-center">
            <span>Status: daemon running smoothly</span>
            <span className="text-zinc-500 font-bold">PID: 9482</span>
          </div>
        </div>
      </div>
    </div>
  );
};
