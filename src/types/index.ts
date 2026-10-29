export type Platform = 'YOUTUBE_SHORT' | 'INSTAGRAM_REEL' | 'FACEBOOK_REEL' | 'TIKTOK' | 'X_TWITTER';

export type PlatformFilter = 'ALL' | Platform;

export type ContentFormat = 'ALL' | 'LONGFORM' | 'SHORTS';

export type ProductionStage = 'ALL' | 'PRODUCTION' | 'QA_CORRECTION' | 'VIRGIN_STOCK' | 'SCHEDULED' | 'PUBLISHED';

export type PublicationStatus = 'PUBLISHED' | 'SCHEDULED' | 'PENDING' | 'FAILED';

export interface PublicationRecord {
  status: PublicationStatus;
  slotTime?: string;
  publishedAt?: string;
  url?: string;
  error?: string;
}

export interface Clip {
  id: string;
  episodeId: string;
  channelId: string;
  clipNumber: number;
  title: string;
  file: string;
  hook: string;
  durationSec: number;
  stage?: 'PRODUCTION' | 'QA_CORRECTION' | 'VIRGIN_STOCK' | 'SCHEDULED' | 'PUBLISHED';
  timestamps: {
    start: string;
    end: string;
  };
  captions: {
    instagram: string;
    facebook: string;
    x: string;
    youtube: string;
    tiktok?: string;
  };
  platforms: Record<Platform, PublicationRecord>;
  isUrgent?: boolean;
  priorityOrder?: number;
  views?: number;
  hookRate?: number; // e.g. 74.2%
  completionRate?: number; // e.g. 48.5%
}

export interface ThumbnailVariant {
  id: string;
  label: string;
  variantKey: 'A' | 'B' | 'C';
  url: string;
  ctrPrediction: string;
  concept: string;
  isWinner?: boolean;
}

export interface Episode {
  id: string;
  channelId: string;
  episodeNumber: number;
  title: string;
  duration: string;
  youtubeUrl: string;
  driveUrl?: string;
  status: 'PUBLISHED' | 'SCHEDULED' | 'IN_PRODUCTION';
  releaseDate: string;
  thumbnailUrl?: string;
  thumbnailStatus?: 'PENDING' | 'DONE' | 'UPLOADED';
  thumbnailVariants?: ThumbnailVariant[];
  thumbnailNotes?: string;
  producerNotes?: string;
  scriptStatus: 'DRAFT' | 'REVIEWED' | 'LOCKED';
  audioEngine: string;
  renderEngine: string;
  clipsCount: number;
  totalViews?: number;
  avdPercent?: number;
  rpm?: number;
  watchHours?: number;
  likes?: number;
  comments?: number;
}

export interface Channel {
  id: string;
  name: string;
  shortCode: string;
  niche: string;
  audience: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  avatarUrl: string;
  bannerUrl?: string;
  shortsPerDay: number;
  timeSlots: string[];
  accounts: {
    youtube: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    x: string;
  };
  stats: {
    subscribers: number;
    totalViews: number;
    watchHours: number;
    avgAvd: number;
    estimatedRevenue: number;
    rpm: number;
    uniqueClipsCount?: number;
    totalPublicationsCount?: number;
    arbitrageRatio?: number;
    orphanedClipsCount?: number;
    lastSyncedAt?: string;
    forensic_analytics?: ForensicAnalyticsData;
  };
}

export interface GlobalHoldingStats {
  totalChannels: number;
  totalUniquePieces: number; // Unique clips + episodes
  uniqueClipsCount: number;
  uniqueEpisodesCount: number;
  totalPublications: number; // Across all social platforms
  publicationsByPlatform: Record<Platform, number>;
  arbitrageRatio: number; // totalPublications / totalUniquePieces
  orphanedPiecesCount: number; // Pieces published in some networks but pending in others
  totalViews: number;
  totalSubscribers: number;
  totalWatchHours: number;
  runwayDays: number;
  channelMetrics: Array<{
    channelId: string;
    channelName: string;
    shortCode: string;
    uniquePieces: number;
    publications: number;
    arbitrageRatio: number;
    virginStock: number;
    runwayDays: number;
    totalViews: number;
    subscribers: number;
  }>;
}

export interface ForensicVideo {
  id: string;
  title: string;
  category: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  viewsPerHour: number;
  durationSec: number;
  durationLabel: string;
  durationBucket: string;
  publishedAt: string | null;
  publishAt: string | null;
  url: string;
  thumbnailUrl: string;
  tier: string;
}

export interface FormatComparison {
  category: string;
  totalViews: number;
  avgViewsPerShort: number;
  totalLikes: number;
  avgEngagementRate: number;
  totalVideos: number;
  publicVideos: number;
}

export interface DurationComparison {
  bucket: string;
  totalViews: number;
  shortsCount: number;
  avgViewsPerShort: number;
  totalLikes: number;
}

export interface ForensicRetentionPoint {
  second: number;
  label: string;
  ultraShort45s: number;
  long120s: number;
}

export interface Winner24hInfo {
  id: string;
  title: string;
  views: number;
  viewsPerHour: number;
  durationLabel: string;
  durationSec: number;
  category: string;
  er: number;
  thumbnailUrl: string;
  url: string;
  whyItWon: string;
}

export interface LaggingAnalysisInfo {
  worstFormat: string;
  avgViews: number;
  vsWinnerDelta: string;
  whyItLags: string;
  correctiveAction: string;
}

export interface ExecutiveBriefingInfo {
  dateStr: string;
  period: string;
  headline: string;
  topMetricGains: string;
  cmoSummary: string;
  swarmRecommendation: string;
}

export interface ForensicAnalyticsData {
  updatedAtUtc: string;
  channel: {
    title: string;
    handle: string;
    channelId: string;
    subscribers: number;
    publicViews: number;
    auditedViewsSum: number;
    totalLikes: number;
    totalComments: number;
    videoCount: number;
    estimatedWatchHours: number;
    avgAvdPercent: number;
    medianViews: number;
    subscribersProgressPct: number;
    hoursProgressPct: number;
  };
  formatComparison: FormatComparison[];
  durationComparison: DurationComparison[];
  retentionCurves: ForensicRetentionPoint[];
  keyFindings: string[];
  actionableDecisions: string[];
  videos: ForensicVideo[];
  winner24h?: Winner24hInfo;
  laggingAnalysis?: LaggingAnalysisInfo;
  executiveBriefing?: ExecutiveBriefingInfo;
}

export interface RetentionDataPoint {
  second: number;
  retention: number;
  label: string;
}

export interface ABVariant {
  id: string;
  title: string;
  thumbnailName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  isWinner: boolean;
}

export type AppMode = 'content_manager' | 'metrics_hub';

export type ContentTab =
  | 'overview'
  | 'arbitrage_360'
  | 'longform'
  | 'episodes'
  | 'clips_matrix'
  | 'parrilla'
  | 'radar'
  | 'telegram_bot'
  | 'swarm_console';

export type MetricsTab =
  | 'overview'
  | 'longform_bi'
  | 'forensic_table'
  | 'cross_analysis'
  | 'retention'
  | 'platforms'
  | 'ab_testing'
  | 'ai_insights';
