export type OutreachAction =
  | 'meeting_opened'
  | 'meeting_booked'
  | 'contact_opened'
  | 'contact_sent';

export type VibeAppId =
  | 'ACAPemail'
  | 'nbagame'
  | 'crotopia'
  | 'wolt-game'
  | 'economic-time-traveler'
  | 'potato-inflation'
  | 'beer-indicator';

export interface TrackEventPayload {
  type: 'pageview' | 'social_click' | 'outreach' | 'vibe_metric';
  path?: string;
  target?: string;
  detail?: string;
  referrer?: string;
  device?: 'Desktop' | 'Mobile' | 'Tablet';
}

export interface ClientDailyBucket {
  date: string;
  pageviews: number;
  uniqueVisitors: number;
  socialClicks: number;
  meetingsOpened: number;
  meetingsBooked: number;
  contactsOpened: number;
  contactsSent: number;
  vibeActions: number;
  routes: Record<string, number>;
  socials: Record<string, number>;
  vibeApps: Record<string, number>;
  devices: Record<string, number>;
  referrers: Record<string, number>;
}

export interface ClientRecentEvent {
  id: string;
  timestamp: string;
  type: 'pageview' | 'social_click' | 'outreach' | 'vibe_metric';
  target: string;
  label: string;
  path: string;
  device: string;
  referrer: string;
}

export interface ClientAnalyticsSnapshot {
  updatedAt: string;
  activeVisitorsNow: number;
  daily: ClientDailyBucket[];
  recentEvents: ClientRecentEvent[];
}

const LOCAL_ANALYTICS_KEY = 'vb_analytics_store_v1';
const LOCAL_VISITOR_DAY_KEY = 'vb_analytics_visitor_day_v1';

function getTodayStr(offsetDays: number = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return d.toISOString().slice(0, 10);
}

