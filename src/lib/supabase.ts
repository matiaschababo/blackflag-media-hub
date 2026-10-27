import { createClient } from '@supabase/supabase-js';
import { Channel, Episode, Clip } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ayfftcgvacbrniyrkety.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZmZ0Y2d2YWNicm5peXJrZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNTc4ODgsImV4cCI6MjEwODYzMzg4OH0.W14dzctpnigUlak5IddvBUJJnhqAHiANH-_B2Fqx39g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BADGE_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  blackflag: { bg: 'bg-amber-950/40', border: 'border-amber-600/40', text: 'text-amber-400' },
  podmon: { bg: 'bg-yellow-950/40', border: 'border-yellow-600/40', text: 'text-yellow-400' },
  levelpop: { bg: 'bg-cyan-950/40', border: 'border-cyan-600/40', text: 'text-cyan-400' },
};

export function getClipThumbnail(clip: Clip): string {
  // 1. YouTube direct thumbnail if URL exists
  const ytUrl = clip.platforms?.YOUTUBE_SHORT?.url;
  if (ytUrl) {
    const match = ytUrl.match(/(?:shorts\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }

  // 2. Local LevelPop thumbnail
  if (clip.id.startsWith('lp-')) {
    return `/thumbnails/${clip.id}-thumb.jpg`;
  }

  // 3. BlackFlag thumbnail
  if (clip.channelId === 'blackflag') {
    return '/thumbnails/ep01-blackflag.png';
  }

  // 4. Podmon fallback banner or logo
  if (clip.channelId === 'podmon') {
    return '/channels/podmon-banner.png';
  }

  return '/channels/levelpop-banner.png';
}

export async function getChannelsFromSupabase(): Promise<Channel[] | null> {
  try {
    const { data, error } = await supabase.from('channels').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      shortCode: row.short_code,
      niche: row.niche,
      audience: row.audience,
      accentColor: row.accent_color,
      badgeBg: BADGE_STYLES[row.id]?.bg || 'bg-sky-950/40',
      badgeBorder: BADGE_STYLES[row.id]?.border || 'border-sky-600/40',
      badgeText: BADGE_STYLES[row.id]?.text || 'text-sky-400',
      avatarUrl: row.avatar_url,
      bannerUrl: row.banner_url,
      shortsPerDay: row.shorts_per_day,
      timeSlots: row.time_slots,
      accounts: row.accounts || {},
      stats: row.stats || {
        totalViews: 0,
        watchHours: 0,
        subscribers: 0,
      },
    }));
  } catch (err) {
    console.error('Error fetching channels from Supabase:', err);
    return null;
  }
}

export async function getEpisodesFromSupabase(): Promise<Episode[] | null> {
  try {
    const { data, error } = await supabase.from('episodes').select('*').order('episode_number', { ascending: true });
    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      channelId: row.channel_id,
      episodeNumber: row.episode_number,
      title: row.title,
      duration: row.duration,
      youtubeUrl: row.youtube_url,
      status: row.status,
      releaseDate: row.release_date,
      thumbnailUrl: row.thumbnail_url,
      scriptStatus: row.script_status,
      audioEngine: row.audio_engine,
      renderEngine: row.render_engine,
      clipsCount: row.clips_count,
      totalViews: row.total_views,
      avdPercent: row.avd_percent,
      rpm: row.rpm,
    }));
  } catch (err) {
    console.error('Error fetching episodes from Supabase:', err);
    return null;
  }
}

export async function getClipsFromSupabase(): Promise<Clip[] | null> {
  try {
    const { data, error } = await supabase.from('clips').select('*').order('clip_number', { ascending: true });
    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      episodeId: row.episode_id,
      channelId: row.channel_id,
      clipNumber: row.clip_number,
      title: row.title,
      file: row.file_path,
      hook: row.hook,
      durationSec: row.duration_sec,
      timestamps: row.timestamps || { start: '00:00', end: '00:00' },
      captions: row.captions || { instagram: '', facebook: '', x: '', youtube: '' },
      platforms: row.platforms || {},
      isUrgent: row.is_urgent,
      priorityOrder: row.priority_order,
      views: row.views,
    }));
  } catch (err) {
    console.error('Error fetching clips from Supabase:', err);
    return null;
  }
}

export async function syncClipStatusToSupabase(
  clipId: string,
  platforms: Record<string, any>,
  isUrgent?: boolean
): Promise<boolean> {
  try {
    const updatePayload: Record<string, any> = {
      platforms,
      updated_at: new Date().toISOString(),
    };
    if (isUrgent !== undefined) {
      updatePayload.is_urgent = isUrgent;
    }

    const { error } = await supabase
      .from('clips')
      .update(updatePayload)
      .eq('id', clipId);

    if (error) {
      console.error('Error updating clip in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception updating clip in Supabase:', err);
    return false;
  }
}

export async function syncPublicationToSupabase(publication: {
  id?: string | number;
  clipId: string;
  channelId: string;
  platform: string;
  slotTime: string;
  scheduledDate: string;
  status: string;
  publishedAt?: string;
  url?: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('publications').insert({
      clip_id: publication.clipId,
      channel_id: publication.channelId,
      platform: publication.platform,
      slot_time: publication.slotTime,
      scheduled_date: publication.scheduledDate,
      status: publication.status,
      published_at: publication.publishedAt ? new Date(publication.publishedAt).toISOString() : null,
      url: publication.url || null,
    });
    if (error) {
      console.error('Error inserting publication in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception inserting publication in Supabase:', err);
    return false;
  }
}
