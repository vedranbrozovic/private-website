import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ExternalLink,
  Play,
  RotateCcw,
  Maximize2,
  X,
  Gamepad2,
  TrendingUp,
  Coins,
  Beer,
  Linkedin, 
  Github, 
  Instagram, 
  Youtube, 
  Twitter 
} from 'lucide-react';
import { SocialLink } from './SocialLink';

interface VibeApp {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  localUrl: string;
  githubUrl: string;
  icon: React.ElementType;
}

const APPS: VibeApp[] = [
  {
    id: 'wolt-game',
    title: 'Wolt Delivery Game (v2)',
    category: 'HTML5 CANVAS / GAME',
    year: '2025',
    description: 'A fun, single-file HTML5 arcade game about delivering food on time against city obstacles and clocks. Built in one quick vibe coding session.',
    localUrl: '/games/wolt_game_v2.html',
    githubUrl: 'https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/wolt_game_v2.html',
    icon: Gamepad2
  },
  {
    id: 'economic-time-traveler',
    title: 'Economic Time Traveler',
    category: 'HTML5 VIZ',
    year: '2025',
    description: 'Slide through the decades and witness macroeconomic and cultural shifts in a single self-contained HTML file visualization.',
    localUrl: '/games/economic_time_traveler_v2.html',
    githubUrl: 'https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/economic_time_traveler_v2',
    icon: TrendingUp
  },
  {
    id: 'potato-inflation',
    title: 'Potato Inflation (v3)',
    category: 'HTML5 APP',
    year: '2025',
    description: 'A whimsical calculator and visualizer for analyzing inflation metrics through the universal, unassailable currency of potatoes.',
    localUrl: '/games/potato_inflation_v3.html',
    githubUrl: 'https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/potato_inflation_v3.html',
    icon: Coins
  },
  {
    id: 'beer-indicator',
    title: 'Beer Indicator',
    category: 'HTML5 EXPERIMENT',
    year: '2025',
    description: 'An interactive HTML5 experiment exploring playful economic data points and purchasing power parity across regions.',
    localUrl: '/games/beer_indicator.html',
    githubUrl: 'https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/beer_indicator.html',
    icon: Beer
  }
];