export function createSeedAnalyticsSnapshot(): ClientAnalyticsSnapshot {
  const historicalSeeds = [
    { offset: -13, pv: 18, uv: 11, soc: 3, mo: 1, mb: 0, co: 1, cs: 0, acap: 2, nba: 3, cro: 4 },
    { offset: -12, pv: 24, uv: 15, soc: 4, mo: 1, mb: 1, co: 0, cs: 0, acap: 3, nba: 2, cro: 5 },
    { offset: -11, pv: 21, uv: 13, soc: 2, mo: 0, mb: 0, co: 1, cs: 1, acap: 2, nba: 4, cro: 3 },
    { offset: -10, pv: 32, uv: 19, soc: 6, mo: 2, mb: 1, co: 1, cs: 0, acap: 5, nba: 4, cro: 6 },
    { offset: -9,  pv: 28, uv: 17, soc: 5, mo: 1, mb: 0, co: 2, cs: 1, acap: 4, nba: 3, cro: 5 },
    { offset: -8,  pv: 35, uv: 22, soc: 7, mo: 2, mb: 1, co: 1, cs: 1, acap: 6, nba: 5, cro: 7 },
    { offset: -7,  pv: 30, uv: 18, soc: 4, mo: 1, mb: 0, co: 1, cs: 0, acap: 4, nba: 4, cro: 5 },
    { offset: -6,  pv: 41, uv: 25, soc: 8, mo: 2, mb: 1, co: 2, cs: 1, acap: 8, nba: 6, cro: 8 },
    { offset: -5,  pv: 38, uv: 23, soc: 6, mo: 1, mb: 1, co: 1, cs: 1, acap: 7, nba: 5, cro: 6 },
    { offset: -4,  pv: 46, uv: 29, soc: 9, mo: 3, mb: 1, co: 2, cs: 1, acap: 9, nba: 7, cro: 9 },
    { offset: -3,  pv: 52, uv: 31, soc: 11, mo: 2, mb: 1, co: 2, cs: 1, acap: 12, nba: 8, cro: 10 },
    { offset: -2,  pv: 49, uv: 28, soc: 8, mo: 2, mb: 1, co: 1, cs: 1, acap: 11, nba: 9, cro: 8 },
    { offset: -1,  pv: 64, uv: 37, soc: 14, mo: 3, mb: 2, co: 2, cs: 1, acap: 16, nba: 11, cro: 12 },
    { offset: 0,   pv: 19, uv: 12, soc: 4, mo: 1, mb: 0, co: 1, cs: 0, acap: 5, nba: 4, cro: 4 },
  ];

  const daily: ClientDailyBucket[] = historicalSeeds.map((s) => {
    const dateKey = getTodayStr(s.offset);
    const wolt = Math.max(1, Math.floor(s.cro / 3));
    const econ = Math.max(1, Math.floor(s.cro / 4));
    const potato = Math.max(1, Math.floor(s.cro / 4));
    const beer = Math.max(1, Math.floor(s.cro / 5));

    return {
      date: dateKey,
      pageviews: s.pv,
      uniqueVisitors: s.uv,
      socialClicks: s.soc,
      meetingsOpened: s.mo,
      meetingsBooked: s.mb,
      contactsOpened: s.co,
      contactsSent: s.cs,
      vibeActions: s.acap + s.nba + s.cro + wolt + econ + potato + beer,
      routes: {
        '/': Math.max(4, Math.round(s.pv * 0.36)),
        '/vibecoding/ACAPemail': Math.max(2, Math.round(s.pv * 0.2)),
        '/vibecoding/nbagame': Math.max(2, Math.round(s.pv * 0.16)),
        '/vibecoding/crotopia': Math.max(2, Math.round(s.pv * 0.14)),
        '/vibecoding': Math.max(1, Math.round(s.pv * 0.06)),
        '/reading': Math.max(1, Math.round(s.pv * 0.04)),
        '/work': Math.max(1, Math.round(s.pv * 0.04)),
      },
      socials: {
        linkedin: Math.max(1, Math.ceil(s.soc * 0.45)),
        github: Math.max(0, Math.floor(s.soc * 0.22)),
        instagram: Math.max(0, Math.floor(s.soc * 0.14)),
        youtube: Math.max(0, Math.floor(s.soc * 0.11)),
        twitter: Math.max(0, Math.floor(s.soc * 0.08)),
      },
      vibeApps: {
        ACAPemail: s.acap,
        nbagame: s.nba,
        crotopia: s.cro,
        'wolt-game': wolt,
        'economic-time-traveler': econ,
        'potato-inflation': potato,
        'beer-indicator': beer,
      },
      devices: {
        Desktop: Math.round(s.pv * 0.68),
        Mobile: Math.max(1, s.pv - Math.round(s.pv * 0.68)),
      },
      referrers: {
        Direct: Math.round(s.pv * 0.45),
        'linkedin.com': Math.round(s.pv * 0.28),
        'croampro.com': Math.round(s.pv * 0.17),
        'google.com': Math.max(1, s.pv - Math.round(s.pv * 0.9)),
      },
    };
  });

  return {
    updatedAt: new Date().toISOString(),
    activeVisitorsNow: 1,
    daily,
    recentEvents: [
      {
        id: 'evt_init_1',
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        type: 'vibe_metric',
        target: 'ACAPemail',
        label: 'ACAP Email: Signature copied to clipboard',
        path: '/vibecoding/ACAPemail',
        device: 'Desktop',
        referrer: 'croampro.com',
      },
      {
        id: 'evt_init_2',
        timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
        type: 'social_click',
        target: 'linkedin',
        label: 'Clicked LinkedIn profile',
        path: '/',
        device: 'Desktop',
        referrer: 'linkedin.com',
      },
      {
        id: 'evt_init_3',
        timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
        type: 'vibe_metric',
        target: 'nbagame',
        label: 'NBA Wins Pool: Loaded shared league slot #1',
        path: '/vibecoding/nbagame',
        device: 'Mobile',
        referrer: 'Direct',
      },
    ],
  };
}

