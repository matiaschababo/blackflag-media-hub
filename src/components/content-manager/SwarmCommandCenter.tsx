'use client';

import React, { useState } from 'react';
import { useHolding } from '../../context/HoldingContext';
import { supabase } from '../../lib/supabase';
import cmoDailyPack from '../../data/cmo_daily_viral_pack.json';
import {
  Cpu,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Database,
  Flame,
  Target,
  Share2,
  Copy,
  Check,
} from 'lucide-react';

interface SwarmStep {
  step: number;
  agentId: string;
  agentName: string;
  model: string;
  status: 'PASS' | 'REJECT' | 'FIXED';
  summary: string;
  payload: any;
}

interface SwarmResult {
  ok: boolean;
  channelId: string;
  mode: string;
  loopIterations: number;
  qaScore: string;
  finalPackage: {
    title: string;
    titleVariantA?: string;
    titleVariantB?: string;
    titleVariantC?: string;
    hook: string;
    ctaComment: string;
    hashtags: string[];
    tiktokSearchPill?: string;
    igDmShareHook?: string;
    fbDebateQuestion?: string;
    sniperReplyX?: string;
    durationSec: number;
    madeForKids: boolean;
    packaging: {
      headlineTop: string;
      headlineBottom: string;
      thumbnailOffsetMs: number;
      aspectRatio: string;
      bufferRecommendedSlot?: string;
    };
  };
  stepsLog: SwarmStep[];
}

const CMO_MODES = [
  { id: 'create_package', label: '1. Creación & Packaging 9:16', icon: Cpu },
  { id: 'rescue_flops', label: '2. Rescate Flops & Triada A/B/C', icon: Flame },
  { id: 'sniper_x', label: '3. Sniper Replying & Hilo ASCII X', icon: Target },
  {
    id: 'multichannel_syndication',
    label: '4. Sindicación TikTok / IG / FB',
    icon: Share2,
  },
];

const PRESET_OBJECTIVES: Record<string, string[]> = {
  levelpop: [
    'Supercar Cliff Drift Survival (Micro-Apuesta 8 Autos)',
    'Rescate Video dCgDp1A919Y: Bridge Assault 100 Cars',
    'Rescate Video 4uUPgMOHpW0: Micro Car Slalom Pick',
    'Neon Cyber-Marble Escape Challenge (1% Win)',
  ],
  blackflag: [
    'Sniper Reply @levelsio / @doolaHQ: IRC § 861(a)(3) & Form 5472 ($25k Penalty)',
    'Hilo X con Diagrama ASCII: Wyoming Charging Order + Rev. Rul. 77-137 Phantom Income',
    'Fideicomiso Irrevocable en Nevis: Fianza de $100k Cash Bond (NIETO § 55)',
  ],
  podmon: [
    'Puente Ep 04 Reloj 60 Días: $3,303 Líquidos vs $18,000 en Cosecha Pendiente',
    'Compra de Tractor Usado al Límite de la Bancarrota (Día 42/60)',
  ],
};

