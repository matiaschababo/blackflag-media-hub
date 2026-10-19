'use client';

import React, { useState } from 'react';
import { useHolding } from '../context/HoldingContext';
import { Clip } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ClipsMatrix } from '../components/content-manager/ClipsMatrix';
import { ParrillaPublicacion } from '../components/content-manager/ParrillaPublicacion';
import { EpisodeManager } from '../components/content-manager/EpisodeManager';
import { StockRadar } from '../components/content-manager/StockRadar';
import { ContentOverview } from '../components/content-manager/ContentOverview';
import { TelegramBotEngine } from '../components/content-manager/TelegramBotEngine';
import { MetricsOverview } from '../components/metrics-hub/MetricsOverview';
import { RetentionCurveChart } from '../components/metrics-hub/RetentionCurveChart';
import { PlatformComparisonChart } from '../components/metrics-hub/PlatformComparisonChart';
import { ABTestingTracker } from '../components/metrics-hub/ABTestingTracker';
import { NewChannelModal } from '../components/modals/NewChannelModal';
import { ClipDetailModal } from '../components/modals/ClipDetailModal';

export default function Home() {
  const { mode, contentTab, metricsTab } = useHolding();
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [selectedClipForDetail, setSelectedClipForDetail] = useState<Clip | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Top Navbar */}
      <Navbar onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Center Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
          {mode === 'content_manager' && (
            <>
              {contentTab === 'clips_matrix' && (
                <ClipsMatrix onOpenClipDetail={(clip) => setSelectedClipForDetail(clip)} />
              )}
              {contentTab === 'parrilla' && <ParrillaPublicacion />}
              {contentTab === 'telegram_bot' && <TelegramBotEngine />}
              {contentTab === 'episodes' && <EpisodeManager />}
              {contentTab === 'radar' && <StockRadar />}
              {contentTab === 'overview' && <ContentOverview />}
            </>
          )}

          {mode === 'metrics_hub' && (
            <>
              {metricsTab === 'overview' && <MetricsOverview />}
              {metricsTab === 'retention' && <RetentionCurveChart />}
              {metricsTab === 'platforms' && <PlatformComparisonChart />}
              {metricsTab === 'ab_testing' && <ABTestingTracker />}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <NewChannelModal
        isOpen={isNewChannelModalOpen}
        onClose={() => setIsNewChannelModalOpen(false)}
      />

      <ClipDetailModal
        clip={selectedClipForDetail}
        onClose={() => setSelectedClipForDetail(null)}
      />
    </div>
  );
}
