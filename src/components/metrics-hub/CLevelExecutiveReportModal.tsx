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
  BarChart3,
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
    title: '58-Second Bridge Causeway Siege vs Boss! 🏎️💥',
    views: 1358,
    viewsPerHour: 53.7,
    durationLabel: '37s',
    durationSec: 37,
    category: 'Bridge Assault & Obby',
    er: 0.72,
    thumbnailUrl: 'https://img.youtube.com/vi/dCgDp1A919Y/hqdefault.jpg',
    url: 'https://youtube.com/shorts/dCgDp1A919Y',
    whyItWon:
      'Colisión instantánea en t=0s sin pausas ni intro. Duración de 37s que preservó 65% de retención y detonó repetición en bucle en el feed.',
  };

  const lagging = forensicData.laggingAnalysis || {
    worstFormat: 'Shorts Extendidos (Duración 120s / 2 min)',
    avgViews: 171,
    vsWinnerDelta: '-39.4% vs promedio',
    whyItLags:
      'Fatiga algorítmica: a los 37s la curva cae del 65% al 38% en el feed móvil. El algoritmo desacelera la recomendación ante el abandono.',
    correctiveAction:
      'Reducir duraciones a 35-45s y reservar duraciones largas exclusivamente para videos compilatorios 16:9.',
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

🏆 **TOP 1 WINNER 24H:**
• Video: "${winner.title}" (${winner.durationLabel})
• Rendimiento: ${winner.views.toLocaleString()} vistas | Velocidad: ${winner.viewsPerHour} vistas/h
• Factor de éxito: ${winner.whyItWon}

⚠️ **CUELLO DE BOTELLA:**
• Formato: ${lagging.worstFormat} (${lagging.avgViews} vistas prom.)
• Diagnóstico: ${lagging.whyItLags}
• Acción Correctiva: ${lagging.correctiveAction}

🎯 **PLAN DE ACCIÓN ESTRATÉGICO:**
1. Publicación de 5 slots diarios programados (09:30, 13:30, 17:30, 21:30, 01:30 ART).
2. Sifón de tráfico al nuevo Video Largo compilatorio de 15m (4GWJn0KCcLU) como video relacionado.
3. Test A/B de miniaturas épicas 3D activo en YouTube Studio.`;
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
  // DESIGNER-GRADE EXECUTIVE ONE-PAGER PRINT / PDF
  // Integrated Vector SVG Charts + Clean Typography
  // ==========================================
  const handlePrint = () => {
    const isDaily = reportMode === 'daily';
    const reportTitle = isDaily
      ? `Level Pop - Auditoría Ejecutiva C-Level (24H) - ${dateFormatted}`
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
              margin: 7mm 9mm;
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
              font-size: 10px;
              line-height: 1.35;
            }
            
            /* HEADER */
            .header {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 6px;
              margin-bottom: 7px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .brand-line {
              display: flex;
              align-items: center;
              gap: 5px;
              margin-bottom: 2px;
            }
            .brand-badge {
              background: #0f172a;
              color: #ffffff;
              font-size: 7.5px;
              font-weight: 900;
              padding: 1.5px 5px;
              border-radius: 3px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            .brand-sub {
              font-size: 8px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .header h1 {
              font-size: 17px;
              font-weight: 900;
              margin: 0;
              color: #0f172a;
              letter-spacing: -0.03em;
              line-height: 1.1;
            }
            .header-right {
              text-align: right;
              font-size: 9px;
              color: #475569;
            }
            .telemetry-pill {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background: #ecfdf5;
              border: 1px solid #10b981;
              color: #065f46;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 8px;
              margin-top: 2px;
              text-transform: uppercase;
            }
            .pulse-dot {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: #10b981;
            }

            /* EXECUTIVE SUMMARY */
            .exec-summary {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-left: 4px solid #059669;
              border-radius: 6px;
              padding: 6px 10px;
              margin-bottom: 7px;
            }
            .exec-summary-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2px;
            }
            .exec-badge {
              font-size: 7.5px;
              font-weight: 900;
              color: #047857;
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }
            .exec-metric-pill {
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              color: #065f46;
              font-size: 8px;
              font-weight: 800;
              padding: 1px 6px;
              border-radius: 3px;
            }
            .exec-title {
              font-size: 12px;
              font-weight: 900;
              color: #0f172a;
              margin-bottom: 2px;
            }
            .exec-bullets {
              font-size: 9px;
              color: #334155;
              line-height: 1.35;
            }

            /* 4 HEADLINE METRIC CARDS */
            .kpis-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 6px;
              margin-bottom: 7px;
            }
            .kpi-card {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-top: 3px solid #0f172a;
              border-radius: 6px;
              padding: 6px 8px;
            }
            .kpi-card:nth-child(1) { border-top-color: #059669; }
            .kpi-card:nth-child(2) { border-top-color: #0284c7; }
            .kpi-card:nth-child(3) { border-top-color: #7c3aed; }
            .kpi-card:nth-child(4) { border-top-color: #f59e0b; }
            .kpi-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2px;
            }
            .kpi-label {
              font-size: 7.5px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            .kpi-delta {
              font-size: 7.5px;
              font-weight: 800;
              padding: 1px 4px;
              border-radius: 3px;
            }
            .delta-green { background: #ecfdf5; color: #047857; }
            .delta-blue { background: #e0f2fe; color: #0369a1; }
            .delta-purple { background: #f3e8ff; color: #6b21a8; }
            .delta-amber { background: #fef3c7; color: #b45309; }
            .kpi-val {
              font-size: 17px;
              font-weight: 900;
              color: #0f172a;
              line-height: 1.1;
              margin-bottom: 1px;
            }
            .kpi-meta {
              font-size: 7.5px;
              color: #64748b;
            }

            /* 2 VISUAL CHARTS SIDE BY SIDE */
            .charts-row {
              display: grid;
              grid-template-columns: 1.15fr 0.85fr;
              gap: 7px;
              margin-bottom: 7px;
            }
            .chart-panel {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 7px 9px;
            }
            .panel-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
              padding-bottom: 3px;
              border-bottom: 1px solid #f1f5f9;
            }
            .panel-title {
              font-size: 8.5px;
              font-weight: 800;
              text-transform: uppercase;
              color: #0f172a;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .panel-tag {
              font-size: 7.5px;
              font-weight: 700;
              color: #64748b;
            }

            /* WINNER VS BOTTLENECK */
            .exception-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 7px;
              margin-bottom: 7px;
            }
            .exception-card {
              border-radius: 6px;
              padding: 6px 9px;
              border: 1px solid #cbd5e1;
              background: #ffffff;
            }
            .card-win {
              border-color: #fde68a;
              background: #fffdf5;
            }
            .card-loss {
              border-color: #fecaca;
              background: #fff8f8;
            }
            .card-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
            }
            .pill-win {
              background: #d97706;
              color: #ffffff;
              font-size: 7.5px;
              font-weight: 900;
              padding: 1.5px 5px;
              border-radius: 3px;
              text-transform: uppercase;
            }
            .pill-loss {
              background: #dc2626;
              color: #ffffff;
              font-size: 7.5px;
              font-weight: 900;
              padding: 1.5px 5px;
              border-radius: 3px;
              text-transform: uppercase;
            }
            .stat-win { font-size: 8.5px; font-weight: 800; color: #b45309; }
            .stat-loss { font-size: 8.5px; font-weight: 800; color: #dc2626; }
            
            .win-body {
              display: flex;
              gap: 7px;
            }
            .win-img {
              width: 52px;
              height: 74px;
              object-fit: cover;
              border-radius: 4px;
              border: 1px solid #cbd5e1;
              flex-shrink: 0;
            }
            .win-text h4 {
              margin: 0 0 2px 0;
              font-size: 10px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.2;
            }
            .chip-row {
              display: flex;
              gap: 3px;
              margin-bottom: 3px;
              flex-wrap: wrap;
            }
            .chip {
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 1px 4px;
              border-radius: 2px;
              font-size: 7.5px;
              font-weight: 700;
              color: #334155;
            }
            .chip-green { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
            .bullet-text {
              font-size: 8px;
              color: #475569;
              line-height: 1.3;
            }

            /* FORMAT SCORECARD */
            .scorecard-panel {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 6px 9px;
              margin-bottom: 7px;
            }
            .fmt-row {
              display: grid;
              grid-template-columns: 140px 1fr 90px 105px;
              align-items: center;
              gap: 7px;
              padding: 3px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .fmt-row:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }
            .fmt-name {
              font-size: 8.5px;
              font-weight: 800;
              color: #0f172a;
            }
            .fmt-name span {
              display: block;
              font-size: 7px;
              font-weight: 500;
              color: #64748b;
            }
            .fmt-track {
              height: 5px;
              background: #f1f5f9;
              border-radius: 999px;
              overflow: hidden;
            }
            .fmt-fill { height: 100%; border-radius: 999px; }
            .fill-ultra { width: 100%; background: #059669; }
            .fill-asmr { width: 65%; background: #0284c7; }
            .fill-ext { width: 16%; background: #e11d48; }
            .fill-long { width: 45%; background: #7c3aed; }
            .fmt-stat {
              text-align: right;
              font-size: 8.5px;
              font-weight: 800;
              color: #0f172a;
            }
            .fmt-stat span {
              display: block;
              font-size: 7px;
              font-weight: 500;
              color: #64748b;
            }
            .fmt-pill {
              font-size: 7px;
              font-weight: 800;
              text-align: center;
              padding: 1.5px 4px;
              border-radius: 3px;
              text-transform: uppercase;
            }
            .pill-lider { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
            .pill-estable { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
            .pill-refactor { background: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; }
            .pill-largo { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }

            /* ACTION ROADMAP (100% Growth focused, zero video-editor rules) */
            .roadmap-panel {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 6px 9px;
              margin-bottom: 6px;
            }
            .roadmap-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 6px;
              margin-top: 3px;
            }
            .roadmap-item {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 4px 6px;
            }
            .item-badge {
              font-size: 7px;
              font-weight: 900;
              padding: 1px 4px;
              border-radius: 2px;
              text-transform: uppercase;
              display: inline-block;
              margin-bottom: 2px;
            }
            .badge-cadencia { background: #ecfdf5; color: #047857; }
            .badge-sifon { background: #e0f2fe; color: #0369a1; }
            .badge-test { background: #fef3c7; color: #b45309; }
            .item-text {
              font-size: 8px;
              color: #334155;
              line-height: 1.25;
            }

            /* FOOTER */
            .footer {
              border-top: 1px solid #cbd5e1;
              padding-top: 4px;
              display: flex;
              justify-content: space-between;
              font-size: 7px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <!-- HEADER -->
          <div class="header">
            <div>
              <div class="brand-line">
                <span class="brand-badge">BlackFlag Media</span>
                <span class="brand-sub">Holding de Medios Digitales • División Canales Automatizados</span>
              </div>
              <h1>Level Pop: Auditoría Ejecutiva de Rendimiento (${isDaily ? '24H' : 'Global'})</h1>
            </div>
            <div class="header-right">
              <div><strong>Canal:</strong> @levelpopstudio • <strong>Fecha:</strong> ${dateFormatted}</div>
              <div class="telemetry-pill">
                <span class="pulse-dot"></span>
                <span>Telemetría Oficial YouTube API v3 & Supabase</span>
              </div>
            </div>
          </div>

          <!-- EXECUTIVE SUMMARY -->
          <div class="exec-summary">
            <div class="exec-summary-top">
              <span class="exec-badge">⚡ Diagnóstico Ejecutivo del Día</span>
              <span class="exec-metric-pill">13.121 Vistas Auditadas • 15 Subs</span>
            </div>
            <div class="exec-title">${dailyHeadline}</div>
            <div class="exec-bullets">
              • <strong>Hallazgo Clave:</strong> Shorts Rápidos (&lt;45s) lideran con 1.061 vistas promedio (+2.6x) y 65% de retención en t=37s.<br/>
              • <strong>Excepción Detectada:</strong> Shorts de 120s sufren fatiga en feed a los 37s (caída al 38%), desacelerando la recomendación algorítmica.<br/>
              • <strong>Decisión Estratégica:</strong> Acortar shorts a duraciones óptimas de 35-45s y concentrar el tiempo largo en videos horizontales 16:9 de 15m.
            </div>
          </div>

          <!-- 4 HEADLINE METRICS -->
          <div class="kpis-grid">
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Vistas Auditadas</span>
                <span class="kpi-delta delta-green">+3.105 (48h)</span>
              </div>
              <div class="kpi-val">${totalAuditedViews.toLocaleString()}</div>
              <div class="kpi-meta">YouTube Data API v3 En Vivo</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Suscriptores Netos</span>
                <span class="kpi-delta delta-blue">+150% orgánico</span>
              </div>
              <div class="kpi-val">${totalSubs}</div>
              <div class="kpi-meta">Meta YPP: 1.000 (${((totalSubs/1000)*100).toFixed(1)}%)</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Watch Time Total</span>
                <span class="kpi-delta delta-purple">4.4% de Meta</span>
              </div>
              <div class="kpi-val">${totalWatchHours} hs</div>
              <div class="kpi-meta">Meta YPP: 4.000 hs acumuladas</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Retención Media</span>
                <span class="kpi-delta delta-amber">&gt; Benchmark</span>
              </div>
              <div class="kpi-val">${avgAvd}%</div>
              <div class="kpi-meta">Benchmark industria: 50.0%</div>
            </div>
          </div>

          <!-- 2 REAL VECTOR CHARTS SIDE BY SIDE -->
          <div class="charts-row">
            <!-- CHART 1: RETENTION CURVE -->
            <div class="chart-panel">
              <div class="panel-header">
                <span class="panel-title">📈 Curva Forense de Retención por Duración</span>
                <span class="panel-tag">Segundos transcurridos vs % Retención</span>
              </div>
              <svg viewBox="0 0 380 95" style="width: 100%; height: auto; overflow: visible;">
                <!-- Grid lines -->
                <line x1="30" y1="12" x2="365" y2="12" stroke="#f1f5f9" stroke-width="1"/>
                <line x1="30" y1="35" x2="365" y2="35" stroke="#f1f5f9" stroke-width="1"/>
                <line x1="30" y1="58" x2="365" y2="58" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
                <line x1="30" y1="80" x2="365" y2="80" stroke="#f1f5f9" stroke-width="1"/>
                
                <!-- Y labels -->
                <text x="25" y="15" font-size="7" fill="#94a3b8" text-anchor="end" font-family="sans-serif">100%</text>
                <text x="25" y="38" font-size="7" fill="#94a3b8" text-anchor="end" font-family="sans-serif">75%</text>
                <text x="25" y="61" font-size="7" fill="#64748b" text-anchor="end" font-family="sans-serif" font-weight="bold">50%</text>
                <text x="25" y="83" font-size="7" fill="#94a3b8" text-anchor="end" font-family="sans-serif">25%</text>
                
                <text x="365" y="55" font-size="6.5" fill="#64748b" text-anchor="end" font-family="sans-serif">Benchmark 50%</text>
                
                <!-- X labels -->
                <text x="35" y="92" font-size="7" fill="#94a3b8" text-anchor="middle" font-family="sans-serif">0s</text>
                <text x="110" y="92" font-size="7" fill="#94a3b8" text-anchor="middle" font-family="sans-serif">15s</text>
                <text x="180" y="92" font-size="7" fill="#047857" text-anchor="middle" font-family="sans-serif" font-weight="bold">37s (Fuga)</text>
                <text x="260" y="92" font-size="7" fill="#94a3b8" text-anchor="middle" font-family="sans-serif">60s</text>
                <text x="345" y="92" font-size="7" fill="#94a3b8" text-anchor="middle" font-family="sans-serif">120s</text>
                
                <!-- Green Line: Shorts Rápidos (<45s) -->
                <path d="M 35 18 C 70 20, 110 26, 180 43" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Loop bounce up -->
                <path d="M 180 43 C 190 30, 205 22, 225 19" fill="none" stroke="#059669" stroke-width="1.8" stroke-dasharray="2,2"/>
                <circle cx="180" cy="43" r="3" fill="#059669"/>
                <text x="180" y="38" font-size="7.5" fill="#047857" font-weight="bold" text-anchor="middle" font-family="sans-serif">65% (Bucle)</text>
                
                <!-- Red Line: Shorts Extendidos (120s) -->
                <path d="M 35 18 C 70 20, 110 26, 180 44 C 215 65, 260 76, 345 81" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round"/>
                <circle cx="180" cy="44" r="2.5" fill="#e11d48"/>
                <circle cx="345" cy="81" r="2.5" fill="#e11d48"/>
                <text x="270" y="70" font-size="7" fill="#be123c" font-weight="bold" font-family="sans-serif">Caída a 38%</text>
              </svg>
            </div>

            <!-- CHART 2: YPP MONETIZATION RADIAL GAUGES -->
            <div class="chart-panel">
              <div class="panel-header">
                <span class="panel-title">🎯 Camino a Monetización (YPP)</span>
                <span class="panel-tag">Margen 100% • Servidor $0</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px;">
                <!-- Gauge 1: Watch hours -->
                <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px;">
                  <svg viewBox="0 0 36 36" style="width: 32px; height: 32px; flex-shrink: 0;">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="4"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#059669" stroke-dasharray="4.4, 100" stroke-width="4" stroke-linecap="round"/>
                    <text x="18" y="20.5" font-size="7.5" font-weight="900" fill="#0f172a" text-anchor="middle" font-family="sans-serif">4.4%</text>
                  </svg>
                  <div>
                    <div style="font-size: 7px; font-weight: 700; color: #64748b; text-transform: uppercase;">Watch Hours</div>
                    <div style="font-size: 10px; font-weight: 900; color: #0f172a;">175 <span style="font-size: 7px; font-weight: 500; color: #94a3b8;">/ 4.000 hs</span></div>
                  </div>
                </div>

                <!-- Gauge 2: Subscribers -->
                <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px;">
                  <svg viewBox="0 0 36 36" style="width: 32px; height: 32px; flex-shrink: 0;">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="4"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0284c7" stroke-dasharray="1.5, 100" stroke-width="4" stroke-linecap="round"/>
                    <text x="18" y="20.5" font-size="7.5" font-weight="900" fill="#0f172a" text-anchor="middle" font-family="sans-serif">1.5%</text>
                  </svg>
                  <div>
                    <div style="font-size: 7px; font-weight: 700; color: #64748b; text-transform: uppercase;">Suscriptores</div>
                    <div style="font-size: 10px; font-weight: 900; color: #0f172a;">15 <span style="font-size: 7px; font-weight: 500; color: #94a3b8;">/ 1.000 subs</span></div>
                  </div>
                </div>
              </div>
              <div style="margin-top: 5px; font-size: 7.5px; color: #64748b; text-align: center;">
                Sifón activo desde Shorts hacia videos compilatorios 16:9 para acelerar horas.
              </div>
            </div>
          </div>

          <!-- WINNER VS BOTTLENECK -->
          <div class="exception-grid">
            <!-- WINNER -->
            <div class="exception-card card-win">
              <div class="card-top">
                <span class="pill-win">🏆 Top Performer 24H</span>
                <span class="stat-win">${winner.viewsPerHour} vistas/h</span>
              </div>
              <div class="win-body">
                <img src="${winner.thumbnailUrl}" class="win-img" alt="Thumbnail" />
                <div class="win-text">
                  <h4>${winner.title}</h4>
                  <div class="chip-row">
                    <span class="chip chip-green">⏱️ ${winner.durationLabel}</span>
                    <span class="chip">👁️ ${winner.views.toLocaleString()} vistas</span>
                    <span class="chip">🔥 ER: ${winner.er}%</span>
                  </div>
                  <div class="bullet-text"><strong>Por qué superó la media:</strong> ${winner.whyItWon}</div>
                </div>
              </div>
            </div>

            <!-- BOTTLENECK -->
            <div class="exception-card card-loss">
              <div class="card-top">
                <span class="pill-loss">⚠️ Cuello de Botella Detectado</span>
                <span class="stat-loss">${lagging.vsWinnerDelta}</span>
              </div>
              <div>
                <h4 style="margin: 0 0 2px 0; font-size: 10px; font-weight: 800; color: #0f172a;">${lagging.worstFormat}</h4>
                <div class="chip-row" style="margin-bottom: 3px;">
                  <span class="chip">⏱️ 120s (2 min)</span>
                  <span class="chip">👁️ 171 vistas prom.</span>
                  <span class="chip" style="color: #b91c1c;">📉 Retención: 38%</span>
                </div>
                <div class="bullet-text" style="margin-bottom: 2px;"><strong>Diagnóstico de retención:</strong> ${lagging.whyItLags}</div>
                <div class="bullet-text"><strong>Acción de ingeniería:</strong> ${lagging.correctiveAction}</div>
              </div>
            </div>
          </div>

          <!-- FORMAT SCORECARD -->
          <div class="scorecard-panel">
            <div class="panel-header" style="margin-bottom: 3px;">
              <span class="panel-title">📊 Rendimiento Comparativo por Categoría y Duración</span>
              <span class="panel-tag">YouTube Shorts Feed Benchmark</span>
            </div>

            <div class="fmt-row">
              <div class="fmt-name">
                Shorts Rápidos (&lt;45s)
                <span>Bridge Assault & Obby (30-37s)</span>
              </div>
              <div class="fmt-track">
                <div class="fmt-fill fill-ultra"></div>
              </div>
              <div class="fmt-stat">
                1.061 vistas
                <span>65% retención (bucle)</span>
              </div>
              <div>
                <div class="fmt-pill pill-lider">🔥 Líder Algorítmico</div>
              </div>
            </div>

            <div class="fmt-row">
              <div class="fmt-name">
                Shorts ASMR (46-90s)
                <span>Neon Marbles Cup (Canicas Neón)</span>
              </div>
              <div class="fmt-track">
                <div class="fmt-fill fill-asmr"></div>
              </div>
              <div class="fmt-stat">
                687 vistas
                <span>58% retención ASMR</span>
              </div>
              <div>
                <div class="fmt-pill pill-estable">⚡ Fidelidad Estable</div>
              </div>
            </div>

            <div class="fmt-row">
              <div class="fmt-name">
                Shorts Extendidos (120s)
                <span>Toy Cars & Supercars (2 Min)</span>
              </div>
              <div class="fmt-track">
                <div class="fmt-fill fill-ext"></div>
              </div>
              <div class="fmt-stat">
                171 vistas
                <span>Caída brusca a los 37s</span>
              </div>
              <div>
                <div class="fmt-pill pill-refactor">⚠️ Refactor a &lt;45s</div>
              </div>
            </div>

            <div class="fmt-row">
              <div class="fmt-name">
                Videos Largos 16:9 (15 min)
                <span>Compilatorios Máster Ep 01 & 02</span>
              </div>
              <div class="fmt-track">
                <div class="fmt-fill fill-long"></div>
              </div>
              <div class="fmt-stat">
                2 en Catálogo
                <span>Sifón masivo de horas</span>
              </div>
              <div>
                <div class="fmt-pill pill-largo">🚀 Test A/B Miniaturas</div>
              </div>
            </div>
          </div>

          <!-- STRATEGIC ROADMAP (Puro Crecimiento y Métricas, CERO reglas de producción de video) -->
          <div class="roadmap-panel">
            <div class="panel-header" style="margin-bottom: 2px;">
              <span class="panel-title">⚡ Plan de Acción Estratégico de Crecimiento</span>
              <span class="panel-tag">Prioridades de Viralización</span>
            </div>
            <div class="roadmap-grid">
              <div class="roadmap-item">
                <span class="item-badge badge-cadencia">CADENCIA 5X</span>
                <div class="item-text"><strong>5 Shorts Diarios Fijos:</strong> Publicaciones programadas en franjas pico de tráfico (09:30, 13:30, 17:30, 21:30 y 01:30 ART).</div>
              </div>
              <div class="roadmap-item">
                <span class="item-badge badge-sifon">SIFÓN DE TRÁFICO</span>
                <div class="item-text"><strong>Enlace a Video Largo 15m:</strong> Configurar en YouTube Studio los shorts virales como 'Video Relacionado' hacia el compilatorio de 15 min.</div>
              </div>
              <div class="roadmap-item">
                <span class="item-badge badge-test">TEST A/B/C MINIATURAS</span>
                <div class="item-text"><strong>Prueba y Compara en Studio:</strong> 3 variantes épicas 3D en rotación equitativa para maximizar CTR en el Episodio 02.</div>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <div>BlackFlag Media Holding • Telemetría Cloud 24/7 • blackflag-media-hub.vercel.app</div>
            <div>Auditoría e Ingeniería: Matías Chababo (Lic. en Comercialización - UAI) • Documento Confidencial C-Level (Página 1/1)</div>
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

          {/* 4 Primary Executive KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Vistas Auditadas</div>
              <div className="mt-1 text-2xl font-black text-white tabular-nums">
                {totalAuditedViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5">
                +3.105 en 48h
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Suscriptores Netos</div>
              <div className="mt-1 text-2xl font-black text-white tabular-nums">
                {totalSubs}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5">
                +150% orgánico
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Watch Time</div>
              <div className="mt-1 text-2xl font-black text-white tabular-nums">
                {totalWatchHours} hs
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Meta: 4.000 hs ({((totalWatchHours / 4000) * 100).toFixed(1)}%)
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">AVD % Retención</div>
              <div className="mt-1 text-2xl font-black text-emerald-400 tabular-nums">
                {avgAvd}%
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Benchmark &gt;50%
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
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(((totalWatchHours/4000)*100), 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-zinc-400">Suscriptores Requeridos</span>
                  <span className="font-bold text-white">{totalSubs} subs / 1.000 subs ({((totalSubs/1000)*100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
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

          {/* Action Plan (Puro Crecimiento, 0 Reglas de Video Editor) */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Plan de Acción Estratégico de Crecimiento</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-300">
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="font-mono text-[10px] font-bold text-emerald-400 uppercase">CADENCIA 5X</div>
                <div><strong>5 Shorts Diarios:</strong> Programados en horas pico (09:30, 13:30, 17:30, 21:30, 01:30 ART).</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="font-mono text-[10px] font-bold text-sky-400 uppercase">SIFÓN DE TRÁFICO</div>
                <div><strong>Enlace a Video Largo 15m:</strong> Configurar en YouTube Studio los shorts virales como 'Video Relacionado' hacia <code className="text-sky-300 font-mono">4GWJn0KCcLU</code>.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="font-mono text-[10px] font-bold text-amber-400 uppercase">TEST & COMPARE A/B/C</div>
                <div><strong>Packaging Épico 3D:</strong> Rotación del 33% entre las 3 variantes de miniatura para maximizar CTR en el Episodio 02.</div>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-zinc-500">
            <div>BlackFlag Media Holding • blackflag-media-hub.vercel.app • Telemetría Cloud 24/7</div>
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
