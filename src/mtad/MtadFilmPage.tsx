import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Film,
  Instagram,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import {
  FILMMAKER_CREDITS,
  FOUR_PIONEERS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LA28_PILLARS,
  PREMIERE_TARGET_ISO,
  PRESS_OUTLETS,
  STORY_CHAPTERS,
  type StoryChapter,
} from './mtadData';
import { trackSocialClick } from '../analytics/tracker';

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdownParts(targetIso: string): CountdownParts {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function padTwo(value: number): string {
  return String(value).padStart(2, '0');
}

interface FilmImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

function FilmImage({ src, alt, className = '', loading = 'lazy' }: FilmImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#121722] text-[#7E8594] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="h-8 w-8 opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

interface TimelineChapterRowProps {
  chapter: StoryChapter;
  index: number;
}

const TimelineChapterRow: React.FC<TimelineChapterRowProps> = ({ chapter, index }) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const isEven = index % 2 === 1;

  return (
    <div
      ref={rowRef}
      className="relative grid grid-cols-1 gap-8 pl-8 md:grid-cols-12 md:items-center md:gap-12 md:pl-0"
    >
      {/* Timeline Node */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-[#D4AF37]/80 bg-[#07090D] md:left-1/2 md:top-1/2 md:-translate-y-1/2"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#D91E36]" />
      </div>

      {/* Text Column */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={
          isEven
            ? 'md:col-span-5 md:col-start-8 md:text-left'
            : 'md:col-span-5 md:col-start-1 md:pr-4'
        }
      >
        <p className="font-mono text-xs tracking-[0.18em] text-[#D4AF37] uppercase tabular-nums">
          {chapter.date} <span className="text-white/30">·</span>{' '}
          <span className="text-[#9BA3B4]">{chapter.location}</span>
        </p>
        <h3 className="mt-3 font-display text-3xl font-semibold tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-4xl">
          {chapter.title}
        </h3>
        <p className="mt-4 font-editorial text-base leading-relaxed text-[#B5BAC5] sm:text-[17px]">
          {chapter.body}
        </p>
      </motion.div>

      {/* Archival Still Column with Scroll Parallax */}
      <motion.figure
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={
          isEven
            ? 'md:col-span-5 md:col-start-1 md:row-start-1'
            : 'md:col-span-5 md:col-start-8'
        }
      >
        <div className="relative overflow-hidden border border-white/10 bg-[#0E121A]">
          <motion.div style={{ y: imageY }} className="scale-[1.09]">
            <FilmImage
              src={chapter.image}
              alt={chapter.imageAlt}
              className="aspect-[16/10] w-full object-cover object-center"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090D]/60 via-transparent to-transparent"
          />
        </div>
        <figcaption className="mt-2.5 font-mono text-[11px] tracking-[0.08em] text-[#7E8594] uppercase">
          {chapter.caption}
        </figcaption>
      </motion.figure>
    </div>
  );
}

export default function MtadFilmPage() {
  const [activePioneerId, setActivePioneerId] = useState<string>(FOUR_PIONEERS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState<CountdownParts>(() =>
    getCountdownParts(PREMIERE_TARGET_ISO)
  );

  // Dummy newsletter form state
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Scroll containers for parallax and kinetic storytelling
  const heroRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const directorRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: pageProgress } = useScroll();
  const smoothProgress = useSpring(pageProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const posterY = useTransform(heroScroll, [0, 1], ['0%', '14%']);
  const posterScale = useTransform(heroScroll, [0, 1], [1, 1.07]);
  const posterOpacity = useTransform(heroScroll, [0, 0.9], [1, 0.35]);

  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 65%'],
  });
  const timelineFill = useSpring(timelineScroll, {
    stiffness: 120,
    damping: 24,
  });

  const { scrollYProgress: marqueeScroll } = useScroll({
    target: marqueeRef,
    offset: ['start end', 'end start'],
  });
  const marqueeX = useTransform(marqueeScroll, [0, 1], ['4%', '-10%']);

  const { scrollYProgress: directorScroll } = useScroll({
    target: directorRef,
    offset: ['start end', 'end start'],
  });
  const directorPortraitY = useTransform(directorScroll, [0, 1], [24, -24]);

  // Document title sync
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'More Than a Dream — The Team That Inspired a New Nation';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  // Live LA28 countdown ticker
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getCountdownParts(PREMIERE_TARGET_ISO));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const activePioneer =
    FOUR_PIONEERS.find((p) => p.id === activePioneerId) || FOUR_PIONEERS[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = subscriberEmail.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSubmitted(true);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleInstagramClick = () => {
    trackSocialClick('instagram', INSTAGRAM_URL);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#07090D] font-editorial text-[#F6F4EF] selection:bg-[#D91E36] selection:text-white">
        {/* Sticky 3-Zone Top Bar */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07090D]/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
            {/* Zone 1: Brand Wordmark */}
            <a
              href="#top"
              className="shrink-0 whitespace-nowrap font-display text-lg font-semibold tracking-[0.14em] text-[#F6F4EF] uppercase transition-colors hover:text-[#D4AF37] sm:text-xl"
            >
              More Than a Dream
            </a>

            {/* Zone 2: Center Nav Links (Desktop) */}
            <nav
              aria-label="Primary sections"
              className="hidden items-center gap-8 md:flex"
            >
              <a
                href="#story"
                className="shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.16em] text-[#B5BAC5] uppercase transition-colors hover:text-white"
              >
                The Story
              </a>
              <a
                href="#team"
                className="shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.16em] text-[#B5BAC5] uppercase transition-colors hover:text-white"
              >
                The Team
              </a>
              <a
                href="#filmmaker"
                className="shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.16em] text-[#B5BAC5] uppercase transition-colors hover:text-white"
              >
                Filmmaker
              </a>
              <a
                href="#premiere"
                className="shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.16em] text-[#B5BAC5] uppercase transition-colors hover:text-white"
              >
                LA28 Premiere
              </a>
            </nav>

            {/* Zone 3: Single Primary CTA + Mobile Toggle */}
            <div className="flex shrink-0 items-center gap-3">
              <a
                href="#updates"
                className="shrink-0 whitespace-nowrap bg-[#D91E36] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#BE192E]"
              >
                Get Updates
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#F6F4EF] transition-colors hover:border-white/35 md:hidden"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                aria-label="Mobile navigation"
                className="overflow-hidden border-t border-white/10 bg-[#0B0E15] md:hidden"
              >
                <div className="flex flex-col px-6 py-4">
                  {[
                    { label: 'The Story', href: '#story' },
                    { label: 'The Team', href: '#team' },
                    { label: 'Filmmaker', href: '#filmmaker' },
                    { label: 'LA28 Premiere', href: '#premiere' },
                    { label: 'Follow @croatiandreamteam', href: INSTAGRAM_URL, external: true },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      onClick={() => {
                        if (item.external) handleInstagramClick();
                        handleNavClick();
                      }}
                      className="flex items-center justify-between border-b border-white/5 py-3 text-xs font-medium tracking-[0.16em] text-[#D7DBE4] uppercase last:border-b-0 hover:text-[#D4AF37]"
                    >
                      <span>{item.label}</span>
                      {item.external && <ArrowUpRight className="h-3.5 w-3.5 text-[#D4AF37]" />}
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Scroll Progress Hairline */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: smoothProgress }}
            className="h-[2px] origin-left bg-gradient-to-r from-[#D91E36] via-[#E8524A] to-[#D4AF37]"
          />
        </header>

        {/* SECTION 1: CINEMATIC HERO WITH SCROLL-PARALLAX OFFICIAL KEY ART */}
        <section
          id="top"
          ref={heroRef}
          className="relative overflow-hidden bg-[#07090D] pt-16"
        >
          <h1 className="sr-only">
            More Than a Dream: The Team That Inspired a New Nation — A Documentary Film by Jack Baric
          </h1>

          {/* Unobstructed Official Theatrical Key Art Stage */}
          <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden">
            <motion.div
              style={{ y: posterY, scale: posterScale, opacity: posterOpacity }}
              className="relative w-full"
            >
              <FilmImage
                src="/assets/mtad/hero-poster.jpg"
                alt="Official key art for More Than a Dream: The Team That Inspired a New Nation featuring Dražen Petrović, Toni Kukoč, Dino Rađa, and Stojko Vranković under arena spotlights"
                loading="eager"
                className="aspect-[16/9] max-h-[76svh] w-full object-cover object-top"
              />
            </motion.div>

            {/* Atmospheric Edge Blending into Deep Arena Obsidian */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07090D] via-[#07090D]/80 to-transparent sm:h-44"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#07090D] to-transparent xl:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#07090D] to-transparent xl:block"
            />
          </div>

          {/* Editorial Hook & Primary Action Band Anchored Below Key Art */}
          <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-5 pb-16 text-center sm:-mt-16 sm:px-8 sm:pb-24">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-mono text-[11px] tracking-[0.22em] text-[#D4AF37] uppercase sm:text-xs"
            >
              Feature Documentary <span className="text-white/30">·</span> Directed by Jack Baric{' '}
              <span className="text-white/30">·</span> Barcelona ’92 to LA28
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-4 max-w-3xl font-display text-2xl font-medium leading-[1.18] tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-4xl md:text-[42px]"
            >
              What if the most compelling squad in the 1992 Barcelona Olympics wasn’t the Dream Team?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#B5BAC5] sm:text-lg"
            >
              While war raged across their newly independent homeland, four future NBA pioneers stepped
              onto the Olympic floor under a brand-new flag—carrying an entire nation’s hope all the way
              to a gold-medal showdown with Michael Jordan and Team USA.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <a
                href="#updates"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#D91E36] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#BE192E] sm:w-auto"
              >
                <Mail className="h-4 w-4" />
                Join the Screening List
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstagramClick}
                className="inline-flex w-full items-center justify-center gap-2 border border-white/20 bg-white/[0.03] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F6F4EF] uppercase transition-colors hover:border-[#D4AF37]/70 hover:text-[#D4AF37] sm:w-auto"
              >
                <Instagram className="h-4 w-4" />
                Follow {INSTAGRAM_HANDLE}
              </a>
            </motion.div>

            <motion.a
              href="#story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#7E8594] uppercase transition-colors hover:text-[#D4AF37]"
            >
              <span>Scroll to enter Barcelona ’92</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </motion.a>
          </div>
        </section>

        {/* KINETIC SCROLL-LINKED SCOREBOARD BAND */}
        <div
          ref={marqueeRef}
          aria-hidden="true"
          className="overflow-hidden border-y border-white/10 bg-[#0B0E15] py-4"
        >
          <motion.div
            style={{ x: marqueeX }}
            className="flex whitespace-nowrap font-display text-sm tracking-[0.26em] text-[#9BA3B4] uppercase sm:text-base"
          >
            <span className="mx-6">Barcelona 1992</span>
            <span className="text-[#D91E36]">◆</span>
            <span className="mx-6 text-[#F6F4EF]">Olympic Silver Medalists</span>
            <span className="text-[#D4AF37]">◆</span>
            <span className="mx-6">Croatia 75 — Unified Team 74</span>
            <span className="text-[#D91E36]">◆</span>
            <span className="mx-6 text-[#F6F4EF]">A Nation’s First Olympic Flag</span>
            <span className="text-[#D4AF37]">◆</span>
            <span className="mx-6">Four NBA Pioneers</span>
            <span className="text-[#D91E36]">◆</span>
            <span className="mx-6 text-[#F6F4EF]">Premiering LA28</span>
            <span className="text-[#D4AF37]">◆</span>
            <span className="mx-6">Barcelona 1992</span>
          </motion.div>
        </div>

        {/* SECTION 2: THE STORY — SCROLL-LINKED 1992 CHRONICLE */}
        <section id="story" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.22em] text-[#D4AF37] uppercase">
              01 <span className="text-white/30">/</span> The Story
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-5xl md:text-6xl">
              Bigger Than Basketball
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#B5BAC5] sm:text-lg">
              Before the opening tip in Barcelona, Croatia’s players weren’t simply chasing a podium.
              They were fighting for a young country’s visibility, dignity, and survival—turning every
              possession into a message heard around the globe.
            </p>
          </div>

          {/* Scroll-Linked Vertical Timeline Container */}
          <div ref={timelineRef} className="relative mt-16 space-y-20 sm:mt-24 sm:space-y-28">
            {/* Base Track */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 top-2 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2"
            />
            {/* Active Scroll-Driven Fill */}
            <motion.div
              aria-hidden="true"
              style={{ scaleY: timelineFill }}
              className="absolute bottom-0 left-0 top-2 w-[2px] origin-top bg-gradient-to-b from-[#D91E36] via-[#E06A3E] to-[#D4AF37] md:left-1/2 md:-translate-x-1/2"
            />

            {STORY_CHAPTERS.map((chapter, index) => (
              <TimelineChapterRow key={chapter.id} chapter={chapter} index={index} />
            ))}
          </div>
        </section>

        {/* SECTION 3: THE FOUR PIONEERS — INTERACTIVE ROSTER SHOWCASE */}
        <section
          id="team"
          className="border-t border-white/10 bg-[#0B0E15] py-20 sm:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-xs tracking-[0.22em] text-[#D4AF37] uppercase">
                  02 <span className="text-white/30">/</span> The Team
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-5xl md:text-6xl">
                  The Four Pioneers
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#9BA3B4] sm:text-base">
                They opened the NBA’s doors for generations of international stars—and came together in
                the summer of 1992 to write their homeland into Olympic history.
              </p>
            </div>

            {/* Interactive 4-Player Selector Tabs */}
            <div
              role="tablist"
              aria-label="Croatia 1992 NBA Pioneers"
              className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 lg:grid-cols-4"
            >
              {FOUR_PIONEERS.map((player) => {
                const isSelected = player.id === activePioneer.id;
                return (
                  <button
                    key={player.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActivePioneerId(player.id)}
                    className={`group relative flex flex-col justify-between border p-4 text-left transition-colors sm:p-5 ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#131926]'
                        : 'border-white/10 bg-[#0E121A] hover:border-white/25 hover:bg-[#121722]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`font-mono text-xs tracking-[0.16em] uppercase tabular-nums ${
                          isSelected ? 'text-[#D4AF37]' : 'text-[#7E8594]'
                        }`}
                      >
                        CRO #{player.olympicNumber}
                      </span>
                      <span className="font-mono text-[11px] text-[#7E8594] tabular-nums">
                        NBA #{player.nbaNumber}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="font-display text-xl font-semibold tracking-[0.03em] text-[#F6F4EF] uppercase sm:text-2xl">
                        {player.name}
                      </p>
                      <p className="mt-1 text-xs text-[#9BA3B4]">{player.moniker}</p>
                    </div>
                    {isSelected && (
                      <motion.span
                        layoutId="pioneer-active-bar"
                        className="absolute inset-x-0 bottom-0 h-[2px] bg-[#D91E36]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Pioneer Editorial Spotlight */}
            <div className="mt-8 border border-white/10 bg-[#0E121A]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePioneer.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12"
                >
                  {/* Portrait Panel */}
                  <div className="relative overflow-hidden bg-[#07090D] lg:col-span-5">
                    <FilmImage
                      src={activePioneer.image}
                      alt={activePioneer.imageAlt}
                      className="aspect-[4/4] w-full object-cover object-top lg:h-full lg:aspect-auto"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E121A] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0E121A]"
                    />
                    <div className="absolute bottom-4 left-5 font-mono text-xs tracking-[0.18em] text-[#D4AF37] uppercase tabular-nums">
                      Croatia #{activePioneer.olympicNumber} <span className="text-white/35">·</span>{' '}
                      {activePioneer.position}
                    </div>
                  </div>

                  {/* Bio & Honors Panel */}
                  <div className="relative flex flex-col justify-between p-6 sm:p-10 lg:col-span-7 lg:p-12">
                    {/* Subtle Architectural Jersey Number Watermark */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-6 top-3 select-none font-display text-[110px] font-bold leading-none text-white/[0.03] tabular-nums sm:text-[150px]"
                    >
                      {activePioneer.olympicNumber}
                    </span>

                    <div className="relative">
                      <p className="font-mono text-xs tracking-[0.18em] text-[#D91E36] uppercase">
                        {activePioneer.nbaTeams}
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-semibold tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-5xl">
                        {activePioneer.name}
                      </h3>
                      <p className="mt-4 font-display text-lg tracking-[0.02em] text-[#D4AF37] uppercase sm:text-xl">
                        {activePioneer.headline}
                      </p>
                      <p className="mt-4 text-base leading-relaxed text-[#B5BAC5]">
                        {activePioneer.bio}
                      </p>
                    </div>

                    <div className="relative mt-8 border-t border-white/10 pt-6">
                      <p className="font-mono text-[11px] tracking-[0.2em] text-[#7E8594] uppercase">
                        Legacy & Honors
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {activePioneer.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm text-[#E4E6EC]"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#D4AF37]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 4: VOICES FROM THE FILM & PUBLIC PRESS */}
        <section className="border-t border-white/10 bg-[#07090D] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Behind-the-Scenes Interview Photo */}
              <motion.figure
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65 }}
                className="lg:col-span-6"
              >
                <div className="overflow-hidden border border-white/10 bg-[#0E121A]">
                  <FilmImage
                    src="/assets/mtad/kukoc-interview.jpg"
                    alt="Director Jack Baric interviewing Hall of Famer Toni Kukoč on camera for More Than a Dream"
                    className="aspect-[4/3] w-full object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] tracking-[0.12em] text-[#7E8594] uppercase">
                  On set · Director Jack Baric interviewing Hall of Famer Toni Kukoč
                </figcaption>
              </motion.figure>

              {/* Verified Toni Kukoč Quote */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="lg:col-span-6"
              >
                <p className="font-mono text-xs tracking-[0.22em] text-[#D4AF37] uppercase">
                  03 <span className="text-white/30">/</span> In Their Own Words
                </p>
                <blockquote className="mt-5 font-serif text-xl leading-relaxed text-[#F6F4EF] sm:text-2xl sm:leading-[1.5]">
                  “Representing Croatia in 1992 was one of the greatest honors of my life. Our people
                  were going through a very hard time, and the Olympics were much more than a
                  basketball tournament for me and my teammates. We wanted to do something for our
                  people. I’m thankful to Jack for telling the story of what that team meant—not just
                  for basketball, but for Croatia.”
                </blockquote>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-display text-lg font-semibold tracking-[0.06em] text-[#F6F4EF] uppercase">
                    Toni Kukoč
                  </p>
                  <p className="mt-0.5 font-mono text-xs tracking-[0.12em] text-[#9BA3B4] uppercase">
                    1992 Croatian Olympian · 3× NBA Champion · Hall of Famer
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Clean Typographic Press Strip */}
            <div className="mt-16 border-t border-white/10 pt-10 sm:mt-20">
              <p className="text-center font-mono text-[11px] tracking-[0.24em] text-[#7E8594] uppercase">
                Press Coverage
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
                {PRESS_OUTLETS.map((outlet) => (
                  <span
                    key={outlet}
                    className="font-display text-lg tracking-[0.12em] text-[#B5BAC5]/80 uppercase sm:text-xl"
                  >
                    {outlet}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: THE FILMMAKER — JACK BARIC */}
        <section
          id="filmmaker"
          ref={directorRef}
          className="border-t border-white/10 bg-[#0B0E15] py-20 sm:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Director Portrait with Subtle Scroll Motion */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden border border-white/10 bg-[#07090D]">
                  <motion.div style={{ y: directorPortraitY }} className="scale-[1.06]">
                    <FilmImage
                      src="/assets/mtad/jack-baric.jpg"
                      alt="Emmy Award-winning filmmaker Jack Baric"
                      className="aspect-[4/5] w-full object-cover object-top"
                    />
                  </motion.div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07090D]/80 to-transparent"
                  />
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[11px] tracking-[0.16em] text-[#D4AF37] uppercase">
                    <span>Jack Baric</span>
                    <span className="text-white/60">Director · Producer</span>
                  </div>
                </div>
              </div>

              {/* Personal Story & Director's Note */}
              <div className="lg:col-span-7">
                <p className="font-mono text-xs tracking-[0.22em] text-[#D4AF37] uppercase">
                  04 <span className="text-white/30">/</span> The Filmmaker
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-5xl">
                  Jack Baric
                </h2>
                <p className="mt-2 font-mono text-xs tracking-[0.14em] text-[#9BA3B4] uppercase">
                  Emmy Award-Winning Filmmaker <span className="text-white/30">·</span> Co-Founder,
                  GameChange
                </p>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-[#B5BAC5]">
                  <p>
                    Raised in the Croatian-American harbor community of San Pedro, California, Jack
                    Baric grew up shaped by his late father’s courage—who escaped communist Yugoslavia
                    in a small boat at age fifteen and spent four years as a political refugee in Italy
                    before building a new life in America.
                  </p>
                  <p>
                    As war broke out in Croatia, Jack volunteered in Washington advocating for American
                    recognition of Croatia’s independence. On{' '}
                    <span className="font-mono text-sm text-[#F6F4EF]">April 7, 1992</span>, he was the
                    sole Croatian representative seated inside the U.S. Congressional Foreign Relations
                    Committee hearing room when official American recognition was announced. Three
                    months later, his two lifelong passions—Croatia and basketball—collided in
                    Barcelona.
                  </p>
                </div>

                {/* Verified Director Statement */}
                <blockquote className="mt-7 border-y border-white/10 py-6 font-serif text-lg leading-relaxed text-[#F6F4EF] sm:text-xl">
                  “More Than a Dream is more than a sports story—it’s about a nation fighting to define
                  itself under impossible circumstances, and the courage of athletes who carried the
                  hopes of an entire country onto the world stage.”
                </blockquote>

                {/* Selected Documentary Credits */}
                <div className="mt-8">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[#7E8594] uppercase">
                    Selected Documentary Works
                  </p>
                  <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
                    {FILMMAKER_CREDITS.map((credit) => (
                      <div key={credit.title} className="py-4">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                          <h3 className="font-display text-xl font-semibold tracking-[0.03em] text-[#F6F4EF] uppercase">
                            {credit.title}
                          </h3>
                          <span className="font-mono text-[11px] tracking-[0.12em] text-[#D4AF37] uppercase">
                            {credit.recognition}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#9BA3B4]">
                          {credit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: LA28 WATERFRONT PREMIERE & LIVE COUNTDOWN */}
        <section
          id="premiere"
          className="relative overflow-hidden border-t border-white/10 bg-[#07090D] py-20 sm:py-28"
        >
          {/* Subtle Warm Arena Spotlight Wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-80 w-[640px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_70%)]"
          />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-xs tracking-[0.22em] text-[#D4AF37] uppercase">
                05 <span className="text-white/30">/</span> Road to Los Angeles 2028
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-5xl md:text-6xl">
                The LA28 Waterfront Premiere
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#B5BAC5] sm:text-lg">
                On the eve of the 2028 Los Angeles Olympic Games,{' '}
                <span className="italic text-[#F6F4EF]">More Than a Dream</span> is slated to debut
                with a historic movie palace screening and a celebration along the Los Angeles
                Waterfront—honoring the 1992 team where the Olympic flame returns.
              </p>
            </div>

            {/* Live Ticking Countdown to July 13, 2028 */}
            <div className="mx-auto mt-10 max-w-3xl border border-white/10 bg-[#0E121A] px-4 py-7 sm:mt-12 sm:px-8 sm:py-9">
              <p className="text-center font-mono text-[11px] tracking-[0.22em] text-[#9BA3B4] uppercase">
                Countdown to Eve of the LA28 Opening Ceremony · July 13, 2028
              </p>
              <div
                aria-live="off"
                className="mt-6 grid grid-cols-4 divide-x divide-white/10 text-center"
              >
                {[
                  { label: 'Days', value: String(countdown.days) },
                  { label: 'Hours', value: padTwo(countdown.hours) },
                  { label: 'Minutes', value: padTwo(countdown.minutes) },
                  { label: 'Seconds', value: padTwo(countdown.seconds) },
                ].map((unit) => (
                  <div key={unit.label} className="px-2 sm:px-4">
                    <div className="font-mono text-2xl font-semibold tracking-tight text-[#F6F4EF] tabular-nums sm:text-5xl">
                      {unit.value}
                    </div>
                    <div className="mt-2 font-mono text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase sm:text-xs">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premiere Venues Visual Pair */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.figure
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden border border-white/10 bg-[#0E121A]"
              >
                <FilmImage
                  src="/assets/mtad/premiere-palace.jpg"
                  alt="Packed audience inside the historic Warner Grand Theatre movie palace in San Pedro, Los Angeles"
                  className="aspect-[16/9] w-full object-cover"
                />
                <figcaption className="flex items-center justify-between px-5 py-4">
                  <span className="font-display text-base tracking-[0.06em] text-[#F6F4EF] uppercase">
                    Historic Movie Palace Screening
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-[#D4AF37] uppercase">
                    San Pedro · LA
                  </span>
                </figcaption>
              </motion.figure>

              <motion.figure
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="overflow-hidden border border-white/10 bg-[#0E121A]"
              >
                <FilmImage
                  src="/assets/mtad/premiere-waterfront.jpg"
                  alt="Los Angeles Waterfront promenade overlooking the harbor"
                  className="aspect-[16/9] w-full object-cover"
                />
                <figcaption className="flex items-center justify-between px-5 py-4">
                  <span className="font-display text-base tracking-[0.06em] text-[#F6F4EF] uppercase">
                    Post-Screening Waterfront Celebration
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-[#D4AF37] uppercase">
                    LA Waterfront
                  </span>
                </figcaption>
              </motion.figure>
            </div>

            {/* Three Premiere Pillars */}
            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 md:grid-cols-3">
              {LA28_PILLARS.map((pillar) => (
                <div key={pillar.step}>
                  <span className="font-mono text-xs tracking-[0.2em] text-[#D91E36] tabular-nums">
                    {pillar.step}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-[0.04em] text-[#F6F4EF] uppercase">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#9BA3B4]">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: SCREENING LIST (DUMMY NEWSLETTER) & INSTAGRAM COMMUNITY */}
        <section
          id="updates"
          className="border-t border-white/10 bg-[#0B0E15] py-20 sm:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Newsletter Signup */}
              <div className="border border-white/10 bg-[#0E121A] p-7 sm:p-10 lg:col-span-7">
                <p className="font-mono text-xs tracking-[0.22em] text-[#D4AF37] uppercase">
                  Screening List
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[0.02em] text-[#F6F4EF] uppercase sm:text-4xl">
                  Be First to See the Trailer & Premiere Dates
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#B5BAC5] sm:text-base">
                  Sign up for updates on archival releases, festival announcements, and invitations as{' '}
                  <span className="italic text-[#F6F4EF]">More Than a Dream</span> heads toward LA28.
                </p>

                {newsletterSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 border border-[#D4AF37]/40 bg-[#07090D] p-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-[#D4AF37] text-[#07090D]">
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </span>
                      <div>
                        <p className="font-display text-xl font-semibold tracking-[0.04em] text-[#F6F4EF] uppercase">
                          You’re on the Screening List
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#B5BAC5]">
                          Thanks{subscriberName.trim() ? `, ${subscriberName.trim()}` : ''}. We’ve
                          recorded <span className="text-[#F6F4EF]">{subscriberEmail}</span> for this
                          preview signup. While the film is in production, follow{' '}
                          <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInstagramClick}
                            className="text-[#D4AF37] underline underline-offset-4 hover:text-white"
                          >
                            {INSTAGRAM_HANDLE}
                          </a>{' '}
                          for live dispatches.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setNewsletterSubmitted(false);
                            setSubscriberEmail('');
                            setSubscriberName('');
                          }}
                          className="mt-4 font-mono text-xs tracking-[0.14em] text-[#9BA3B4] uppercase underline underline-offset-4 transition-colors hover:text-white"
                        >
                          Register another email
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} noValidate className="mt-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="mtad-name"
                          className="block font-mono text-[11px] tracking-[0.16em] text-[#9BA3B4] uppercase"
                        >
                          First Name <span className="text-[#7E8594]">(Optional)</span>
                        </label>
                        <input
                          id="mtad-name"
                          type="text"
                          value={subscriberName}
                          onChange={(e) => setSubscriberName(e.target.value)}
                          placeholder="Dražen"
                          className="mt-2 w-full border border-white/15 bg-[#07090D] px-4 py-3 text-sm text-[#F6F4EF] placeholder:text-[#5B6270] focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="mtad-email"
                          className="block font-mono text-[11px] tracking-[0.16em] text-[#9BA3B4] uppercase"
                        >
                          Email Address <span className="text-[#D91E36]">*</span>
                        </label>
                        <input
                          id="mtad-email"
                          type="email"
                          required
                          value={subscriberEmail}
                          onChange={(e) => {
                            setSubscriberEmail(e.target.value);
                            if (newsletterError) setNewsletterError('');
                          }}
                          placeholder="you@example.com"
                          className="mt-2 w-full border border-white/15 bg-[#07090D] px-4 py-3 text-sm text-[#F6F4EF] placeholder:text-[#5B6270] focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    {newsletterError && (
                      <p role="alert" className="text-xs text-[#F26B7A]">
                        {newsletterError}
                      </p>
                    )}

                    <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 bg-[#D91E36] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#BE192E] sm:w-auto"
                      >
                        Notify Me
                      </button>
                      <p className="font-mono text-[11px] tracking-[0.06em] text-[#7E8594]">
                        Preview signup · No spam, ever.
                      </p>
                    </div>
                  </form>
                )}
              </div>

              {/* Instagram Community Callout */}
              <div className="flex flex-col justify-between border border-white/10 bg-[#0E121A] p-7 sm:p-10 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-3 text-[#D4AF37]">
                    <Instagram className="h-5 w-5" />
                    <span className="font-mono text-xs tracking-[0.2em] uppercase">
                      Official Instagram
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-semibold tracking-[0.03em] text-[#F6F4EF] uppercase">
                    Follow the Journey
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B5BAC5] sm:text-base">
                    Join basketball fans, Croatian diaspora communities, and documentary lovers
                    following the making of <span className="italic text-[#F6F4EF]">More Than a Dream</span>—with
                    archival moments from Barcelona ’92, behind-the-scenes interviews, and road-to-LA28
                    announcements.
                  </p>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-mono text-xs tracking-[0.14em] text-[#9BA3B4] uppercase">
                    {INSTAGRAM_HANDLE}
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleInstagramClick}
                    className="mt-4 inline-flex w-full items-center justify-between border border-[#D4AF37]/60 bg-[#D4AF37]/10 px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F6F4EF] uppercase transition-colors hover:bg-[#D4AF37] hover:text-[#07090D]"
                  >
                    <span>Follow on Instagram</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUIET THEATRICAL CREDITS FOOTER */}
        <footer className="border-t border-white/10 bg-[#07090D] py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
            <div>
              <p className="font-display text-base font-semibold tracking-[0.16em] text-[#F6F4EF] uppercase">
                More Than a Dream
              </p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-[#7E8594] uppercase">
                A GameChange Original <span className="text-white/20">·</span> Directed & Produced by
                Jack Baric
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] tracking-[0.14em] text-[#9BA3B4] uppercase">
              <a href="#story" className="transition-colors hover:text-white">
                Story
              </a>
              <a href="#team" className="transition-colors hover:text-white">
                Team
              </a>
              <a href="#filmmaker" className="transition-colors hover:text-white">
                Filmmaker
              </a>
              <a href="#premiere" className="transition-colors hover:text-white">
                LA28
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstagramClick}
                className="inline-flex items-center gap-1.5 text-[#D4AF37] transition-colors hover:text-white"
              >
                <Instagram className="h-3.5 w-3.5" />
                <span>{INSTAGRAM_HANDLE}</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
