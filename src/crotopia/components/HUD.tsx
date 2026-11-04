import React, { useEffect, useRef, useState } from 'react';
import { PlayerState, TileData } from '../game/types';
import { GRID_WIDTH, GRID_HEIGHT, getTileKey } from '../game/mapData';
import { VirtualJoystick } from './VirtualJoystick';

interface HUDProps {
  playerState: PlayerState;
  totalLandmarks: number;
  tiles: TileData[];
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCodex: () => void;
  onOpenCustomizer: () => void;
  onRecenterPlayer: () => void;
  onFocusCamera: (x: number, z: number) => void;
  onAdjustZoom: (delta: number) => void;
  onJoystickMove: (dx: number, dz: number) => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  playerState,
  totalLandmarks,
  tiles,
  isMuted,
  onToggleMute,
  onOpenCodex,
  onOpenCustomizer,
  onRecenterPlayer,
  onFocusCamera,
  onAdjustZoom,
  onJoystickMove,
  onPause,
}) => {
  const discoveredCount = playerState.discoveredLandmarks.size;
  const explorationPercent = Math.round(
    (playerState.revealedTiles.size / (GRID_WIDTH * GRID_HEIGHT)) * 100
  );
  const isStandalone = typeof window !== 'undefined' && window.self === window.top;
  const [showMinimap, setShowMinimap] = useState(true);

  const minimapCanvasRef = useRef<HTMLCanvasElement>(null);

  // Render crisp 42x40 canvas minimap (fast & mobile-friendly, 0 DOM bloat)
  useEffect(() => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 3;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const isRevealed = playerState.revealedTiles.has(getTileKey(tile.x, tile.z));

      let color = '#121820';
      if (isRevealed) {
        if (tile.landmarkId) {
          color = '#fbbf24';
        } else if (tile.isLand) {
          color =
            tile.biome === 'slavonia'
              ? '#d97706'
              : tile.biome === 'zagorje'
              ? '#22c55e'
              : tile.biome === 'lika'
              ? '#06b6d4'
              : '#f59e0b';
        } else {
          color = '#1e3a5f';
        }
      }

      ctx.fillStyle = color;
      ctx.fillRect(tile.x * scale, tile.z * scale, scale, scale);
    }

    // Draw player marker on top
    const px = Math.round(playerState.x) * scale;
    const pz = Math.round(playerState.z) * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 1, pz - 1, scale + 2, scale + 2);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(px, pz, scale, scale);
  }, [tiles, playerState.revealedTiles, playerState.x, playerState.z]);

  const handleMinimapTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const gx = Math.floor(((e.clientX - rect.left) / rect.width) * GRID_WIDTH);
    const gz = Math.floor(((e.clientY - rect.top) / rect.height) * GRID_HEIGHT);
    onFocusCamera(gx, gz);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-2.5 sm:p-4">
      {/* Top Status Bar & Controls */}
      <div className="w-full flex items-start justify-between gap-2">
        {/* Left Status Cluster */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto">
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
              className="min-h-[40px] sm:min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700/80 shadow-lg text-slate-200 font-semibold text-xs transition-colors"
              title="Back to Vibe Coding"
            >
              <span>←</span>
              <span className="hidden sm:inline">Vibe Coding</span>
            </a>
          )}

          {/* Stars / Currency Readout */}
          <div className="min-h-[40px] sm:min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-lg text-amber-300 font-bold text-xs sm:text-sm">
            <span>⭐</span>
            <span className="font-mono tabular-nums text-white">{playerState.stars}</span>
          </div>

          {/* Landmarks Discovered */}
          <div className="min-h-[40px] sm:min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-lg text-emerald-400 font-bold text-xs sm:text-sm">
            <span>🏛️</span>
            <span className="font-mono tabular-nums text-white">
              {discoveredCount}/{totalLandmarks}
            </span>
            <span className="text-[10px] text-emerald-300/80 font-sans uppercase tracking-wider hidden md:inline">
              Wonders
            </span>
          </div>

          {/* Exploration Percentage */}
          <div className="min-h-[40px] sm:min-h-[44px] hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-lg text-sky-400 font-bold text-xs sm:text-sm">
            <span>🧭</span>
            <span className="font-mono tabular-nums text-white">{explorationPercent}%</span>
          </div>

          {/* Mounted / Speed Status */}
          {playerState.isMounted && (
            <div className="min-h-[40px] sm:min-h-[44px] hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/90 border border-amber-600/70 text-amber-200 shadow-lg text-xs font-semibold">
              <span>🐎</span>
              <span>Lipizzaner Steed</span>
            </div>
          )}
        </div>

        {/* Right Action Icons Cluster (All >= 44x44px touch targets) */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
          {/* Customize Character Button */}
          <button
            onClick={onOpenCustomizer}
            className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            title="Customize Explorer"
            aria-label="Customize Explorer"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
              style={{ backgroundColor: playerState.customization.outfitColor }}
            />
            <span className="hidden sm:inline">{playerState.customization.name || 'Customize'}</span>
            <span className="sm:hidden">👕</span>
          </button>

          {/* Croatian Codex Button */}
          <button
            onClick={onOpenCodex}
            className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            title="Open Croatian Codex"
            aria-label="Open Codex"
          >
            <span>📖</span>
            <span className="hidden md:inline">Codex</span>
          </button>

          {/* Recenter Camera */}
          <button
            onClick={onRecenterPlayer}
            className="w-11 h-11 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Recenter on Explorer"
            aria-label="Recenter Camera"
          >
            📍
          </button>

          {/* Mute Audio */}
          <button
            onClick={onToggleMute}
            className="w-11 h-11 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Pause */}
          <button
            onClick={onPause}
            className="w-11 h-11 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Pause Game [Esc / P]"
            aria-label="Pause Game"
          >
            ⏸️
          </button>
        </div>
      </div>

      {/* Bottom Row: Mobile Virtual Joystick (Left) + Zoom & Minimap (Right) */}
      <div className="w-full flex items-end justify-between gap-2 pointer-events-none">
        {/* Left: Virtual Joystick + Desktop Hint */}
        <div className="flex flex-col items-start gap-2">
          <VirtualJoystick onChange={onJoystickMove} />
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 pointer-events-auto">
            <span>Hold WASD / Arrows or Drag Joystick</span>
            <span>·</span>
            <span>Tap Tile to Inspect & Travel</span>
          </div>
        </div>

        {/* Right: Zoom Controls + Collapsible 4x Croatia Minimap */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Quick Touch Zoom Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAdjustZoom(-3)}
              className="w-11 h-11 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              ＋
            </button>
            <button
              onClick={() => onAdjustZoom(3)}
              className="w-11 h-11 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              －
            </button>
            <button
              onClick={() => setShowMinimap(v => !v)}
              className="min-h-[44px] px-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shadow-lg active:scale-95 cursor-pointer sm:hidden"
              title="Toggle Minimap"
            >
              🗺️
            </button>
          </div>

          {/* Interactive 42x40 Canvas Minimap */}
          {showMinimap && (
            <div className="p-2 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-0.5">
                <span>Hrvatska 4x</span>
                <span className="font-mono text-slate-500">
                  ({Math.round(playerState.x)},{Math.round(playerState.z)})
                </span>
              </div>
              <canvas
                ref={minimapCanvasRef}
                width={GRID_WIDTH * 3}
                height={GRID_HEIGHT * 3}
                onClick={handleMinimapTap}
                className="w-[105px] h-[100px] sm:w-[138px] sm:h-[132px] rounded-lg bg-slate-950 cursor-pointer block border border-slate-800"
                title="Tap minimap to pan camera"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
