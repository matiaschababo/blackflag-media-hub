'use client';

import React from 'react';
import { useHolding } from '../../context/HoldingContext';
import { Platform, PlatformFilter, ContentFormat, ProductionStage } from '../../types';
import {
  Globe,
  Plus,
  RefreshCw,
  Film,
  Smartphone,
  Layers,
  CheckCircle2,
  Clock,
  Archive,
  ExternalLink,
} from 'lucide-react';
import { PlatformIcon } from '../ui/PlatformIcon';

interface ChannelAndPlatformBarProps {
  onOpenNewChannelModal: () => void;
}

export const ChannelAndPlatformBar: React.FC<ChannelAndPlatformBarProps> = ({
  onOpenNewChannelModal,
}) => {
  const {
    channels,
    selectedChannelId,
    setSelectedChannelId,
    currentChannel,
    selectedPlatform,
    setSelectedPlatform,
    selectedFormat,
    setSelectedFormat,
    selectedStage,
    setSelectedStage,
    globalStats,
    isSyncing,
    lastSyncedTime,
    triggerManualSync,
  } = useHolding();

  const platformsList: Array<{ key: PlatformFilter; label: string; iconKey: string }> = [
    { key: 'ALL', label: 'Todas las Redes', iconKey: 'GLOBAL' },
    { key: 'YOUTUBE_SHORT', label: 'YouTube', iconKey: 'YOUTUBE' },
    { key: 'TIKTOK', label: 'TikTok', iconKey: 'TIKTOK' },
    { key: 'INSTAGRAM_REEL', label: 'Instagram', iconKey: 'INSTAGRAM' },
    { key: 'FACEBOOK_REEL', label: 'Facebook', iconKey: 'FACEBOOK' },
    { key: 'X_TWITTER', label: 'X (Twitter)', iconKey: 'TWITTER' },
  ];

  // Helper to build direct external URLs for channel accounts
  const getAccountData = (platformKey: Platform) => {
    const acc = currentChannel.accounts;
    switch (platformKey) {
      case 'YOUTUBE_SHORT':
        return {
          handle: acc.youtube,
          url:
            acc.youtube.startsWith('@')
              ? `https://youtube.com/${acc.youtube}`
              : `https://youtube.com/results?search_query=${encodeURIComponent(acc.youtube)}`,
          statusBadge: 'API Oficial Conectada',
          statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'TIKTOK':
        return {
          handle: acc.tiktok,
          url: acc.tiktok.startsWith('@')
            ? `https://tiktok.com/${acc.tiktok}`
            : `https://tiktok.com/@${acc.tiktok}`,
          statusBadge: 'Buffer Sincronizado',
          statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        };
      case 'INSTAGRAM_REEL':
        return {
          handle: acc.instagram,
          url: `https://instagram.com/${acc.instagram.replace('@', '')}`,
          statusBadge: 'Meta Graph API',
          statusColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
        };
      case 'FACEBOOK_REEL':
        return {
          handle: acc.facebook,
          url: `https://facebook.com/${encodeURIComponent(acc.facebook.replace(/\s+/g, ''))}`,
          statusBadge: 'Página Vinculada',
          statusColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        };
      case 'X_TWITTER':
        return {
          handle: acc.x,
          url: `https://x.com/${acc.x.replace('@', '')}`,
          statusBadge: 'X API v2 Feed',
          statusColor: 'text-zinc-300 bg-zinc-800 border-zinc-700',
        };
    }
  };

  const accountPlatforms: Platform[] = [
    'YOUTUBE_SHORT',
    'TIKTOK',
    'INSTAGRAM_REEL',
    'FACEBOOK_REEL',
    'X_TWITTER',
  ];

  return (
    <div className="w-full space-y-3 mb-6 bg-[#0e1015] border border-[#1e2129] rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ROW 1: PRIMARY CHANNEL SWITCHER & GLOBAL STATS PILL           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#1a1d24]">
        {/* Left: Channels Horizontal Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* ALL / HOLDING TOTAL BUTTON */}
          <button
            onClick={() => setSelectedChannelId('all')}
            className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedChannelId === 'all'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-950/50 border border-sky-400/30'
                : 'bg-[#14161d] text-zinc-400 hover:text-white hover:bg-[#1a1d26] border border-[#232732]'
            }`}
          >
            <div className="h-5 w-5 rounded-md bg-white/10 flex items-center justify-center">
              <Globe className="h-3.5 w-3.5 text-white" />
            </div>
            <span>HOLDING GLOBAL</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                selectedChannelId === 'all' ? 'bg-white/20 text-white' : 'bg-[#232732] text-zinc-400'
              }`}
            >
              {globalStats.totalChannels} CANALES
            </span>
          </button>

          {/* INDIVIDUAL CHANNELS */}
          {channels.map((chan) => {
            const isSelected = selectedChannelId === chan.id;
            return (
              <button
                key={chan.id}
                onClick={() => setSelectedChannelId(chan.id)}
                className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#181b24] text-white shadow-md'
                    : 'bg-[#14161d] text-zinc-400 hover:text-white hover:bg-[#1a1d26] border-[#232732]'
                }`}
                style={{
                  borderColor: isSelected ? chan.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 16px ${chan.accentColor}25` : undefined,
                }}
              >
                <img
                  src={chan.avatarUrl || '/channels/blackflag-logo.png'}
                  alt={chan.name}
                  className="h-5 w-5 rounded-md object-cover border border-[#262a34]"
                />
                <span className="truncate max-w-[140px]">{chan.name}</span>
                <span
                  className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold"
                  style={{
                    backgroundColor: `${chan.accentColor}20`,
                    color: chan.accentColor,
                  }}
                >
                  {chan.shortCode}
                </span>
              </button>
            );
          })}

          {/* Add Channel Button */}
          <button
            onClick={onOpenNewChannelModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-[#14161d] hover:bg-[#1a1d26] border border-dashed border-[#2b303d] transition cursor-pointer shrink-0"
            title="Añadir nuevo canal al Holding"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nuevo Canal</span>
          </button>
        </div>

        {/* Right: Sync Status & Trigger */}
        <div className="flex items-center space-x-2.5 self-end lg:self-auto shrink-0">
          <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-zinc-400 bg-[#14161d] border border-[#232732] px-2.5 py-1.5 rounded-lg font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sincronizado: {lastSyncedTime}</span>
          </div>

          <button
            onClick={triggerManualSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181b24] hover:bg-[#202532] text-xs font-semibold text-zinc-200 border border-[#2b303d] hover:border-zinc-500 transition cursor-pointer disabled:opacity-50"
            title="Sincronizar métricas contra YouTube, Supabase y Buffer"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar APIs'}</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ROW 2: MULTI-PLATFORM ACCOUNT FILTER STRIP                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Platform Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mr-1 shrink-0 hidden sm:inline">
            Plataforma:
          </span>

          {platformsList.map((p) => {
            const isSelected = selectedPlatform === p.key;
            const count =
              p.key === 'ALL'
                ? globalStats.totalPublications
                : globalStats.publicationsByPlatform[p.key as Platform] || 0;

            return (
              <button
                key={p.key}
                onClick={() => setSelectedPlatform(p.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                    : 'bg-[#14161d] text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1d26] border border-[#20242f]'
                }`}
              >
                {p.key === 'ALL' ? (
                  <Layers className={`h-3.5 w-3.5 ${isSelected ? 'text-zinc-950' : 'text-zinc-400'}`} />
                ) : (
                  <PlatformIcon platform={p.key as Platform} className="h-3.5 w-3.5" />
                )}
                <span>{p.label}</span>
                <span
                  className={`text-[10px] px-1 rounded font-mono ${
                    isSelected ? 'bg-zinc-300 text-zinc-950' : 'bg-[#1e222c] text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Format Switcher: Videos Largos vs Shorts */}
        <div className="flex items-center space-x-1.5 shrink-0 self-start md:self-auto">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mr-1 hidden sm:inline">
            Formato:
          </span>
          <div className="flex items-center p-0.5 rounded-xl bg-[#14161d] border border-[#20242f]">
            <button
              onClick={() => setSelectedFormat('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedFormat === 'ALL'
                  ? 'bg-[#252a36] text-white shadow-inner'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedFormat('LONGFORM')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedFormat === 'LONGFORM'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Film className="h-3.5 w-3.5 text-amber-400" />
              <span>Largos (16:9)</span>
            </button>
            <button
              onClick={() => setSelectedFormat('SHORTS')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedFormat === 'SHORTS'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-inner'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5 text-sky-400" />
              <span>Shorts (9:16)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ROW 2.5: CUENTAS OFICIALES, ESTADOS Y ENLACES DIRECTOS        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono font-bold">
              Cuentas Oficiales y Enlaces Directos ({currentChannel.name}):
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {selectedChannelId === 'all' ? 'Holding Consolidado' : `Handle Base: ${currentChannel.accounts.youtube}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {accountPlatforms.map((plat) => {
            const data = getAccountData(plat);
            const isPlatformFiltered = selectedPlatform === plat;

            return (
              <div
                key={plat}
                onClick={() => setSelectedPlatform(isPlatformFiltered ? 'ALL' : plat)}
                className={`p-2 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                  isPlatformFiltered
                    ? 'bg-[#1a1e28] border-sky-500/60 shadow-md'
                    : 'bg-[#151821] border-[#222633] hover:border-[#2f3547]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <PlatformIcon platform={plat} size={14} />
                    <span className="text-xs font-bold text-white truncate">{data.handle}</span>
                  </div>
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 rounded bg-[#1e2330] hover:bg-[#282f42] text-zinc-400 hover:text-white flex items-center justify-center shrink-0 transition"
                    title={`Abrir perfil oficial en ${plat}`}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-[#1e222d]">
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${data.statusColor}`}>
                    {data.statusBadge}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {globalStats.publicationsByPlatform[plat] || 0} pubs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ROW 3: PRODUCTION STAGE / USER JOURNEY FILTER                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1a1d24] text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mr-1 shrink-0">
            Etapa de Contenido:
          </span>
          <button
            onClick={() => setSelectedStage('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              selectedStage === 'ALL'
                ? 'bg-[#232732] text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todas las Etapas
          </button>
          <button
            onClick={() => setSelectedStage('VIRGIN_STOCK')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              selectedStage === 'VIRGIN_STOCK'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Archive className="h-3 w-3 text-indigo-400" />
            <span>Stock Virgen</span>
          </button>
          <button
            onClick={() => setSelectedStage('SCHEDULED')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              selectedStage === 'SCHEDULED'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="h-3 w-3 text-cyan-400" />
            <span>Programados en Parrilla</span>
          </button>
          <button
            onClick={() => setSelectedStage('PUBLISHED')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              selectedStage === 'PUBLISHED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Publicados con Métricas</span>
          </button>
        </div>

        {/* Global Key Ratios Banner */}
        <div className="hidden xl:flex items-center space-x-4 font-mono text-[11px] text-zinc-400 bg-[#14161d] px-3 py-1 rounded-lg border border-[#20242f]">
          <div>
            <span className="text-zinc-400">Piezas Únicas: </span>
            <span className="font-bold text-white">{globalStats.totalUniquePieces}</span>
          </div>
          <div className="h-3 w-[1px] bg-zinc-700" />
          <div>
            <span className="text-zinc-400">Publicaciones: </span>
            <span className="font-bold text-emerald-400">{globalStats.totalPublications}</span>
          </div>
          <div className="h-3 w-[1px] bg-zinc-700" />
          <div>
            <span className="text-zinc-400">Tasa Arbitraje: </span>
            <span className="font-bold text-sky-400">{globalStats.arbitrageRatio}x</span>
          </div>
          <div className="h-3 w-[1px] bg-zinc-700" />
          <div>
            <span className="text-zinc-400">Runway: </span>
            <span className="font-bold text-amber-400">{globalStats.runwayDays} días</span>
          </div>
        </div>
      </div>
    </div>
  );
};
