import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  ExternalLink,
  Check,
  Calendar,
  Mail,
} from 'lucide-react';
import { trackOutreachEvent } from './tracker';

interface DailyBucket {
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

interface RecentEventItem {
  id: string;
  timestamp: string;
  type: 'pageview' | 'social_click' | 'outreach' | 'vibe_metric';
  target: string;
  label: string;
  path: string;
  device: string;
  referrer: string;
}

interface AnalyticsApiResponse {
  updatedAt: string;
  activeVisitorsNow: number;
  daily: DailyBucket[];
  recentEvents: RecentEventItem[];
}

type TimeRange = 'today' | '7d' | '30d' | 'all';

interface VibeAppMetricConfig {
  id: string;
  name: string;
  metricLabel: string;
  href: string;
}

const VIBE_APP_CONFIGS: VibeAppMetricConfig[] = [
  {
    id: 'ACAPemail',
    name: 'ACAP Official Email Signature Studio',
    metricLabel: 'Signatures Copied',
    href: '/vibecoding/ACAPemail',
  },
  {
    id: 'nbagame',
    name: 'NBA Franchise Wins Pool & Snake Draft',
    metricLabel: 'Leagues Played & Loaded',
    href: '/vibecoding/nbagame',
  },
  {
    id: 'crotopia',
    name: 'Crotopia: A Cozy Biome Odyssey',
    metricLabel: 'Landmarks Discovered',
    href: '/vibecoding/crotopia',
  },
  {
    id: 'wolt-game',
    name: 'Wolt Delivery Game (v2)',
    metricLabel: 'Game Sessions Played',
    href: '/vibecoding?app=wolt-game',
  },
  {
    id: 'economic-time-traveler',
    name: 'Economic Time Traveler',
    metricLabel: 'Visualizations Explored',
    href: '/vibecoding?app=economic-time-traveler',
  },
  {
    id: 'potato-inflation',
    name: 'Potato Inflation (v3)',
    metricLabel: 'Calculations Run',
    href: '/vibecoding?app=potato-inflation',
  },
  {
    id: 'beer-indicator',
    name: 'Beer Indicator',
    metricLabel: 'Experiments Opened',
    href: '/vibecoding?app=beer-indicator',
  },
];

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Main Portfolio (/)',
  '/vibecoding/ACAPemail': 'ACAP Email Signature Studio',
  '/vibecoding/nbagame': 'NBA Franchise Wins Pool',
  '/vibecoding/crotopia': 'Crotopia 3D Odyssey',
  '/vibecoding': 'Vibe Coding Hub',
  '/reading': 'Reading & Poems',
  '/work': 'Work Experience',
  '/education': 'Education & Research',
  '/nonprofit': 'Nonprofit & ACAP',
  '/ballislife': 'Basketball (Ball Is Life)',
  '/blog': 'Blog & Essays',
  '/film': 'Film & Photography',
};

const SOCIAL_PLATFORMS: Array<{ id: string; label: string; href: string }> = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/vedranbrozovic/' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/vedranbrozovic' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/vedranbrozovic' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@vedran.brozovic' },
  { id: 'twitter', label: 'X (Twitter)', href: 'https://twitter.com/vedranbrozovic' },
];

function formatShortDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return `${monthNames[m] || parts[1]} ${d}`;
}

