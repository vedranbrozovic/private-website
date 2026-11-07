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

  const fullPayload: TrackEventPayload = {
    ...payload,
    path: normalizeRoutePath(payload.path),
    referrer: payload.referrer || getCleanReferrer(),
    device: payload.device || detectDeviceType(),
  };

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
  // Do not inflate pageview metrics with views of the analytics console itself
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
