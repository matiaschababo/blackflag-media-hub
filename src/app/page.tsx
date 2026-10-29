'use client';

import React, { useState, useMemo } from 'react';
import { useHolding } from '../context/HoldingContext';
import { Clip, ForensicAnalyticsData } from '../types';
import levelpopForensicFallback from '../data/levelpop_forensic_analytics.json';
import { Check } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { SubnavHeader } from '../components/layout/SubnavHeader';
import { ChannelAndPlatformBar } from '../components/layout/ChannelAndPlatformBar';
import { GlobalHoldingOverview } from '../components/content-manager/GlobalHoldingOverview';
import { LongformManager } from '../components/content-manager/LongformManager';
import { ClipsMatrix } from '../components/content-manager/ClipsMatrix';
import { ParrillaPublicacion } from '../components/content-manager/ParrillaPublicacion';
import { EpisodeManager } from '../components/content-manager/EpisodeManager';
import { StockRadar } from '../components/content-manager/StockRadar';
import { ContentOverview } from '../components/content-manager/ContentOverview';
import { TelegramBotEngine } from '../components/content-manager/TelegramBotEngine';
import { SwarmCommandCenter } from '../components/content-manager/SwarmCommandCenter';
import { MetricsOverview } from '../components/metrics-hub/MetricsOverview';
import { RetentionCurveChart } from '../components/metrics-hub/RetentionCurveChart';
import { PlatformComparisonChart } from '../components/metrics-hub/PlatformComparisonChart';
import { ABTestingTracker } from '../components/metrics-hub/ABTestingTracker';
import { ForensicShortsTable } from '../components/metrics-hub/ForensicShortsTable';
import { CrossFormatDurationAnalytics } from '../components/metrics-hub/CrossFormatDurationAnalytics';
import { SwarmIntelligenceInsights } from '../components/metrics-hub/SwarmIntelligenceInsights';
import { CLevelExecutiveReportModal } from '../components/metrics-hub/CLevelExecutiveReportModal';
import { NewChannelModal } from '../components/modals/NewChannelModal';
import { ClipDetailModal } from '../components/modals/ClipDetailModal';

export default function Home() {
  const {
    mode,
    contentTab,
    metricsTab,
    toastMessage,
    currentChannel,
    selectedChannelId,
    selectedFormat,
  } = useHolding();

  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedClipForDetail, setSelectedClipForDetail] = useState<Clip | null>(null);

  // Forensic data for C-Level Report
  const forensicData: ForensicAnalyticsData = useMemo(() => {
    if (currentChannel.stats?.forensic_analytics?.channel) {
      return currentChannel.stats.forensic_analytics;
    }
    return levelpopForensicFallback as unknown as ForensicAnalyticsData;
  }, [currentChannel]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Navbar */}
      <Navbar onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <Sidebar onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)} />

        {/* Dynamic Center Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1640px] mx-auto overflow-y-auto">
          {/* Universal Channel, Multi-Platform & Format Command Bar */}
          <ChannelAndPlatformBar onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)} />

          {/* Subnav Header for secondary view tabs */}
          <SubnavHeader onOpenReport={() => setIsReportOpen(true)} />

          {/* ========================================================= */}
          {/* CONTENT MANAGER (OPERACIONES)                             */}
          {/* ========================================================= */}
          {mode === 'content_manager' && (
            <>
              {/* If Longform format selected OR longform tab active */}
              {(contentTab === 'longform' || selectedFormat === 'LONGFORM') && (
                <LongformManager />
              )}

              {/* Arbitrage 360 view or Holding Global Overview when in 'all' */}
              {selectedFormat !== 'LONGFORM' &&
                (contentTab === 'arbitrage_360' || (selectedChannelId === 'all' && contentTab === 'overview')) && (
                  <GlobalHoldingOverview />
                )}

              {/* Standard Channel Overview when a specific channel is selected */}
              {selectedFormat !== 'LONGFORM' &&
                selectedChannelId !== 'all' &&
                contentTab === 'overview' && (
                  <ContentOverview />
                )}

              {/* Clips Matrix (Shorts) */}
              {selectedFormat !== 'LONGFORM' && contentTab === 'clips_matrix' && (
                <ClipsMatrix onOpenClipDetail={(clip) => setSelectedClipForDetail(clip)} />
              )}

              {/* Parrilla Editorial */}
              {selectedFormat !== 'LONGFORM' && contentTab === 'parrilla' && (
                <ParrillaPublicacion />
              )}

              {/* Stock & Runway Radar */}
              {selectedFormat !== 'LONGFORM' && contentTab === 'radar' && (
                <StockRadar />
              )}

              {/* Legacy Episode Manager */}
              {selectedFormat !== 'LONGFORM' && contentTab === 'episodes' && (
                <EpisodeManager />
              )}

              {/* Swarm Console */}
              {contentTab === 'swarm_console' && (
                <SwarmCommandCenter />
              )}

              {/* Telegram Engine */}
              {contentTab === 'telegram_bot' && (
                <TelegramBotEngine />
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* METRICS HUB (BUSINESS INTELLIGENCE)                       */}
          {/* ========================================================= */}
          {mode === 'metrics_hub' && (
            <>
              {metricsTab === 'overview' && (
                <MetricsOverview onOpenReport={() => setIsReportOpen(true)} />
              )}
              {metricsTab === 'forensic_table' && <ForensicShortsTable />}
              {metricsTab === 'cross_analysis' && <CrossFormatDurationAnalytics />}
              {metricsTab === 'retention' && <RetentionCurveChart />}
              {metricsTab === 'platforms' && <PlatformComparisonChart />}
              {metricsTab === 'ab_testing' && <ABTestingTracker />}
              {metricsTab === 'ai_insights' && <SwarmIntelligenceInsights />}
            </>
          )}
        </main>
      </div>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#13151a] border border-emerald-500/40 text-sm font-medium text-white shadow-2xl shadow-emerald-950/40 transition-all animate-bounce">
          <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <NewChannelModal
        isOpen={isNewChannelModalOpen}
        onClose={() => setIsNewChannelModalOpen(false)}
      />

      <CLevelExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        forensicData={forensicData}
      />

      <ClipDetailModal
        clip={selectedClipForDetail}
        onClose={() => setSelectedClipForDetail(null)}
      />
    </div>
  );
}
