import React from 'react';
import { CharacterCustomization } from '../game/types';

interface TitleScreenProps {
  customization: CharacterCustomization;
  onOpenCustomizer: () => void;
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  customization,
  onOpenCustomizer,
  onStart,
}) => {
  const isStandalone = typeof window !== 'undefined' && window.self === window.top;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-between p-4 sm:p-8 bg-slate-950/85 text-slate-100 select-none overflow-y-auto">
      {/* Top Bar / Brand */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs tracking-widest text-slate-400 font-mono uppercase">
        <div className="flex items-center gap-2 sm:gap-3">
          {isStandalone && (
            <a
              href="/vibecoding"
              onClick={e => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  window.history.pushState({}, '', '/vibecoding');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors normal-case tracking-normal font-sans text-xs font-medium"
            >
              <span>← Vibe Coding</span>
            </a>
          )}
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500 shadow-sm" />
            <span>Republika Hrvatska · 4x World Odyssey</span>
          </span>
        </div>
        <span>4 Biomes · 14 Wonders · 1,680 Tiles</span>
      </div>

      {/* Main Title Centerpiece */}
      <div className="flex flex-col items-center text-center max-w-xl space-y-4 sm:space-y-6 my-auto py-4">
        {/* Bespoke Croatian Crest SVG Emblem */}
        <div className="w-20 h-24 sm:w-24 sm:h-28 relative flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 100 120" className="w-full h-full fill-none">
            <path
              d="M 10 10 H 90 V 70 C 90 95, 50 115, 50 115 C 50 115, 10 95, 10 70 Z"
              fill="#182230"
              stroke="#e2e8f0"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <g clipPath="url(#shieldClip)">
              <rect x="20" y="20" width="20" height="20" fill="#dc2626" />
              <rect x="40" y="20" width="20" height="20" fill="#f8fafc" />
              <rect x="60" y="20" width="20" height="20" fill="#dc2626" />
              <rect x="20" y="40" width="20" height="20" fill="#f8fafc" />
              <rect x="40" y="40" width="20" height="20" fill="#dc2626" />
              <rect x="60" y="40" width="20" height="20" fill="#f8fafc" />
              <rect x="20" y="60" width="20" height="20" fill="#dc2626" />
              <rect x="40" y="60" width="20" height="20" fill="#dc2626" />
              <rect x="60" y="60" width="20" height="20" fill="#dc2626" />
            </g>
            <clipPath id="shieldClip">
              <path d="M 16 16 H 84 V 68 C 84 90, 50 108, 50 108 C 50 108, 16 90, 16 68 Z" />
            </clipPath>
          </svg>
        </div>

        {/* Title Lockup */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans drop-shadow-md">
            CROTOPIA
          </h1>
          <p className="text-base sm:text-xl font-medium text-amber-300/90 tracking-wide">
            A Cozy Croatian Biome Odyssey
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md font-sans px-2">
          Roam a 4x expanded low-poly Croatian world with smooth movement. Explore the golden Pannonian plains of Slavonia, the hills of Zagorje, the karst peaks of Velebit, and the Adriatic islands.
        </p>

        {/* Action Buttons: Customize Explorer + Begin Journey */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 w-full sm:w-auto px-4">
          <button
            onClick={onOpenCustomizer}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <span
              className="w-4 h-4 rounded-full border border-white/60 shrink-0"
              style={{ backgroundColor: customization.outfitColor }}
            />
            <span>Customize Explorer ({customization.name})</span>
          </button>

          <button
            data-start="true"
            onClick={onStart}
            className="w-full sm:w-auto min-h-[48px] group relative inline-flex items-center justify-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white font-bold text-base shadow-xl hover:shadow-red-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span className="tracking-wide">Begin Journey</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Control Hint Line */}
      <div className="text-[11px] sm:text-xs text-slate-400 font-mono tracking-wider flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span>Hold WASD / Arrows or Touch Joystick</span>
        <span>·</span>
        <span>Tap Tile to Inspect & Glide</span>
        <span>·</span>
        <span>Pinch or Scroll to Zoom</span>
      </div>
    </div>
  );
};
