import { SideMediaItem, SideMediaType } from '../types';

export const SIDE_MEDIA_STORAGE_KEY = 'taizerflow_side_media_items_v1';

export const DEFAULT_SIDE_MEDIA_ITEMS: SideMediaItem[] = [
  {
    id: 'media-video-1',
    type: 'video',
    title: 'Daily Routine Spoken English Expressions',
    subtitle: 'දිනපතා භාවිත වන අත්‍යවශ්‍ය ඉංග්‍රීසි වාක්‍ය 50ක්',
    description: 'Master 50 everyday phrases used in native English conversations with clear Sinhala explanations and correct pronunciation.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Trending Video',
    isActive: true,
    createdAt: Date.now() - 86400000 * 3,
    order: 1,
  },
  {
    id: 'media-website-1',
    type: 'website',
    title: 'BBC Learning English Official Portal',
    subtitle: 'ලොව පිළිගත් BBC ඉංග්‍රීසි ඉගෙනුම් අඩවිය',
    description: 'Explore daily podcasts, 6-minute English stories, audio quizzes, and grammar challenges directly from BBC.',
    url: 'https://www.bbc.co.uk/learningenglish',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Free Resource',
    isActive: true,
    createdAt: Date.now() - 86400000 * 5,
    order: 2,
  },
  {
    id: 'media-news-1',
    type: 'news',
    title: 'New Grammar & Spoken Oral Studio 2026 Live!',
    subtitle: 'නව ව්‍යාකරණ හා කථන පුහුණු අංග දැන් සක්‍රියයි',
    description: 'We have updated all interactive practice cards, speech recognition audio drills, and XP leveling in Taizer Flow.',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Latest News',
    isActive: true,
    createdAt: Date.now() - 86400000 * 1,
    order: 3,
  },
  {
    id: 'media-ad-1',
    type: 'ad',
    title: 'Master Spoken English - Premium Online Batch 2026',
    subtitle: 'කථන ඉංග්‍රීසි විශේෂ මාර්ගගත පන්තිය - ලියාපදිංචිය ඇරඹුණා',
    description: 'Join our intensive spoken English coaching batch with 1-on-1 speaking practice sessions, workbook materials, and mock interviews.',
    url: 'https://wa.me/?text=Hello%20I%20want%20to%20enroll%20in%20Spoken%20English%20batch',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Special 50% Off Promo',
    isActive: true,
    createdAt: Date.now() - 86400000 * 2,
    order: 4,
  },
  {
    id: 'media-website-2',
    type: 'website',
    title: 'Cambridge Online English Dictionary',
    subtitle: 'ශබ්දකෝෂය සහ නිවැරදි උච්චාරණ හඬ (Audio)',
    description: 'Look up any English word, listen to UK/US audio pronunciations, and learn practical sentence examples.',
    url: 'https://dictionary.cambridge.org',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Recommended Tool',
    isActive: true,
    createdAt: Date.now() - 86400000 * 7,
    order: 5,
  },
  {
    id: 'media-video-2',
    type: 'video',
    title: 'How to Stop Translating in Your Head & Speak Fast',
    subtitle: 'ඉංග්‍රීසියෙන් සිතා චතුර ලෙස කතා කරන්නේ කෙසේද?',
    description: 'Learn proven techniques to think directly in English rather than translating Sinhala words in your head.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    badgeText: 'Must Watch',
    isActive: true,
    createdAt: Date.now() - 86400000 * 4,
    order: 6,
  },
];

export function getSideMediaItems(): SideMediaItem[] {
  try {
    const raw = localStorage.getItem(SIDE_MEDIA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch (err) {
    console.error('Failed to get side media items', err);
  }
  // Initialize with defaults
  saveSideMediaItems(DEFAULT_SIDE_MEDIA_ITEMS);
  return DEFAULT_SIDE_MEDIA_ITEMS;
}

export function saveSideMediaItems(items: SideMediaItem[]): void {
  try {
    localStorage.setItem(SIDE_MEDIA_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('side-media-changed'));
  } catch (err) {
    console.error('Failed to save side media items', err);
  }
}

export function addSideMediaItem(
  newItem: Omit<SideMediaItem, 'id' | 'createdAt' | 'order'>
): SideMediaItem {
  const current = getSideMediaItems();
  const maxOrder = current.reduce((max, item) => Math.max(max, item.order || 0), 0);
  const created: SideMediaItem = {
    ...newItem,
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
    order: maxOrder + 1,
  };
  const updated = [created, ...current];
  saveSideMediaItems(updated);
  return created;
}

export function updateSideMediaItem(
  id: string,
  updates: Partial<Omit<SideMediaItem, 'id' | 'createdAt'>>
): boolean {
  const current = getSideMediaItems();
  let found = false;
  const updated = current.map((item) => {
    if (item.id === id) {
      found = true;
      return { ...item, ...updates };
    }
    return item;
  });
  if (found) {
    saveSideMediaItems(updated);
  }
  return found;
}

export function deleteSideMediaItem(id: string): boolean {
  const current = getSideMediaItems();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length !== current.length) {
    saveSideMediaItems(filtered);
    return true;
  }
  return false;
}

export function toggleSideMediaItemActive(id: string): boolean {
  const current = getSideMediaItems();
  let found = false;
  const updated = current.map((item) => {
    if (item.id === id) {
      found = true;
      return { ...item, isActive: !item.isActive };
    }
    return item;
  });
  if (found) {
    saveSideMediaItems(updated);
  }
  return found;
}

export function resetSideMediaToDefaults(): void {
  saveSideMediaItems(DEFAULT_SIDE_MEDIA_ITEMS);
}