export const SwarmCommandCenter: React.FC = () => {
  const { selectedChannelId, refreshFromDb } = useHolding();
  const activeChannel =
    selectedChannelId === 'all' ? 'levelpop' : selectedChannelId;

  const [channelTarget, setChannelTarget] = useState<string>(activeChannel);
  const [cmoMode, setCmoMode] = useState<string>('create_package');
  const [objective, setObjective] = useState<string>(
    PRESET_OBJECTIVES[activeChannel]?.[0] || PRESET_OBJECTIVES.levelpop[0]
  );
  const [injectFault, setInjectFault] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [result, setResult] = useState<SwarmResult | null>(null);
  const [copiedId, setCopiedId] = useState<string>('');

  const handleChannelChange = (ch: string) => {
    setChannelTarget(ch);
    const firstObj = PRESET_OBJECTIVES[ch]?.[0] || '';
    if (firstObj) setObjective(firstObj);
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1800);
  };

  const runSwarm = async () => {
    setIsRunning(true);
    setErrorMsg('');
    setSavedNotice('');
    try {
      const res = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: channelTarget,
          mode: cmoMode,
          objective,
          injectFault,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || 'Error en ejecución del enjambre');
      }
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error de conexión con Gemini API');
    } finally {
      setIsRunning(false);
    }
  };

  const savePackageToSupabase = async () => {
    if (!result?.finalPackage) return;
    setIsSaving(true);
    setSavedNotice('');
    try {
      const pkg = result.finalPackage;
      const newClipId = `${channelTarget}-ai-${Date.now().toString().slice(-5)}`;
      const tagsStr = (pkg.hashtags || []).join(' ');
      const ytCaption = `${pkg.hook}\n\n👇 ${pkg.ctaComment} 👇\n\n${tagsStr}`;
      const ttCaption = pkg.tiktokSearchPill
        ? `${pkg.tiktokSearchPill}\n\n${tagsStr}`
        : ytCaption;
      const igCaption = pkg.igDmShareHook
        ? `${pkg.igDmShareHook}\n\n${tagsStr}`
        : ytCaption;
      const fbCaption = pkg.fbDebateQuestion || ytCaption;
      const xCaption = pkg.sniperReplyX || `${pkg.title}\n\n${pkg.hook}`;

      const { error } = await supabase.from('clips').insert({
        id: newClipId,
        episode_id:
          channelTarget === 'levelpop'
            ? 'ep-lp-01'
            : channelTarget === 'podmon'
            ? 'ep-pm-03'
            : 'ep01',
        channel_id: channelTarget,
        clip_number: 99,
        title: pkg.title,
        file: `${newClipId}.mp4`,
        hook: pkg.hook,
        duration_sec: pkg.durationSec || 45,
        timestamps: { start: '00:00', end: '00:45' },
        captions: {
          youtube: ytCaption,
          tiktok: ttCaption,
          instagram: igCaption,
          facebook: fbCaption,
          x: xCaption,
        },
        platforms: {
          YOUTUBE_SHORT: { status: 'PENDING' },
          TIKTOK: { status: 'PENDING' },
          INSTAGRAM_REEL: { status: 'PENDING' },
          FACEBOOK_REEL: { status: 'PENDING' },
          X_TWITTER: { status: 'PENDING' },
        },
        is_urgent: false,
        priority_order: 99,
        views: 0,
        hook_rate: 81.5,
        completion_rate: 88.0,
      });

      if (error) throw error;
      await refreshFromDb();
      setSavedNotice(`Clip ${newClipId} guardado en Supabase Stock.`);
    } catch (err: any) {
      setErrorMsg(`Error guardando en Supabase: ${err?.message || String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const r1Audit = cmoDailyPack.routine_1_channel_audit;
  const r2Rescue = cmoDailyPack.routine_2_flop_rescue;
  const r3Syndication =
    cmoDailyPack.routine_3_multichannel_syndication?.channels_viral_pack;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e2129] pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#13151a] border border-[#262a34] flex items-center justify-center text-emerald-400">
            <Cpu className="h-4 w-4" />
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Enjambre CMO & Viralización · Gemini API v3.0 (/graph + /loop)
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center space-x-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-emerald-300 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>API Key: ...xhIw</span>
          </span>
          <span className="rounded-md border border-[#262a34] bg-[#13151a] px-2.5 py-1 text-[#848d97] font-mono">
            gemini-3.5-flash-lite / 3.8-flash
          </span>
        </div>
      </div>

      {/* 4 CMO Routine Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {CMO_MODES.map((m) => {
          const Icon = m.icon;
          const active = cmoMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setCmoMode(m.id)}
              className={`flex items-center space-x-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                active
                  ? 'border-white bg-[#1e2129] text-white'
                  : 'border-[#1e2129] bg-[#13151a] text-[#848d97] hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="rounded-xl border border-[#1e2129] bg-[#13151a] p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="block text-[11px] font-semibold text-[#848d97] mb-1.5">
              Canal
            </label>
            <select
              value={channelTarget}
              onChange={(e) => handleChannelChange(e.target.value)}
              className="w-full rounded-lg border border-[#262a34] bg-[#0c0d10] px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            >
              <option value="levelpop">LevelPop (60 FPS Sensory)</option>
              <option value="blackflag">BlackFlag Blueprint (Offshore B2B)</option>
              <option value="podmon">Podmon (Farming Storytelling)</option>
            </select>
          </div>

          <div className="md:col-span-6">
            <label className="block text-[11px] font-semibold text-[#848d97] mb-1.5">
              Objetivo de Viralización
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full rounded-lg border border-[#262a34] bg-[#0c0d10] px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="md:col-span-3 flex items-center space-x-2">
            <button
              onClick={runSwarm}
              disabled={isRunning}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200 disabled:opacity-50 transition cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Corriendo /graph...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>Ejecutar Enjambre</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1e2129]">
          <div className="flex flex-wrap items-center gap-1.5">
            {(PRESET_OBJECTIVES[channelTarget] || []).map((preset) => (
              <button
                key={preset}
                onClick={() => setObjective(preset)}
                className={`rounded-md px-2 py-1 text-[11px] border transition cursor-pointer ${
                  objective === preset
                    ? 'border-white bg-[#1e2129] text-white font-semibold'
                    : 'border-[#262a34] bg-[#0c0d10] text-[#848d97] hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <label className="flex items-center space-x-2 text-xs text-[#848d97] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={injectFault}
              onChange={(e) => setInjectFault(e.target.checked)}
              className="rounded border-[#262a34] bg-[#0c0d10]"
            />
            <span>Inyectar fallo (#Shorts + 3-2-1) para probar /loop</span>
          </label>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300">
          {errorMsg}
        </div>
      )}

      {savedNotice && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300">
          {savedNotice}
        </div>
      )}

      {/* Live Execution Output (/graph + /loop) */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-white px-1">
              <span>Trazabilidad del Grafo (/graph + /loop)</span>
              <span className="font-mono text-[#848d97]">
                Iteraciones: {result.loopIterations} · QA: {result.qaScore}
              </span>
            </div>

            {result.stepsLog.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-[#1e2129] bg-[#13151a] p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded bg-[#1e2129] text-[11px] font-bold text-white flex items-center justify-center tabular-nums">
                      {s.step}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {s.agentName}
                    </span>
                    <span className="rounded bg-[#0c0d10] border border-[#262a34] px-1.5 py-0.5 text-[10px] font-mono text-[#848d97]">
                      {s.model}
                    </span>
                  </div>

                  {s.status === 'PASS' && (
                    <span className="inline-flex items-center space-x-1 rounded bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>PASS</span>
                    </span>
                  )}
                  {s.status === 'REJECT' && (
                    <span className="inline-flex items-center space-x-1 rounded bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      <span>REJECT → /LOOP</span>
                    </span>
                  )}
                  {s.status === 'FIXED' && (
                    <span className="inline-flex items-center space-x-1 rounded bg-sky-950/50 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                      <RefreshCw className="h-3 w-3" />
                      <span>AUTO-REPARADO</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {s.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-white px-1">
              Pack de Viralización Certificado (Compuerta Humana)
            </div>

            <div className="rounded-xl border border-[#262a34] bg-[#13151a] p-4 space-y-3.5">
              <div>
                <div className="text-[10px] font-semibold text-[#848d97] uppercase">
                  Título Ganador (Sin #Shorts · Sin 3-2-1)
                </div>
                <div className="mt-1 text-sm font-bold text-white">
                  {result.finalPackage.title}
                </div>
              </div>

              {(result.finalPackage.titleVariantA ||
                result.finalPackage.titleVariantB) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2">
                    <div className="text-[10px] font-bold text-amber-400">
                      Variante A (1% Scarcity)
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-200">
                      {result.finalPackage.titleVariantA}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2">
                    <div className="text-[10px] font-bold text-sky-400">
                      Variante B (Pregunta)
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-200">
                      {result.finalPackage.titleVariantB}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2">
                    <div className="text-[10px] font-bold text-emerald-400">
                      Variante C (Apuesta)
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-200">
                      {result.finalPackage.titleVariantC}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="text-[10px] font-semibold text-[#848d97] uppercase">
                  Hook (t = 0.0s)
                </div>
                <div className="mt-1 rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2.5 text-xs text-zinc-200 font-mono">
                  &ldquo;{result.finalPackage.hook}&rdquo;
                </div>
              </div>

              {result.finalPackage.tiktokSearchPill && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2.5">
                    <div className="text-[10px] font-bold text-pink-400">
                      TikTok Search Pill & Saves (x4)
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-300">
                      {result.finalPackage.tiktokSearchPill}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2.5">
                    <div className="text-[10px] font-bold text-purple-400">
                      Instagram Reels DM Send Hook
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-300">
                      {result.finalPackage.igDmShareHook}
                    </div>
                  </div>
                </div>
              )}

              {result.finalPackage.sniperReplyX && (
                <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2.5">
                  <div className="text-[10px] font-bold text-zinc-400">
                    X (Twitter) Sniper Reply / ASCII Bookmark Schema
                  </div>
                  <pre className="mt-1 text-[11px] text-zinc-200 font-mono whitespace-pre-wrap">
                    {result.finalPackage.sniperReplyX}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2.5">
                  <div className="text-[10px] text-[#848d97]">
                    Póster 9:16 (1080x1920)
                  </div>
                  <div className="mt-1 text-xs font-black text-white">
                    {result.finalPackage.packaging?.headlineTop} /{' '}
                    <span className="text-yellow-400">
                      {result.finalPackage.packaging?.headlineBottom}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-[#0c0d10] border border-[#1e2129] p-2.5">
                  <div className="text-[10px] text-[#848d97]">
                    COPPA & Buffer Offset
                  </div>
                  <div className="mt-1 text-xs font-semibold text-emerald-400">
                    MadeForKids: False · 1000ms
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e2129]">
                <button
                  onClick={savePackageToSupabase}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 px-4 transition cursor-pointer disabled:opacity-50"
                >
                  <Database className="h-3.5 w-3.5" />
                  <span>
                    {isSaving
                      ? 'Guardando en Supabase...'
                      : 'Aprobar y Guardar en Stock (Supabase DB)'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LIVE CMO AUDIT & MULTICHANNEL PACKS (FROM cmo_daily_viral_pack.json) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
        {/* Left: LevelPop Winner vs Rescued Flops Table */}
        <div className="lg:col-span-7 rounded-xl border border-[#1e2129] bg-[#13151a] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Rutinas 1 & 2 · Auditoría LevelPop y Rescate de Flops en Vivo
            </h2>
            <span className="rounded bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
              Mediana: {r1Audit.empirical_median_views} vistas · QA 16/16
            </span>
          </div>

          {/* Winners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {(r1Audit.winners || []).map((w: any) => (
              <div
                key={w.video_id}
                className="rounded-lg border border-emerald-500/25 bg-[#0c0d10] p-2.5"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-emerald-400 font-bold">
                    🟢 {w.views} vistas ({w.ratio_vs_channel_median}x)
                  </span>
                  <span className="font-mono text-[#848d97]">{w.video_id}</span>
                </div>
                <div className="mt-1 text-xs font-bold text-white line-clamp-2">
                  {w.title}
                </div>
              </div>
            ))}
          </div>

          {/* Rescued Videos Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1e2129] text-[10px] text-[#848d97] uppercase">
                  <th className="py-2 pr-2">ID</th>
                  <th className="py-2 pr-2">Título Anterior (Flop / Contaminado)</th>
                  <th className="py-2 pr-2">Nuevo Título Aprobado (En Vivo)</th>
                  <th className="py-2 text-right">Estado API</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2129]">
                {(r2Rescue.rescued_videos || []).map((rv: any) => (
                  <tr key={rv.video_id} className="hover:bg-[#191c24]">
                    <td className="py-2 pr-2 font-mono text-[11px] text-[#848d97]">
                      {rv.video_id}
                    </td>
                    <td className="py-2 pr-2 text-[11px] text-zinc-400 line-through">
                      {rv.old_title}
                    </td>
                    <td className="py-2 pr-2 text-[11px] font-bold text-white">
                      {rv.recommended_live_title}
                    </td>
                    <td className="py-2 text-right">
                      <span className="inline-block rounded bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                        LIVE FIXED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: BlackFlag Sniper Replies & ASCII Bookmark Post + Podmon Bridge */}
        <div className="lg:col-span-5 rounded-xl border border-[#1e2129] bg-[#13151a] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Rutina 3 · Sniper Replying (X) & Sindicación
            </h2>
            <span className="rounded bg-[#0c0d10] border border-[#262a34] px-2 py-0.5 text-[10px] font-mono text-[#848d97]">
              0% Autobombo · 100% Estatutos
            </span>
          </div>

          <div className="space-y-2">
            {(r3Syndication?.blackflag_blueprint?.sniper_replies_today || []).map(
              (sr: any, idx: number) => {
                const cid = `sr-${idx}`;
                return (
                  <div
                    key={cid}
                    className="rounded-lg border border-[#262a34] bg-[#0c0d10] p-2.5 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400">
                        {sr.target_handle} · {sr.statutory_citation}
                      </span>
                      <button
                        onClick={() => copyText(cid, sr.reply_text)}
                        className="inline-flex items-center space-x-1 rounded bg-[#1e2129] px-2 py-0.5 text-[10px] text-white hover:bg-zinc-700 cursor-pointer"
                      >
                        {copiedId === cid ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      {sr.reply_text}
                    </p>
                  </div>
                );
              }
            )}
          </div>

          {r3Syndication?.blackflag_blueprint?.x_ascii_bookmark_post && (
            <div className="rounded-lg border border-[#262a34] bg-[#0c0d10] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-400">
                  Post X con Diagrama ASCII (Bookmarks x30-x50)
                </span>
                <button
                  onClick={() =>
                    copyText(
                      'ascii-x',
                      r3Syndication.blackflag_blueprint.x_ascii_bookmark_post
                        .main_tweet_no_link
                    )
                  }
                  className="inline-flex items-center space-x-1 rounded bg-[#1e2129] px-2 py-0.5 text-[10px] text-white hover:bg-zinc-700 cursor-pointer"
                >
                  {copiedId === 'ascii-x' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[10px] text-zinc-200 font-mono whitespace-pre-wrap overflow-x-auto">
                {
                  r3Syndication.blackflag_blueprint.x_ascii_bookmark_post
                    .main_tweet_no_link
                }
              </pre>
            </div>
          )}

          {r3Syndication?.podmon_storytelling?.ep04_vertical_clip_bridge && (
            <div className="rounded-lg border border-[#262a34] bg-[#0c0d10] p-2.5 space-y-1">
              <div className="text-[11px] font-bold text-emerald-400">
                Podmon Ep 04 Bridge ($3,303 Caja + $18,000 Cosecha)
              </div>
              <div className="text-[11px] font-semibold text-white">
                {
                  r3Syndication.podmon_storytelling.ep04_vertical_clip_bridge
                    .youtube_shorts_title
                }
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                &ldquo;
                {
                  r3Syndication.podmon_storytelling.ep04_vertical_clip_bridge
                    .hook_0_3s_voiceover
                }
                &rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
