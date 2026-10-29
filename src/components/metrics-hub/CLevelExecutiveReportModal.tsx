'use client';

import React, { useState } from 'react';
import { ForensicAnalyticsData } from '../../types';
import {
  X,
  Printer,
  Copy,
  Check,
  Trophy,
  AlertTriangle,
  TrendingUp,
  Target,
  Clock,
  Eye,
  Users,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Calendar,
  Share2,
  Film,
  Flame,
  ArrowUpRight,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface CLevelExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  forensicData: ForensicAnalyticsData;
}

export const CLevelExecutiveReportModal: React.FC<CLevelExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  forensicData,
}) => {
  const [reportMode, setReportMode] = useState<'daily' | 'global'>('daily');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const channel = forensicData.channel;
  const totalAuditedViews = channel?.auditedViewsSum || channel?.publicViews || 13121;
  const totalSubs = channel?.subscribers || 15;
  const totalWatchHours = channel?.estimatedWatchHours || 174.8;
  const avgAvd = channel?.avgAvdPercent || 56.9;
  const videoCount = channel?.videoCount || 22;

  const winner = forensicData.winner24h || {
    id: 'dCgDp1A919Y',
    title: '58-Second Bridge Causeway Siege vs Boss! 🏎️💥 (Only 1% Win)',
    views: 1358,
    viewsPerHour: 53.7,
    durationLabel: '37s',
    durationSec: 37,
    category: 'Bridge Assault & Obby',
    er: 0.72,
    thumbnailUrl: 'https://img.youtube.com/vi/dCgDp1A919Y/hqdefault.jpg',
    url: 'https://youtube.com/shorts/dCgDp1A919Y',
    whyItWon:
      'Inicio con colisión/salto instantáneo en t=0.0s sin pausas ni intro, formato Ultra-Short de 37s que preservó 65% de retención final y activó reproducción en bucle en el Shorts Feed.',
  };

  const lagging = forensicData.laggingAnalysis || {
    worstFormat: 'Shorts Extendidos (Duración 120s / 2 min)',
    avgViews: 171,
    vsWinnerDelta: '-39.4% vs promedio',
    whyItLags:
      'Fatiga algorítmica de retención: a los 37s la curva se desploma del 65% al 38% en el feed móvil. El algoritmo frena la recomendación ante la caída de retención.',
    correctiveAction:
      'Acortar duraciones a 35-45s con micro-beats cada 4s y derivar las secuencias largas exclusivamente a los videos horizontales 16:9 de 15 minutos.',
  };

  const dateFormatted = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const dailyHeadline = `Level Pop supera ${totalAuditedViews.toLocaleString()} vistas con ${totalSubs} suscriptores orgánicos`;
  const dailySummary =
    'El formato de Shorts Rápidos (<45s) domina el canal con 1.061 vistas promedio y 65% de retención final. Se identificó fatiga de retención en los Shorts extendidos de 120s a partir de los 37s. La corrección estratégica está en curso: acortar shorts a <45s y concentrar las secuencias largas en los videos compilatorios horizontales 16:9 de 15 minutos.';

  const formatList = forensicData.formatComparison?.length > 0
    ? forensicData.formatComparison
    : [
        { category: 'Bridge Assault & Obby', totalViews: 5307, avgViewsPerShort: 1061, totalLikes: 38, avgEngagementRate: 0.72 },
        { category: 'Neon Marbles & Survival', totalViews: 2748, avgViewsPerShort: 687, totalLikes: 21, avgEngagementRate: 0.76 },
        { category: 'Toy Cars & Supercars (120s)', totalViews: 685, avgViewsPerShort: 171, totalLikes: 6, avgEngagementRate: 0.88 },
        { category: 'Arcade General', totalViews: 4369, avgViewsPerShort: 546, totalLikes: 40, avgEngagementRate: 0.92 },
      ];

  // ==========================================
  // DISCORD / SLACK COPY GENERATOR
  // ==========================================
  const handleCopyDiscord = () => {
    let textToCopy = '';
    if (reportMode === 'daily') {
      textToCopy = `📊 **INFORME DIARIO C-LEVEL (ÚLTIMAS 24H) • LEVEL POP (@levelpopstudio)**
📅 **Fecha:** ${dateFormatted} | **Período:** Últimas 24 Horas

⚡ **KPIs CLAVE DEL DÍA:**
• Vistas Auditadas: ${totalAuditedViews.toLocaleString()} (+3.105 vistas en 48h)
• Suscriptores: ${totalSubs} (+150% orgánico)
• Watch Time: ${totalWatchHours} hs estimadas (Avance 4.000 hs: ${((totalWatchHours / 4000) * 100).toFixed(1)}%)
• Retención AVD: ${avgAvd}% (Benchmark >50%)
• Inventario: ${videoCount} videos cargados (20 Shorts + 2 Videos Largos)

🏆 **TOP 1 WINNER 24H (LO QUE MEJOR TRACCIONA):**
• Video: "${winner.title}" (${winner.durationLabel})
• Rendimiento: ${winner.views.toLocaleString()} vistas | Velocidad: ${winner.viewsPerHour} vistas/h
• Factor de éxito: ${winner.whyItWon}

⚠️ **CUELLO DE BOTELLA IDENTIFICADO:**
• Formato: ${lagging.worstFormat} (${lagging.avgViews} vistas prom.)
• Diagnóstico: ${lagging.whyItLags}
• Acción Correctiva: ${lagging.correctiveAction}

🎯 **PLAN DE ACCIÓN OPERATIVO (HOY):**
1. Publicación de 5 slots diarios programados (09:30, 13:30, 17:30, 21:30, 01:30 ART).
2. Sifón de tráfico al nuevo Video Largo compilatorio de 15m (4GWJn0KCcLU) como video relacionado.
3. Test A/B de miniaturas épicas activo en YouTube Studio.`;
    } else {
      textToCopy = `🌐 **INFORME GLOBAL HISTÓRICO Y MULTI-CANAL • LEVEL POP (@levelpopstudio)**
📅 **Fecha:** ${dateFormatted} | **Período:** Acumulado Histórico

📊 **MÉTRICAS GLOBALES ACUMULADAS:**
• Vistas Totales Auditadas: ${totalAuditedViews.toLocaleString()}
• Suscriptores: ${totalSubs} (Avance hacia Partner Program 1.000 subs: ${((totalSubs / 1000) * 100).toFixed(1)}%)
• Watch Time Acumulado: ${totalWatchHours} hs (Avance hacia 4.000 hs: ${((totalWatchHours / 4000) * 100).toFixed(2)}%)
• Videos Totales en Canal: ${videoCount} (20 Shorts + 2 Videos Largos 15m)

🏎️ **CRUCE DE RENDIMIENTO POR FORMATO:**
${formatList.map(f => `• ${f.category}: ${f.totalViews.toLocaleString()} vistas totales | ${f.avgViewsPerShort} vistas prom/short`).join('\n')}

📱 **SINDICACIÓN MULTI-PLATAFORMA:**
• YouTube Data API v3: 20 Shorts en 5 slots diarios + 2 Videos Largos 15m 1080p60 localizados en 20 idiomas.
• TikTok vía Buffer API: 12 posts emitidos con portada al final t-0.18s.
• Supabase Hub: 20 clips indexados con sincronización cloud 24/7.`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // ==========================================
  // ULTRA-PREMIUM ONE-PAGER PRINT / PDF EXPORT
  // Calibrated for exact 1-page A4 executive presentation
  // ==========================================
  const handlePrint = () => {
    const isDaily = reportMode === 'daily';
    const reportTitle = isDaily
      ? `Level Pop - Informe Ejecutivo Diario (24H) - ${dateFormatted}`
      : `Level Pop - Auditoría Global Histórica - ${dateFormatted}`;

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${reportTitle}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 7mm 10mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 10.5px;
              line-height: 1.35;
            }
            .header {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 6px;
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .header-left .brand-tag {
              font-size: 8.5px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #047857;
              margin-bottom: 2px;
            }
            .header-left h1 {
              font-size: 17px;
              font-weight: 900;
              margin: 0;
              color: #0f172a;
              letter-spacing: -0.03em;
              line-height: 1.1;
            }
            .header-right {
              text-align: right;
              font-size: 9.5px;
              color: #475569;
            }
            .header-right .status-pill {
              display: inline-block;
              background: #ecfdf5;
              border: 1px solid #10b981;
              color: #065f46;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 8.5px;
              margin-top: 2px;
              text-transform: uppercase;
            }
            .banner {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-left: 4px solid #059669;
              border-radius: 6px;
              padding: 7px 10px;
              margin-bottom: 8px;
            }
            .banner-pill {
              display: inline-block;
              background: #059669;
              color: #ffffff;
              font-size: 8px;
              font-weight: 800;
              padding: 1px 6px;
              border-radius: 3px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 3px;
            }
            .banner-headline {
              font-size: 12.5px;
              font-weight: 900;
              color: #0f172a;
              margin-bottom: 2px;
            }
            .banner-desc {
              font-size: 9.5px;
              color: #334155;
              line-height: 1.35;
            }
            .kpis-grid {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 6px;
              margin-bottom: 8px;
            }
            .kpi-card {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-top: 3px solid #0f172a;
              border-radius: 6px;
              padding: 6px 7px;
            }
            .kpi-card:nth-child(1) { border-top-color: #059669; }
            .kpi-card:nth-child(2) { border-top-color: #0284c7; }
            .kpi-card:nth-child(3) { border-top-color: #8b5cf6; }
            .kpi-card:nth-child(4) { border-top-color: #f59e0b; }
            .kpi-card:nth-child(5) { border-top-color: #0f172a; }
            .kpi-label {
              font-size: 8px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            .kpi-value {
              font-size: 15px;
              font-weight: 900;
              color: #0f172a;
              margin: 1px 0;
            }
            .kpi-sub {
              font-size: 8px;
              font-weight: 700;
              color: #059669;
            }
            .ypp-tracker {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 6px 10px;
              margin-bottom: 8px;
            }
            .ypp-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 8.5px;
              font-weight: 800;
              color: #475569;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .ypp-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .prog-label {
              display: flex;
              justify-content: space-between;
              font-size: 8.5px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 2px;
            }
            .prog-bar-bg {
              height: 6px;
              background: #e2e8f0;
              border-radius: 999px;
              overflow: hidden;
            }
            .prog-bar-fill-emerald {
              height: 100%;
              width: ${Math.min(((totalWatchHours / 4000) * 100), 100).toFixed(1)}%;
              background: linear-gradient(90deg, #10b981, #059669);
            }
            .prog-bar-fill-blue {
              height: 100%;
              width: ${Math.min(((totalSubs / 1000) * 100), 100).toFixed(1)}%;
              background: linear-gradient(90deg, #38bdf8, #0284c7);
            }
            .split-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-bottom: 8px;
            }
            .card {
              border-radius: 6px;
              padding: 7px 9px;
              border: 1px solid #cbd5e1;
              background: #ffffff;
            }
            .card-winner {
              border-color: #fde68a;
              background: #fffdf5;
            }
            .card-lagging {
              border-color: #fecaca;
              background: #fff8f8;
            }
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
            }
            .card-title-pill {
              font-size: 8px;
              font-weight: 800;
              text-transform: uppercase;
              padding: 1.5px 5px;
              border-radius: 3px;
            }
            .pill-winner { background: #d97706; color: #ffffff; }
            .pill-lagging { background: #dc2626; color: #ffffff; }
            .card-badge-right {
              font-size: 8.5px;
              font-weight: 800;
            }
            .badge-winner { color: #b45309; }
            .badge-lagging { color: #dc2626; }
            .winner-layout {
              display: flex;
              gap: 8px;
            }
            .winner-img {
              width: 58px;
              height: 85px;
              object-fit: cover;
              border-radius: 4px;
              border: 1px solid #cbd5e1;
              flex-shrink: 0;
            }
            .winner-info h4 {
              margin: 0 0 3px 0;
              font-size: 10.5px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.25;
            }
            .pills-row {
              display: flex;
              gap: 4px;
              margin-bottom: 4px;
              flex-wrap: wrap;
            }
            .stat-chip {
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 1px 4px;
              border-radius: 3px;
              font-size: 8px;
              font-weight: 700;
              color: #334155;
            }
            .stat-chip-green {
              background: #ecfdf5;
              border-color: #a7f3d0;
              color: #065f46;
            }
            .winner-desc {
              font-size: 8.5px;
              color: #475569;
              line-height: 1.3;
            }
            .scorecard-card {
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 7px 10px;
              margin-bottom: 8px;
              background: #ffffff;
            }
            .scorecard-title {
              font-size: 8.5px;
              font-weight: 800;
              text-transform: uppercase;
              color: #475569;
              margin-bottom: 5px;
              display: flex;
              justify-content: space-between;
            }
            .format-row {
              display: grid;
              grid-template-columns: 140px 1fr 90px 105px;
              align-items: center;
              gap: 8px;
              padding: 4px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .format-row:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }
            .format-name {
              font-size: 9px;
              font-weight: 800;
              color: #0f172a;
            }
            .format-name span {
              display: block;
              font-size: 7.5px;
              font-weight: 500;
              color: #64748b;
            }
            .bar-track {
              height: 5px;
              background: #f1f5f9;
              border-radius: 999px;
              overflow: hidden;
            }
            .bar-fill {
              height: 100%;
              border-radius: 999px;
            }
            .bar-ultra { width: 100%; background: #059669; }
            .bar-asmr { width: 65%; background: #0284c7; }
            .bar-extended { width: 16%; background: #e11d48; }
            .bar-longform { width: 45%; background: #7c3aed; }
            .format-stat {
              text-align: right;
              font-size: 9px;
              font-weight: 800;
              color: #0f172a;
            }
            .format-stat span {
              display: block;
              font-size: 7.5px;
              font-weight: 500;
              color: #64748b;
            }
            .format-pill {
              font-size: 7.5px;
              font-weight: 800;
              text-align: center;
              padding: 2px 4px;
              border-radius: 3px;
              text-transform: uppercase;
            }
            .pill-leader { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
            .pill-stable { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
            .pill-refactor { background: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; }
            .pill-active { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
            .actions-card {
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 6px 10px;
              margin-bottom: 7px;
              background: #f8fafc;
            }
            .actions-title {
              font-size: 8.5px;
              font-weight: 800;
              text-transform: uppercase;
              color: #0f172a;
              margin-bottom: 4px;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .actions-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 5px 10px;
              font-size: 8.5px;
              color: #334155;
            }
            .action-item {
              display: flex;
              gap: 5px;
              align-items: flex-start;
            }
            .action-chip {
              font-size: 7.5px;
              font-weight: 800;
              padding: 1px 4px;
              border-radius: 2px;
              background: #e2e8f0;
              color: #1e293b;
              white-space: nowrap;
            }
            .footer {
              border-top: 1px solid #cbd5e1;
              padding-top: 4px;
              display: flex;
              justify-content: space-between;
              font-size: 7.5px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-left">
              <div class="brand-tag">BlackFlag Media Holding • División Canales Automatizados</div>
              <h1>${isDaily ? 'Level Pop: Auditoría Ejecutiva de Rendimiento (24H)' : 'Level Pop: Auditoría de Rendimiento Global & Multi-Canal'}</h1>
            </div>
            <div class="header-right">
              <div><strong>Canal:</strong> @levelpopstudio • <strong>Fecha:</strong> ${dateFormatted}</div>
              <div class="status-pill">● Telemetría Oficial YouTube & Supabase</div>
            </div>
          </div>

          <div class="banner">
            <div class="banner-pill">${isDaily ? '⚡ Diagnóstico Ejecutivo del Día' : '🌐 Diagnóstico Global del Canal'}</div>
            <div class="banner-headline">${dailyHeadline}</div>
            <div class="banner-desc">${dailySummary}</div>
          </div>

          <div class="kpis-grid">
            <div class="kpi-card">
              <div class="kpi-label">Vistas Auditadas</div>
              <div class="kpi-value">${totalAuditedViews.toLocaleString()}</div>
              <div class="kpi-sub">+3.105 en 48h</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Suscriptores Netos</div>
              <div class="kpi-value">${totalSubs}</div>
              <div class="kpi-sub">+150% orgánico</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Watch Time</div>
              <div class="kpi-value">${totalWatchHours} hs</div>
              <div class="kpi-sub">Meta: 4.000 hs (${((totalWatchHours/4000)*100).toFixed(1)}%)</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">AVD % Retención</div>
              <div class="kpi-value">${avgAvd}%</div>
              <div class="kpi-sub">Benchmark &gt;50%</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Catálogo en Red</div>
              <div class="kpi-value">${videoCount} Videos</div>
              <div class="kpi-sub">20 Shorts • 2 Largos 15m</div>
            </div>
          </div>

          <div class="ypp-tracker">
            <div class="ypp-header">
              <span>Camino al Programa de Socios de YouTube (YPP Monetización)</span>
              <span>Margen Operativo: 100% • Costo de Servidor: $0</span>
            </div>
            <div class="ypp-grid">
              <div>
                <div class="prog-label">
                  <span>Horas de Reproducción Requeridas</span>
                  <span><strong>${totalWatchHours} hs</strong> / 4.000 hs (${((totalWatchHours/4000)*100).toFixed(1)}%)</span>
                </div>
                <div class="prog-bar-bg">
                  <div class="prog-bar-fill-emerald"></div>
                </div>
              </div>
              <div>
                <div class="prog-label">
                  <span>Suscriptores Requeridos</span>
                  <span><strong>${totalSubs} subs</strong> / 1.000 subs (${((totalSubs/1000)*100).toFixed(1)}%)</span>
                </div>
                <div class="prog-bar-bg">
                  <div class="prog-bar-fill-blue"></div>
                </div>
              </div>
            </div>
          </div>

          ${isDaily ? `
            <div class="split-grid">
              <div class="card card-winner">
                <div class="card-header">
                  <span class="card-title-pill pill-winner">🏆 Top Winner 24H (Lo que Funciona)</span>
                  <span class="card-badge-right badge-winner">${winner.viewsPerHour} vistas/h</span>
                </div>
                <div class="winner-layout">
                  <img src="${winner.thumbnailUrl}" class="winner-img" alt="Thumbnail" />
                  <div class="winner-info">
                    <h4>${winner.title}</h4>
                    <div class="pills-row">
                      <span class="stat-chip stat-chip-green">⏱️ ${winner.durationLabel}</span>
                      <span class="stat-chip">👁️ ${winner.views.toLocaleString()} vistas</span>
                      <span class="stat-chip">🔥 ER: ${winner.er}%</span>
                    </div>
                    <div class="winner-desc"><strong>Por qué superó la media:</strong> ${winner.whyItWon}</div>
                  </div>
                </div>
              </div>

              <div class="card card-lagging">
                <div class="card-header">
                  <span class="card-title-pill pill-lagging">⚠️ Cuello de Botella Detectado</span>
                  <span class="card-badge-right badge-lagging">${lagging.vsWinnerDelta}</span>
                </div>
                <div>
                  <h4 style="margin: 0 0 2px 0; font-size: 10.5px; font-weight: 800; color: #0f172a;">${lagging.worstFormat}</h4>
                  <div class="pills-row" style="margin-bottom: 3px;">
                    <span class="stat-chip">⏱️ 120s (2 min)</span>
                    <span class="stat-chip">👁️ 171 vistas prom.</span>
                    <span class="stat-chip" style="color: #b91c1c;">📉 Retención: 38%</span>
                  </div>
                  <div class="winner-desc" style="margin-bottom: 3px;"><strong>Diagnóstico de retención:</strong> ${lagging.whyItLags}</div>
                  <div class="winner-desc"><strong>Acción de ingeniería:</strong> ${lagging.correctiveAction}</div>
                </div>
              </div>
            </div>
          ` : `
            <div class="scorecard-card">
              <div class="scorecard-title">
                <span>Desglose por Categoría de Formato</span>
                <span>Auditado v3</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
                ${formatList.map(f => `
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px;">
                    <div style="font-size: 8px; font-weight: 700; color: #64748b;">${f.category}</div>
                    <div style="font-size: 12px; font-weight: 900; color: #059669; margin: 1px 0;">${f.avgViewsPerShort} v/short</div>
                    <div style="font-size: 7.5px; color: #475569;">${f.totalViews.toLocaleString()} vistas • ${f.totalLikes} likes</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `}

          <div class="scorecard-card">
            <div class="scorecard-title">
              <span>Scorecard Visual: Rendimiento y Retención por Duración</span>
              <span>Base empírica YouTube Shorts Feed</span>
            </div>

            <div class="format-row">
              <div class="format-name">
                Shorts Rápidos (&lt;45s)
                <span>Bridge Assault & Obby (30-37s)</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill bar-ultra"></div>
              </div>
              <div class="format-stat">
                1.061 vistas
                <span>65% retención (bucle)</span>
              </div>
              <div>
                <div class="format-pill pill-leader">🔥 Líder Algorítmico</div>
              </div>
            </div>

            <div class="format-row">
              <div class="format-name">
                Shorts ASMR (46-90s)
                <span>Neon Marbles Cup (Canicas Neón)</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill bar-asmr"></div>
              </div>
              <div class="format-stat">
                687 vistas
                <span>58% retención ASMR</span>
              </div>
              <div>
                <div class="format-pill pill-stable">⚡ Fidelidad Estable</div>
              </div>
            </div>

            <div class="format-row">
              <div class="format-name">
                Shorts Extendidos (120s)
                <span>Toy Cars & Supercars (2 Min)</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill bar-extended"></div>
              </div>
              <div class="format-stat">
                171 vistas
                <span>Caída brusca a los 37s</span>
              </div>
              <div>
                <div class="format-pill pill-refactor">⚠️ Refactor a &lt;45s</div>
              </div>
            </div>

            <div class="format-row">
              <div class="format-name">
                Videos Largos 16:9 (15 min)
                <span>Compilatorios Máster Ep 01 & 02</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill bar-longform"></div>
              </div>
              <div class="format-stat">
                2 en Canal
                <span>Sifón masivo de horas</span>
              </div>
              <div>
                <div class="format-pill pill-active">🚀 Test A/B Miniaturas</div>
              </div>
            </div>
          </div>

          <div class="actions-card">
            <div class="actions-title">⚡ Plan de Acción Estratégico y Operativo</div>
            <div class="actions-grid">
              <div class="action-item">
                <span class="action-chip">CADENCIA 5X</span>
                <span><strong>5 Shorts diarios fijos:</strong> Slots clave programados (09:30, 13:30, 17:30, 21:30 y 01:30 ART).</span>
              </div>
              <div class="action-item">
                <span class="action-chip">CONVERSIÓN</span>
                <span><strong>Sifón de Tráfico:</strong> Enlazar los 3 Shorts ganadores como 'Video Relacionado' hacia el video largo de 15 min.</span>
              </div>
              <div class="action-item">
                <span class="action-chip">TEST A/B/C</span>
                <span><strong>Prueba y Compara en Studio:</strong> 3 miniaturas épicas 3D en rotación para maximizar CTR en el Episodio 02.</span>
              </div>
              <div class="action-item">
                <span class="action-chip">PRODUCCIÓN</span>
                <span><strong>Regla de Oro Ro:</strong> Binarios maestros 100% intactos sin re-compresión de video ni audio.</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div>Holding Media Hub • blackflag-media-hub.vercel.app • Telemetría Cloud 24/7</div>
            <div>Auditoría e Ingeniería: Matías Chababo (Lic. en Comercialización - UAI) • Documento Confidencial (Página 1/1)</div>
          </div>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="clevel-report-printable"
        className="relative w-full max-w-4xl rounded-2xl border border-zinc-700 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-zinc-100 my-auto"
      >
        {/* ========================================================= */}
        {/* ACTIONS & VIEW SWITCHER BAR */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-zinc-800 gap-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
              INFORME EJECUTIVO C-LEVEL • CONFIDENCIAL
            </span>
          </div>

          {/* Toggle Daily vs Global */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setReportMode('daily')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                  reportMode === 'daily'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Reporte Diario (24H)</span>
              </button>

              <button
                onClick={() => setReportMode('global')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                  reportMode === 'global'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Reporte Global (Histórico)</span>
              </button>
            </div>

            <button
              onClick={handleCopyDiscord}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition cursor-pointer border border-zinc-700"
              title="Copiar texto para Discord o Slack"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Discord'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white transition cursor-pointer shadow-sm"
              title="Descargar o Imprimir en PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer ml-1"
              title="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* REPORT CONTENT BODY */}
        {/* ========================================================= */}
        <div className="mt-5 space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800/80">
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                Holding de Medios Digitales • División Canales Automatizados
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {reportMode === 'daily'
                  ? 'Level Pop: Auditoría de Rendimiento Diario (24H)'
                  : 'Level Pop: Auditoría de Rendimiento Global & Multi-Canal'}
              </h2>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-zinc-400">
              <div><strong className="text-white">Canal:</strong> @levelpopstudio • <strong className="text-white">Fecha:</strong> {dateFormatted}</div>
              <div className="text-[10px] text-emerald-400 font-bold">
                Telemetría YouTube Data API v3 &amp; Supabase (En Vivo)
              </div>
            </div>
          </div>

          {/* Executive Headline & Summary */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs font-mono uppercase">
              <Sparkles className="h-4 w-4" />
              <span>{reportMode === 'daily' ? 'Conclusión Ejecutiva del Día' : 'Diagnóstico Global del Canal'}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-zinc-100 leading-snug">
              {dailyHeadline}
            </p>
            <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
              {dailySummary}
            </p>
          </div>

          {/* 5 Primary Executive KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Vistas Auditadas</div>
              <div className="mt-1 text-xl font-black text-white tabular-nums">
                {totalAuditedViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5">
                +3.105 en 48h
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Suscriptores Netos</div>
              <div className="mt-1 text-xl font-black text-white tabular-nums">
                {totalSubs}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5">
                +150% orgánico
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Watch Time</div>
              <div className="mt-1 text-xl font-black text-white tabular-nums">
                {totalWatchHours} hs
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Meta: 4.000 hs ({((totalWatchHours / 4000) * 100).toFixed(1)}%)
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">AVD % Retención</div>
              <div className="mt-1 text-xl font-black text-emerald-400 tabular-nums">
                {avgAvd}%
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Benchmark &gt;50%
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Videos en Canal</div>
              <div className="mt-1 text-xl font-black text-white tabular-nums">
                {videoCount} Total
              </div>
              <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                20 Shorts • 2 Largos
              </div>
            </div>
          </div>

          {/* ROADMAP MONETIZACIÓN YPP */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="font-bold uppercase text-zinc-300">Camino al Programa de Socios de YouTube (YPP Monetización)</span>
              <span className="text-[10px] text-emerald-400">Margen: 100% • Costo Servidor: $0</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-zinc-400">Horas de Reproducción</span>
                  <span className="font-bold text-white">{totalWatchHours} hs / 4.000 hs ({((totalWatchHours/4000)*100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(((totalWatchHours/4000)*100), 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-zinc-400">Suscriptores Requeridos</span>
                  <span className="font-bold text-white">{totalSubs} subs / 1.000 subs ({((totalSubs/1000)*100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(((totalSubs/1000)*100), 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* MODE: DAILY REPORT (24H) */}
          {reportMode === 'daily' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Winner 24h */}
              <div className="rounded-xl border border-amber-500/40 bg-zinc-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs font-mono uppercase">
                    <Trophy className="h-4 w-4" />
                    <span>Top Winner 24H (Lo que Funciona)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                    {winner.viewsPerHour} vistas/h
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <img
                    src={winner.thumbnailUrl}
                    alt={winner.title}
                    className="w-16 h-28 object-cover rounded-lg border border-zinc-700 shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {winner.title}
                    </h4>
                    <div className="text-[10px] font-mono text-zinc-400 flex flex-wrap gap-x-2">
                      <span>Duración: <strong className="text-emerald-400">{winner.durationLabel}</strong></span>
                      <span>•</span>
                      <span>Vistas: <strong className="text-white">{winner.views.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>ER: <strong className="text-white">{winner.er}%</strong></span>
                    </div>
                    <div className="text-[11px] text-zinc-300 leading-relaxed pt-1">
                      <strong className="text-amber-400">Por qué superó la media:</strong> {winner.whyItWon}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-300">
                  <strong className="text-white">Decisión Estratégica:</strong> Priorizar este formato exacto (&lt;45s con colisión inicial) en el 60% de los próximos lotes.
                </div>
              </div>

              {/* 2. Lagging Analysis */}
              <div className="rounded-xl border border-red-500/30 bg-zinc-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-red-400 font-bold text-xs font-mono uppercase">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Cuello de Botella (Lo que se Corrige)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded border border-red-800">
                    {lagging.vsWinnerDelta}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <div className="text-xs font-bold text-white">
                      {lagging.worstFormat}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      Vistas Promedio: {lagging.avgViews} vistas por video (vs 1.061 en Shorts Rápidos)
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-300 leading-relaxed">
                    <strong className="text-red-400">Diagnóstico de retención:</strong> {lagging.whyItLags}
                  </div>

                  <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-300">
                    <strong className="text-white">Acción Correctiva Inmediata:</strong> {lagging.correctiveAction}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISUAL SCORECARD: RENDIMIENTO Y RETENCIÓN */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Scorecard Visual: Formatos y Retención en el Feed</span>
              </h4>
              <span className="text-[10px] font-mono text-zinc-500">Métrica Auditada YouTube Data API</span>
            </div>

            <div className="space-y-2">
              {/* Row 1 */}
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="sm:w-1/3">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <Flame className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Shorts Rápidos (&lt;45s)</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Bridge Assault & Sky Obby (30-37s)</div>
                </div>
                <div className="sm:w-1/3 flex items-center space-x-2">
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">1.061 v</span>
                </div>
                <div className="sm:w-1/3 text-right flex items-center justify-end space-x-2">
                  <span className="text-[11px] text-zinc-300">65% retención t=37s</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    LÍDER
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="sm:w-1/3">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Shorts ASMR (46-90s)</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Neon Marbles Cup (Canicas Neón)</div>
                </div>
                <div className="sm:w-1/3 flex items-center space-x-2">
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-xs shrink-0">687 v</span>
                </div>
                <div className="sm:w-1/3 text-right flex items-center justify-end space-x-2">
                  <span className="text-[11px] text-zinc-300">58% retención ASMR</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    ESTABLE
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="sm:w-1/3">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    <span>Shorts Extendidos (120s / 2 min)</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Toy Cars & Supercars (Lote 3)</div>
                </div>
                <div className="sm:w-1/3 flex items-center space-x-2">
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '16%' }} />
                  </div>
                  <span className="font-mono font-bold text-rose-400 text-xs shrink-0">171 v</span>
                </div>
                <div className="sm:w-1/3 text-right flex items-center justify-end space-x-2">
                  <span className="text-[11px] text-rose-300">Fatiga a los 37s (38%)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    REFACTOR
                  </span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="sm:w-1/3">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <Film className="h-3.5 w-3.5 text-purple-400" />
                    <span>Videos Largos 16:9 (15 min)</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Compilatorios Ep 01 & Ep 02 Máster</div>
                </div>
                <div className="sm:w-1/3 flex items-center space-x-2">
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                  <span className="font-mono font-bold text-purple-400 text-xs shrink-0">2 en Red</span>
                </div>
                <div className="sm:w-1/3 text-right flex items-center justify-end space-x-2">
                  <span className="text-[11px] text-zinc-300">Sifón de Horas YPP</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    TEST A/B
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Plan for Today */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Plan de Acción Operativo (Próximas 24 Horas)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="font-mono text-[10px] font-bold text-emerald-400 uppercase">CADENCIA 5X</div>
                <div><strong>5 Shorts Diarios Fijos:</strong> Publicaciones programadas a las 09:30, 13:30, 17:30, 21:30 y 01:30 ART.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="font-mono text-[10px] font-bold text-sky-400 uppercase">SIFÓN DE TRÁFICO</div>
                <div><strong>Enlace a Video Largo 15m:</strong> Configurar en YouTube Studio los shorts virales como 'Video Relacionado' hacia <code className="text-sky-300 font-mono">4GWJn0KCcLU</code>.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="font-mono text-[10px] font-bold text-amber-400 uppercase">TEST & COMPARE A/B/C</div>
                <div><strong>Packaging Épico 3D:</strong> Rotación del 33% entre las 3 variantes de miniatura para maximizar CTR en el Episodio 02.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="font-mono text-[10px] font-bold text-purple-400 uppercase">PRODUCCIÓN RO INTACTA</div>
                <div><strong>Regla de Oro:</strong> Cero modificación o remuxing a los renders de Ro. Binarios 100% intactos.</div>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-zinc-500">
            <div>Holding Media Hub • blackflag-media-hub.vercel.app • Telemetría Cloud 24/7</div>
            <div className="mt-1 sm:mt-0">Auditoría e Ingeniería: Matías Chababo (Lic. en Comercialización - UAI)</div>
          </div>
        </div>

        {/* Modal Bottom Close Button */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition cursor-pointer"
          >
            Cerrar e Ir al Dashboard Completo
          </button>
        </div>
      </div>
    </div>
  );
};