export function getLocalAnalyticsSnapshot(): ClientAnalyticsSnapshot {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.daily)) {
        return parsed as ClientAnalyticsSnapshot;
      }
    }
  } catch {
    // ignore storage errors
  }
  const seed = createSeedAnalyticsSnapshot();
  saveLocalAnalyticsSnapshot(seed);
  return seed;
}

export function saveLocalAnalyticsSnapshot(snapshot: ClientAnalyticsSnapshot): void {
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore storage errors
  }
}

function recordEventInLocalSnapshot(payload: Required<TrackEventPayload>): void {
  try {
    const snapshot = getLocalAnalyticsSnapshot();
    const todayKey = getTodayStr(0);
    let bucket = snapshot.daily.find((d) => d.date === todayKey);
    if (!bucket) {
      bucket = {
        date: todayKey,
        pageviews: 0,
        uniqueVisitors: 1,
        socialClicks: 0,
        meetingsOpened: 0,
        meetingsBooked: 0,
        contactsOpened: 0,
        contactsSent: 0,
        vibeActions: 0,
        routes: {},
        socials: {},
        vibeApps: {},
        devices: {},
        referrers: {},
      };
      snapshot.daily.push(bucket);
    }

    const lastVisitedDay = localStorage.getItem(LOCAL_VISITOR_DAY_KEY);
    if (lastVisitedDay !== todayKey) {
      localStorage.setItem(LOCAL_VISITOR_DAY_KEY, todayKey);
      bucket.uniqueVisitors = Math.max(1, (bucket.uniqueVisitors || 0) + 1);
    }

    let eventLabel = '';
    if (payload.type === 'pageview') {
      bucket.pageviews += 1;
      bucket.routes[payload.path] = (bucket.routes[payload.path] || 0) + 1;
      bucket.devices[payload.device] = (bucket.devices[payload.device] || 0) + 1;
      if (payload.referrer && payload.referrer !== 'Internal') {
        bucket.referrers[payload.referrer] = (bucket.referrers[payload.referrer] || 0) + 1;
      }
      eventLabel = `Viewed ${payload.path}`;
    } else if (payload.type === 'social_click') {
      const platformKey = payload.target.toLowerCase();
      bucket.socialClicks += 1;
      bucket.socials[platformKey] = (bucket.socials[platformKey] || 0) + 1;
      const prettyPlatform: Record<string, string> = {
        linkedin: 'LinkedIn',
        github: 'GitHub',
        instagram: 'Instagram',
        youtube: 'YouTube',
        twitter: 'X (Twitter)',
        email: 'Email',
      };
      eventLabel = `Clicked ${prettyPlatform[platformKey] || payload.target} profile`;
    } else if (payload.type === 'outreach') {
      if (payload.target === 'meeting_opened') {
        bucket.meetingsOpened += 1;
        eventLabel = 'Opened Book a Meeting drawer';
      } else if (payload.target === 'meeting_booked') {
        bucket.meetingsBooked += 1;
        eventLabel = payload.detail || 'Scheduled a meeting via Calendly';
      } else if (payload.target === 'contact_opened') {
        bucket.contactsOpened += 1;
        eventLabel = 'Opened Contact Me form drawer';
      } else if (payload.target === 'contact_sent') {
        bucket.contactsSent += 1;
        eventLabel = payload.detail || 'Submitted Contact Me message';
      }
    } else if (payload.type === 'vibe_metric') {
      bucket.vibeActions += 1;
      bucket.vibeApps[payload.target] = (bucket.vibeApps[payload.target] || 0) + 1;
      eventLabel = payload.detail || `Vibe App action: ${payload.target}`;
    }

    const recentEvent: ClientRecentEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      type: payload.type,
      target: payload.target,
      label: eventLabel,
      path: payload.path,
      device: payload.device,
      referrer: payload.referrer,
    };

    snapshot.recentEvents = [recentEvent, ...(snapshot.recentEvents || [])].slice(0, 50);
    snapshot.updatedAt = recentEvent.timestamp;
    saveLocalAnalyticsSnapshot(snapshot);
  } catch {
    // ignore storage errors
  }
}