function formatTimeAgo(isoString: string): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState<
    'all' | 'vibe_metric' | 'social_click' | 'outreach' | 'pageview'
  >('all');
  const [loggedConfirm, setLoggedConfirm] = useState<'meeting' | 'contact' | null>(null);

  const fetchAnalytics = useCallback(async (isSilent: boolean = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Unable to load analytics data.');
      const json: AnalyticsApiResponse = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(err instanceof Error ? err.message : 'Unable to load analytics.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(false);
  }, [fetchAnalytics]);

  useEffect(() => {
    if (!autoSync) return;
    const interval = window.setInterval(() => {
      fetchAnalytics(true);
    }, 10000);
    return () => window.clearInterval(interval);
  }, [autoSync, fetchAnalytics]);

  const navigateTo = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter daily buckets by selected timeRange
  const filteredDaily = useMemo(() => {
    if (!data?.daily) return [];
    const sorted = [...data.daily].sort((a, b) => a.date.localeCompare(b.date));
    if (timeRange === 'today') {
      return sorted.slice(-1);
    }
    if (timeRange === '7d') {
      return sorted.slice(-7);
    }
    if (timeRange === '30d') {
      return sorted.slice(-30);
    }
    return sorted;
  }, [data, timeRange]);

  // 14-day chart series
  const chartDays = useMemo(() => {
    if (!data?.daily) return [];
    return [...data.daily].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [data]);

  // Aggregate metrics across filteredDaily
  const summary = useMemo(() => {
    let pageviews = 0;
    let uniqueVisitors = 0;
    let socialClicks = 0;
    let meetingsOpened = 0;
    let meetingsBooked = 0;
    let contactsOpened = 0;
    let contactsSent = 0;
    let vibeActions = 0;

    const routes: Record<string, number> = {};
    const socials: Record<string, number> = {};
    const vibeApps: Record<string, number> = {};
    const devices: Record<string, number> = {};
    const referrers: Record<string, number> = {};

    for (const day of filteredDaily) {
      pageviews += day.pageviews || 0;
      uniqueVisitors += day.uniqueVisitors || 0;
      socialClicks += day.socialClicks || 0;
      meetingsOpened += day.meetingsOpened || 0;
      meetingsBooked += day.meetingsBooked || 0;
      contactsOpened += day.contactsOpened || 0;
      contactsSent += day.contactsSent || 0;
      vibeActions += day.vibeActions || 0;

      for (const [k, v] of Object.entries(day.routes || {})) {
        routes[k] = (routes[k] || 0) + Number(v || 0);
      }
      for (const [k, v] of Object.entries(day.socials || {})) {
        socials[k] = (socials[k] || 0) + Number(v || 0);
      }
      for (const [k, v] of Object.entries(day.vibeApps || {})) {
        vibeApps[k] = (vibeApps[k] || 0) + Number(v || 0);
      }
      for (const [k, v] of Object.entries(day.devices || {})) {
        devices[k] = (devices[k] || 0) + Number(v || 0);
      }
      for (const [k, v] of Object.entries(day.referrers || {})) {
        referrers[k] = (referrers[k] || 0) + Number(v || 0);
      }
    }

    return {
      pageviews,
      uniqueVisitors,
      socialClicks,
      meetingsOpened,
      meetingsBooked,
      contactsOpened,
      contactsSent,
      vibeActions,
      routes,
      socials,
      vibeApps,
      devices,
      referrers,
    };
  }, [filteredDaily]);

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vedran-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleManualConversionLog = (kind: 'meeting' | 'contact') => {
    if (kind === 'meeting') {
      trackOutreachEvent('meeting_booked', 'Meeting scheduled (logged on /analytics)');
    } else {
      trackOutreachEvent('contact_sent', 'Contact message sent (logged on /analytics)');
    }
    setLoggedConfirm(kind);
    setTimeout(() => {
      fetchAnalytics(true);
    }, 250);
    setTimeout(() => {
      setLoggedConfirm((prev) => (prev === kind ? null : prev));
    }, 2000);
  };

  const maxChartPageviews = useMemo(() => {
    if (chartDays.length === 0) return 10;
    return Math.max(10, ...chartDays.map((d) => d.pageviews));
  }, [chartDays]);

  const maxVibeAppCount = useMemo(() => {
    const counts = VIBE_APP_CONFIGS.map((c) => summary.vibeApps[c.id] || 0);
    return Math.max(1, ...counts);
  }, [summary.vibeApps]);

  const maxSocialCount = useMemo(() => {
    const counts = SOCIAL_PLATFORMS.map((p) => summary.socials[p.id] || 0);
    return Math.max(1, ...counts);
  }, [summary.socials]);

  const sortedRoutes = useMemo((): Array<[string, number]> => {
    const entries = Object.entries(summary.routes) as Array<[string, number]>;
    return entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  }, [summary.routes]);

  const maxRouteViews = useMemo(() => {
    if (sortedRoutes.length === 0) return 1;
    return Math.max(1, sortedRoutes[0][1]);
  }, [sortedRoutes]);

  const filteredEvents = useMemo(() => {
    const list = data?.recentEvents || [];
    if (eventFilter === 'all') return list.slice(0, 25);
    return list.filter((e) => e.type === eventFilter).slice(0, 25);
  }, [data?.recentEvents, eventFilter]);

  const desktopPct = useMemo(() => {
    const desk = summary.devices['Desktop'] || 0;
    const mob = (summary.devices['Mobile'] || 0) + (summary.devices['Tablet'] || 0);
    const total = desk + mob;
    if (total === 0) return 68;
    return Math.round((desk / total) * 100);
  }, [summary.devices]);

  const activeHoveredDay =
    hoveredDayIndex !== null && chartDays[hoveredDayIndex]
      ? chartDays[hoveredDayIndex]
      : chartDays[chartDays.length - 1] || null;

  return (
    <div className="min-h-screen bg-[#Faf9f6] text-[#20242c] font-sans antialiased selection:bg-[#1c2229] selection:text-[#Faf9f6]">
      {/* 3-Zone Top Bar Contract */}
      <header className="border-b border-[#e2e5eb] bg-[#Faf9f6]/95 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line brand & breadcrumb */}
          <a
            href="/"
            onClick={(e) => navigateTo(e, '/')}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold tracking-tight text-[#1c2229] hover:opacity-75 transition-opacity whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#555f6f]" />
            <span>Vedran Brozović / Analytics</span>
          </a>

          {/* Zone 2: Clean single-line section links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#555f6f]">
            <a
              href="#overview"
              className="hover:text-[#1c2229] transition-colors whitespace-nowrap shrink-0"
            >
              Overview
            </a>
            <a
              href="#vibe-apps"
              className="hover:text-[#1c2229] transition-colors whitespace-nowrap shrink-0"
            >
              Vibe Coding
            </a>
            <a
              href="#outreach-social"
              className="hover:text-[#1c2229] transition-colors whitespace-nowrap shrink-0"
            >
              Outreach &amp; Social
            </a>
            <a
              href="#pages-stream"
              className="hover:text-[#1c2229] transition-colors whitespace-nowrap shrink-0"
            >
              Pages &amp; Activity
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#Faf9f6] bg-[#1c2229] rounded-lg hover:bg-[#2c3440] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Title & Workspace Range Filter Bar */}
        <section
          id="overview"
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e2e5eb] pb-5"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#1c2229]">
              Web &amp; Interaction Analytics
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#555f6f] mt-1.5">
              <span>First-party server telemetry</span>
              <span aria-hidden="true">·</span>
              <span>Bot-filtered</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {data?.activeVisitorsNow || 1} active in last 5m
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time Range Segmented Filter */}
            <div className="flex items-center p-0.5 bg-[#eef0f4] rounded-lg border border-[#e2e5eb]">
              {(
                [
                  { id: 'today', label: 'Today' },
                  { id: '7d', label: '7 Days' },
                  { id: '30d', label: '30 Days' },
                  { id: 'all', label: 'All Time' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeRange(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    timeRange === tab.id
                      ? 'bg-white text-[#1c2229] shadow-2xs font-semibold'
                      : 'text-[#555f6f] hover:text-[#1c2229]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoSync((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                autoSync
                  ? 'bg-white text-[#1c2229] border-[#1c2229]/25'
                  : 'bg-transparent text-[#555f6f] border-[#e2e5eb]'
              }`}
              title="Toggle 10-second live auto-refresh"
            >
              {autoSync ? 'Live Sync: On' : 'Live Sync: Paused'}
            </button>

            <button
              type="button"
              onClick={() => fetchAnalytics(false)}
              disabled={refreshing}
              className="p-2 rounded-lg border border-[#e2e5eb] bg-white text-[#555f6f] hover:text-[#1c2229] transition-colors cursor-pointer"
              title="Refresh metrics now"
              aria-label="Refresh metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </section>

        {error && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 text-xs text-rose-800 flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchAnalytics(false)}
              className="underline font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Top 4 KPI Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e5eb] p-5">
            <div className="text-xs font-medium text-[#555f6f]">Unique Visitors</div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#1c2229] font-mono tabular-nums mt-2">
              {loading ? '—' : summary.uniqueVisitors.toLocaleString()}
            </div>
            <div className="text-xs text-[#555f6f] mt-2 flex items-center gap-1.5">
              <span>Daily SHA-256 sessions</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e5eb] p-5">
            <div className="text-xs font-medium text-[#555f6f]">Total Pageviews</div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#1c2229] font-mono tabular-nums mt-2">
              {loading ? '—' : summary.pageviews.toLocaleString()}
            </div>
            <div className="text-xs text-[#555f6f] mt-2 font-mono tabular-nums">
              {desktopPct}% Desktop · {100 - desktopPct}% Mobile
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e5eb] p-5">
            <div className="text-xs font-medium text-[#555f6f]">Social Profile Clicks</div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#1c2229] font-mono tabular-nums mt-2">
              {loading ? '—' : summary.socialClicks.toLocaleString()}
            </div>
            <div className="text-xs text-[#555f6f] mt-2">
              LinkedIn, GitHub, IG, YouTube, X
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e5eb] p-5">
            <div className="text-xs font-medium text-[#555f6f]">Meetings &amp; Contacts</div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#1c2229] font-mono tabular-nums mt-2">
              {loading
                ? '—'
                : (summary.meetingsBooked + summary.contactsSent).toLocaleString()}
              <span className="text-sm font-normal text-[#555f6f] ml-1.5">
                / {(summary.meetingsOpened + summary.contactsOpened).toLocaleString()} opened
              </span>
            </div>
            <div className="text-xs text-[#555f6f] mt-2 font-mono tabular-nums">
              {summary.meetingsBooked} booked · {summary.contactsSent} contacts sent
            </div>
          </div>
        </section>

        {/* 14-Day Interactive SVG Traffic & Activity Chart */}
        <section className="bg-white rounded-xl border border-[#e2e5eb] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#e2e5eb]">
            <div>
              <h2 className="text-base font-semibold text-[#1c2229]">
                14-Day Traffic &amp; Conversion Trend
              </h2>
              <p className="text-xs text-[#555f6f] mt-0.5">
                Hover or tap any day to inspect daily pageviews, unique visitors, and actions
              </p>
            </div>

            {activeHoveredDay && (
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums text-[#1c2229] bg-[#Faf9f6] px-3 py-1.5 rounded-lg border border-[#e2e5eb]">
                <span className="font-semibold">{formatShortDate(activeHoveredDay.date)}</span>
                <span aria-hidden="true" className="text-[#8c94a4]">
                  ·
                </span>
                <span>{activeHoveredDay.pageviews} views</span>
                <span aria-hidden="true" className="text-[#8c94a4]">
                  ·
                </span>
                <span>{activeHoveredDay.uniqueVisitors} visitors</span>
                <span aria-hidden="true" className="text-[#8c94a4]">
                  ·
                </span>
                <span>{activeHoveredDay.vibeActions} app actions</span>
              </div>
            )}
          </div>

          <div className="pt-6">
            {chartDays.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-xs text-[#555f6f]">
                Loading daily activity series…
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[540px]">
                  <svg
                    viewBox="0 0 700 190"
                    className="w-full h-48 overflow-visible select-none"
                    role="img"
                    aria-label="14-day pageviews and unique visitors chart"
                  >
                    {/* Subtle horizontal reference lines */}
                    {[0, 0.5, 1].map((ratio, idx) => {
                      const y = 150 - ratio * 130;
                      const val = Math.round(ratio * maxChartPageviews);
                      return (
                        <g key={idx}>
                          <line
                            x1={32}
                            y1={y}
                            x2={690}
                            y2={y}
                            stroke="#e2e5eb"
                            strokeDasharray={ratio === 0 ? undefined : '3 3'}
                            strokeWidth={1}
                          />
                          <text
                            x={24}
                            y={y + 4}
                            textAnchor="end"
                            className="fill-[#8c94a4] text-[10px] font-mono"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Daily Bars: Pageviews (outer bar) + Unique Visitors (inner dark bar) */}
                    {chartDays.map((day, idx) => {
                      const slotWidth = (690 - 40) / chartDays.length;
                      const centerX = 40 + idx * slotWidth + slotWidth / 2;
                      const barW = Math.min(26, slotWidth * 0.58);

                      const pvHeight = Math.max(
                        4,
                        (day.pageviews / maxChartPageviews) * 130
                      );
                      const uvHeight = Math.max(
                        2,
                        (day.uniqueVisitors / maxChartPageviews) * 130
                      );

                      const isSelected =
                        hoveredDayIndex === idx ||
                        (hoveredDayIndex === null && idx === chartDays.length - 1);

                      return (
                        <g
                          key={day.date}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredDayIndex(idx)}
                          onFocus={() => setHoveredDayIndex(idx)}
                        >
                          {/* Transparent hit target */}
                          <rect
                            x={centerX - slotWidth / 2}
                            y={10}
                            width={slotWidth}
                            height={165}
                            fill="transparent"
                          />

                          {/* Total Pageviews bar */}
                          <rect
                            x={centerX - barW / 2}
                            y={150 - pvHeight}
                            width={barW}
                            height={pvHeight}
                            rx={3}
                            fill={isSelected ? '#94a3b8' : '#cbd5e1'}
                          />

                          {/* Unique Visitors bar */}
                          <rect
                            x={centerX - barW / 2 + 4}
                            y={150 - uvHeight}
                            width={Math.max(4, barW - 8)}
                            height={uvHeight}
                            rx={2}
                            fill={isSelected ? '#1c2229' : '#475569'}
                          />

                          {/* Date label */}
                          <text
                            x={centerX}
                            y={172}
                            textAnchor="middle"
                            className={`text-[10px] font-mono ${
                              isSelected ? 'fill-[#1c2229] font-semibold' : 'fill-[#64748b]'
                            }`}
                          >
                            {formatShortDate(day.date)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="flex items-center justify-end gap-5 text-xs text-[#555f6f] pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#1c2229] inline-block" />
                      <span>Unique Visitors</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#cbd5e1] inline-block" />
                      <span>Total Pageviews</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Core 2-Column Breakdown: 1 Metric per Vibe Coding App + Outreach & Social Clicks */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): One Key Metric per Vibe Coding App */}
          <div
            id="vibe-apps"
            className="lg:col-span-7 bg-white rounded-xl border border-[#e2e5eb] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e5eb]">
              <div>
                <h2 className="text-base font-semibold text-[#1c2229]">
                  Vibe Coding Apps — Primary Metric
                </h2>
                <p className="text-xs text-[#555f6f] mt-0.5">
                  One signature engagement metric tracked per app
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-[#555f6f]">
                {summary.vibeActions.toLocaleString()} total actions
              </span>
            </div>

            <div className="divide-y divide-[#e2e5eb] mt-2">
              {VIBE_APP_CONFIGS.map((app) => {
                const count = summary.vibeApps[app.id] || 0;
                const widthPct = Math.max(4, Math.round((count / maxVibeAppCount) * 100));

                return (
                  <div key={app.id} className="py-3.5 first:pt-3 last:pb-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <a
                          href={app.href}
                          onClick={(e) => navigateTo(e, app.href)}
                          className="text-sm font-medium text-[#1c2229] hover:underline inline-flex items-center gap-1.5 truncate"
                        >
                          <span className="truncate">{app.name}</span>
                          <ExternalLink className="w-3 h-3 text-[#8c94a4] shrink-0" />
                        </a>
                        <div className="text-xs text-[#555f6f] mt-0.5">{app.metricLabel}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-semibold text-[#1c2229] font-mono tabular-nums">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-[#1c2229] rounded-full transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (5 cols): Meetings Booked, Contacts Sent & Social Clicks */}
          <div id="outreach-social" className="lg:col-span-5 space-y-6">
            {/* Meetings Booked & Contacts Sent Card */}
            <div className="bg-white rounded-xl border border-[#e2e5eb] p-5 sm:p-6">
              <div className="pb-4 border-b border-[#e2e5eb]">
                <h2 className="text-base font-semibold text-[#1c2229]">
                  Meetings &amp; Contact Conversions
                </h2>
                <p className="text-xs text-[#555f6f] mt-0.5">
                  Tracks drawer opens (intent) and completed scheduling or form submissions
                </p>
              </div>

              <div className="divide-y divide-[#e2e5eb] mt-2">
                {/* Meetings Row */}
                <div className="py-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#555f6f]" />
                      <span className="text-sm font-medium text-[#1c2229]">
                        Meetings Booked (Calendly)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleManualConversionLog('meeting')}
                      className="text-[11px] font-medium text-[#555f6f] hover:text-[#1c2229] underline cursor-pointer whitespace-nowrap shrink-0"
                      title="Record a completed booking"
                    >
                      {loggedConfirm === 'meeting' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <Check className="w-3 h-3" /> Recorded
                        </span>
                      ) : (
                        '+ Log Booking'
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="p-3 rounded-lg bg-[#Faf9f6] border border-[#e2e5eb]">
                      <div className="text-[11px] text-[#555f6f]">Drawer Opened</div>
                      <div className="text-lg font-semibold text-[#1c2229] font-mono tabular-nums mt-0.5">
                        {summary.meetingsOpened.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#Faf9f6] border border-[#e2e5eb]">
                      <div className="text-[11px] text-[#555f6f]">Meetings Scheduled</div>
                      <div className="text-lg font-semibold text-[#1c2229] font-mono tabular-nums mt-0.5">
                        {summary.meetingsBooked.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacts Row */}
                <div className="py-3.5 pb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#555f6f]" />
                      <span className="text-sm font-medium text-[#1c2229]">
                        Contacts Sent (Form)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleManualConversionLog('contact')}
                      className="text-[11px] font-medium text-[#555f6f] hover:text-[#1c2229] underline cursor-pointer whitespace-nowrap shrink-0"
                      title="Record a completed contact submission"
                    >
                      {loggedConfirm === 'contact' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <Check className="w-3 h-3" /> Recorded
                        </span>
                      ) : (
                        '+ Log Contact'
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="p-3 rounded-lg bg-[#Faf9f6] border border-[#e2e5eb]">
                      <div className="text-[11px] text-[#555f6f]">Drawer Opened</div>
                      <div className="text-lg font-semibold text-[#1c2229] font-mono tabular-nums mt-0.5">
                        {summary.contactsOpened.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#Faf9f6] border border-[#e2e5eb]">
                      <div className="text-[11px] text-[#555f6f]">Messages Sent</div>
                      <div className="text-lg font-semibold text-[#1c2229] font-mono tabular-nums mt-0.5">
                        {summary.contactsSent.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Button Clicks Card */}
            <div className="bg-white rounded-xl border border-[#e2e5eb] p-5 sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e5eb]">
                <div>
                  <h2 className="text-base font-semibold text-[#1c2229]">
                    Social Button Clicks
                  </h2>
                  <p className="text-xs text-[#555f6f] mt-0.5">
                    Outbound profile clicks across portfolio headers &amp; footers
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#555f6f]">
                  {summary.socialClicks.toLocaleString()} total
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {SOCIAL_PLATFORMS.map((plat) => {
                  const count = summary.socials[plat.id] || 0;
                  const pct = Math.max(4, Math.round((count / maxSocialCount) * 100));
                  return (
                    <div key={plat.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <a
                          href={plat.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#1c2229] hover:underline"
                        >
                          {plat.label}
                        </a>
                        <span className="font-mono tabular-nums font-semibold text-[#1c2229]">
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#475569] rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom 2-Column Section: Pageviews by Route & Real-Time Activity Stream */}
        <section
          id="pages-stream"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left: Pageviews by Page / Route (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#e2e5eb] p-5 sm:p-6">
            <div className="pb-4 border-b border-[#e2e5eb]">
              <h2 className="text-base font-semibold text-[#1c2229]">Pageviews by Route</h2>
              <p className="text-xs text-[#555f6f] mt-0.5">
                Traffic distribution across portfolio pages and standalone apps
              </p>
            </div>

            <div className="divide-y divide-[#e2e5eb] mt-2">
              {sortedRoutes.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#555f6f]">
                  No route views recorded for this period yet.
                </div>
              ) : (
                sortedRoutes.map(([routePath, views]) => {
                  const barPct = Math.max(4, Math.round((views / maxRouteViews) * 100));
                  const friendly = ROUTE_LABELS[routePath] || routePath;
                  return (
                    <div key={routePath} className="py-2.5 first:pt-3 last:pb-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <a
                          href={routePath}
                          onClick={(e) => navigateTo(e, routePath)}
                          className="font-medium text-[#1c2229] hover:underline truncate"
                        >
                          {friendly}
                        </a>
                        <span className="font-mono tabular-nums font-semibold text-[#1c2229] shrink-0">
                          {views.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#f0f2f5] rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-[#64748b] rounded-full"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Live Interaction Feed (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#e2e5eb] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e2e5eb]">
              <div>
                <h2 className="text-base font-semibold text-[#1c2229]">
                  Recent Live Interactions
                </h2>
                <p className="text-xs text-[#555f6f] mt-0.5">
                  Real-time log of visitor actions across the website
                </p>
              </div>

              {/* Filter buttons for event stream */}
              <div className="flex items-center p-0.5 bg-[#eef0f4] rounded-lg border border-[#e2e5eb] self-start sm:self-auto">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'vibe_metric', label: 'Apps' },
                    { id: 'social_click', label: 'Social' },
                    { id: 'outreach', label: 'Outreach' },
                    { id: 'pageview', label: 'Views' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setEventFilter(f.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      eventFilter === f.id
                        ? 'bg-white text-[#1c2229] shadow-2xs font-semibold'
                        : 'text-[#555f6f] hover:text-[#1c2229]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#e2e5eb] mt-1 max-h-[380px] overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#555f6f]">
                  No matching interactions logged yet. Try clicking a social link or copying a
                  signature in another tab.
                </div>
              ) : (
                filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-[#Faf9f6] px-1.5 rounded transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#1c2229] truncate">{ev.label}</div>
                      <div className="text-[11px] text-[#555f6f] flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{ev.path}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ev.device}</span>
                        {ev.referrer && ev.referrer !== 'Direct' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>via {ev.referrer}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-[#555f6f] shrink-0">
                      {formatTimeAgo(ev.timestamp)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Quiet Footer */}
        <footer className="border-t border-[#e2e5eb] pt-6 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555f6f]">
          <div>
            First-party privacy-preserving analytics · Zero cookies · Stored on server
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/vibecoding"
              onClick={(e) => navigateTo(e, '/vibecoding')}
              className="hover:text-[#1c2229] transition-colors"
            >
              Vibe Coding Apps
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/"
              onClick={(e) => navigateTo(e, '/')}
              className="hover:text-[#1c2229] transition-colors"
            >
              Back to Main Page
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