const VibeCoding: React.FC = () => {
  const [selectedAppId, setSelectedAppId] = useState<string>('wolt-game');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const playerRef = useRef<HTMLDivElement>(null);

  const activeApp = APPS.find(app => app.id === selectedAppId) || APPS[0];

  const navigateHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectApp = (appId: string) => {
    setSelectedAppId(appId);
    setIframeKey(k => k + 1);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleRestart = () => {
    setIframeKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#Faf9f6] text-[#20242c] font-sans flex flex-col justify-start px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 selection:bg-[#1c2229] selection:text-white antialiased">
      <div className="max-w-[760px] w-full mx-auto">
        
        {/* Navigation back to main site */}
        <div className="mb-6">
          <a
            href="/"
            onClick={navigateHome}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1c2229]/60 hover:text-[#1c2229] transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Vedran Brozović</span>
          </a>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1c2229] mb-1">
            Vibe Coding Apps
          </h1>
          <p className="text-[15px] sm:text-base text-[#1c2229]/75 leading-relaxed">
            Single-file HTML5 games, data visualizers, and playful apps built in quick vibe coding sessions. Select any app below to play or explore directly.
          </p>
        </div>

        {/* Interactive App Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {APPS.map((app) => {
            const isSelected = app.id === selectedAppId;
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => handleSelectApp(app.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#1c2229] text-white border-[#1c2229] shadow-2xs'
                    : 'bg-white/80 hover:bg-white text-[#1c2229]/70 hover:text-[#1c2229] border-[#e2e5eb]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#1c2229]/60'}`} />
                <span>{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* Embedded Interactive Player */}
        <div ref={playerRef} className="mb-10 bg-white rounded-xl border border-[#e2e5eb] shadow-xs overflow-hidden">
          {/* Embed Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#f6f7f9] border-b border-[#e2e5eb]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm text-[#1c2229] truncate">
                  {activeApp.title}
                </h3>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#1c2229]/50 block">
                  {activeApp.category} • {activeApp.year}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[#1c2229]/70 hover:text-[#1c2229] hover:bg-black/5 transition-colors"
                title="Restart Game / Reload"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reload</span>
              </button>

              <a
                href={activeApp.localUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[#1c2229]/70 hover:text-[#1c2229] hover:bg-black/5 transition-colors"
                title="Open fullscreen in new tab"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Tab</span>
              </a>

              <a
                href={activeApp.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[#1c2229]/70 hover:text-[#1c2229] hover:bg-black/5 transition-colors"
                title="View HTML Source on GitHub"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Source</span>
              </a>
            </div>
          </div>

          {/* Iframe display */}
          <div className="relative w-full h-[520px] sm:h-[620px] bg-[#f8f9fa]">
            <iframe
              key={`${activeApp.id}-${iframeKey}`}
              src={activeApp.localUrl}
              title={activeApp.title}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              loading="lazy"
            />
          </div>
        </div>

        {/* Apps Directory / Details List */}
        <div className="space-y-4 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c2229]/50 mb-3">
            All Vibe Coded Single-HTML Apps
          </h2>

          <div className="grid grid-cols-1 gap-3.5">
            {APPS.map((app) => {
              const isSelected = app.id === selectedAppId;
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app.id)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1c2229]/40 shadow-xs ring-1 ring-[#1c2229]/20'
                      : 'bg-white/70 hover:bg-white border-[#e2e5eb] hover:border-[#1c2229]/25'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        isSelected ? 'bg-[#1c2229] text-white' : 'bg-[#f0f2f5] text-[#1c2229]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-[#1c2229]">
                            {app.title}
                          </h3>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f0f2f5] text-[#1c2229]/70">
                            {app.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#4a5568] mt-1.5 leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectApp(app.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-[#1c2229] text-white'
                            : 'bg-[#f0f2f5] hover:bg-[#e4e7eb] text-[#1c2229]'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{isSelected ? 'Active' : 'Play / Embed'}</span>
                      </button>

                      <a
                        href={app.localUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-[#1c2229]/60 hover:text-[#1c2229] hover:bg-[#f0f2f5] transition-colors"
                        title="Open in new window"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with return link & social icons matching main site */}
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 border-t border-[#e2e5eb] pt-7 mt-12">
          <div className="flex gap-2.5 sm:gap-3.5 items-center flex-wrap">
            <SocialLink 
              href="https://www.linkedin.com/in/vedranbrozovic/" 
              icon={Linkedin} 
              label="LinkedIn" 
              platform="linkedin" 
            />
            <SocialLink 
              href="https://github.com/vedranbrozovic" 
              icon={Github} 
              label="GitHub" 
              platform="github" 
            />
            <SocialLink 
              href="https://instagram.com/vedranbrozovic" 
              icon={Instagram} 
              label="Instagram" 
              platform="instagram" 
            />
            <SocialLink 
              href="https://www.youtube.com/@vedran.brozovic" 
              icon={Youtube} 
              label="YouTube" 
              platform="youtube" 
            />
            <SocialLink 
              href="https://twitter.com/vedranbrozovic" 
              icon={Twitter} 
              label="Twitter (X)" 
              platform="twitter" 
            />
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <a 
              href="/reading"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  window.history.pushState({}, '', '/reading');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-[#1c2229]/60 hover:text-[#1c2229] transition-colors"
            >
              Reading
            </a>
            <span className="text-[#1c2229]/20">•</span>
            <a 
              href="/"
              onClick={navigateHome}
              className="text-[#1c2229]/60 hover:text-[#1c2229] inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to main site</span>
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default VibeCoding;