function detectDeviceType(): 'Desktop' | 'Mobile' | 'Tablet' {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent || '';
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function getCleanReferrer(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'Direct';
  try {
    const refUrl = new URL(document.referrer);
    if (typeof window !== 'undefined' && refUrl.hostname === window.location.hostname) {
      return 'Internal';
    }
    return refUrl.hostname.replace(/^www\./, '');
  } catch {
    return 'Direct';
  }
}

export function normalizeRoutePath(rawPath?: string): string {
  const path = (rawPath || (typeof window !== 'undefined' ? window.location.pathname : '/')).trim();
  if (!path || path === '/') return '/';
  const lower = path.toLowerCase().replace(/\/+$/, '');
  if (lower.startsWith('/vibecoding/acapemail')) return '/vibecoding/ACAPemail';
  if (lower.startsWith('/vibecoding/nbagame')) return '/vibecoding/nbagame';
  if (lower.startsWith('/vibecoding/crotopia')) return '/vibecoding/crotopia';
  if (lower.startsWith('/vibecoding')) return '/vibecoding';
  if (lower.startsWith('/reading')) return '/reading';
  if (lower.startsWith('/education')) return '/education';
  if (lower.startsWith('/work')) return '/work';
  if (lower.startsWith('/nonprofit')) return '/nonprofit';
  if (lower.startsWith('/ballislife')) return '/ballislife';
  if (lower.startsWith('/blog')) return '/blog';
  if (lower.startsWith('/film')) return '/film';
  if (lower.startsWith('/analytics')) return '/analytics';
  return path;
}

export function sendAnalyticsEvent(payload: TrackEventPayload): void {
  if (typeof window === 'undefined') return;

  const normalizedPath = normalizeRoutePath(payload.path);
  const fullPayload: Required<TrackEventPayload> = {
    type: payload.type,
    path: normalizedPath,
    target: payload.target || normalizedPath,
    detail: payload.detail || payload.target || normalizedPath,
    referrer: payload.referrer || getCleanReferrer(),
    device: payload.device || detectDeviceType(),
  };

  // Always mirror in local snapshot immediately so UI is instant even if offline/static
  recordEventInLocalSnapshot(fullPayload);

  const body = JSON.stringify(fullPayload);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      const queued = navigator.sendBeacon('/api/analytics/track', blob);
      if (queued) return;
    }
  } catch {
    // Fallback to fetch below
  }

  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // Ignore network errors silently
    });
  } catch {
    // Ignore errors silently
  }
}

let lastTrackedPath: string | null = null;
let lastTrackedTimestamp = 0;

export function trackPageView(customPath?: string): void {
  const normalized = normalizeRoutePath(customPath);
  if (normalized === '/analytics') return;

  const now = Date.now();
  if (lastTrackedPath === normalized && now - lastTrackedTimestamp < 1500) {
    return;
  }
  lastTrackedPath = normalized;
  lastTrackedTimestamp = now;

  sendAnalyticsEvent({
    type: 'pageview',
    path: normalized,
    target: normalized,
  });
}

export function trackSocialClick(platform: string, href?: string): void {
  sendAnalyticsEvent({
    type: 'social_click',
    target: platform.toLowerCase(),
    detail: href || platform,
  });
}

export function trackOutreachEvent(action: OutreachAction, detail?: string): void {
  sendAnalyticsEvent({
    type: 'outreach',
    target: action,
    detail: detail || action,
  });
}

export function trackVibeAppMetric(appId: VibeAppId, detail?: string): void {
  sendAnalyticsEvent({
    type: 'vibe_metric',
    target: appId,
    detail: detail || appId,
  });
}
