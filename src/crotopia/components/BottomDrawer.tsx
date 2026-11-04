import React from 'react';
import { TileData, LandmarkData } from '../game/types';
import { BIOMES } from '../game/mapData';

interface BottomDrawerProps {
  selectedTile: TileData | null;
  selectedLandmark: LandmarkData | null;
  playerPos: { x: number; z: number };
  isReachable: boolean;
  onMoveHere: (x: number, z: number) => void;
  onInteractLandmark: (landmark: LandmarkData) => void;
  onFocusCamera: (x: number, z: number) => void;
  onClose: () => void;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  selectedTile,
  selectedLandmark,
  playerPos,
  isReachable,
  onMoveHere,
  onInteractLandmark,
  onFocusCamera,
  onClose,
}) => {
  if (!selectedTile) return null;

  const biomeInfo = BIOMES[selectedTile.biome];
  const isPlayerHere =
    Math.round(playerPos.x) === selectedTile.x && Math.round(playerPos.z) === selectedTile.z;

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-2.5 sm:px-4 pointer-events-auto transition-transform duration-300">
      <div className="bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl p-3.5 sm:p-5 text-slate-100 relative max-h-[48vh] sm:max-h-[60vh] flex flex-col">
        {/* Close Button (>= 44x44px hitbox) */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close details"
        >
          ✕
        </button>

        {/* Scrollable Details Content */}
        <div className="overflow-y-auto pr-1 space-y-2.5">
          {/* Biome Badge & Coordinates */}
          <div className="flex items-center gap-2 pr-10">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: biomeInfo.colors.primary }}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 truncate">
              {biomeInfo.name}
            </span>
            <span className="text-[11px] text-slate-500 font-mono shrink-0">
              ({selectedTile.x}, {selectedTile.z})
            </span>
          </div>

          {/* Title & Icon Header */}
          <div className="flex items-start gap-3 pr-8">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-inner">
              {selectedLandmark ? selectedLandmark.icon : selectedTile.isLand ? '🌿' : '🌊'}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                <span className="truncate">
                  {selectedLandmark
                    ? selectedLandmark.name
                    : `${selectedTile.type.replace('_', ' ')} Tile`}
                </span>
                {isPlayerHere && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Explorer Here
                  </span>
                )}
              </h2>
              <p className="text-xs font-medium text-amber-300/80">
                {selectedLandmark
                  ? selectedLandmark.title
                  : `Terrain Elevation: ${(selectedTile.height * 100).toFixed(0)}m`}
              </p>
            </div>
          </div>

          {/* Highlighted Lore Note */}
          {selectedLandmark && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-100 text-xs leading-relaxed font-sans shadow-sm">
              <span className="font-bold text-amber-300 uppercase tracking-wider block text-[10px] mb-0.5">
                Highlighted Lore Note
              </span>
              &ldquo;{selectedLandmark.loreNote}&rdquo;
            </div>
          )}

          {/* Gameplay Buff Card */}
          {selectedLandmark?.gameBuff && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  {selectedLandmark.gameBuff.title}
                </span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {selectedLandmark.gameBuff.description}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-block text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                  {selectedLandmark.gameBuff.stat}
                </span>
              </div>
            </div>
          )}

          {/* Natural Tile Description when not a landmark */}
          {!selectedLandmark && (
            <div className="text-xs text-slate-300 leading-relaxed">
              {selectedTile.isLand
                ? `Part of the ${biomeInfo.name}. Rich regional terrain characterized by ${biomeInfo.paletteName}.`
                : 'The turquoise waters of the Adriatic Sea, flowing along the Croatian coastline.'}
            </div>
          )}
        </div>

        {/* Action Buttons Row (>= 44px touch targets) */}
        <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-800 shrink-0">
          {!isPlayerHere && selectedTile.type !== 'deep_water' && (
            <button
              onClick={() => onMoveHere(selectedTile.x, selectedTile.z)}
              className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isReachable
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md active:scale-95'
              }`}
            >
              <span>{isReachable ? '⚡ Glide Here' : '🧭 Travel Here'}</span>
            </button>
          )}

          {selectedLandmark && (
            <button
              onClick={() => onInteractLandmark(selectedLandmark)}
              className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>{selectedLandmark.actionLabel || 'Commune / Interact'}</span>
            </button>
          )}

          <button
            onClick={() => onFocusCamera(selectedTile.x, selectedTile.z)}
            className="min-h-[44px] min-w-[44px] py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer flex items-center justify-center"
            title="Focus camera"
          >
            🎯
          </button>
        </div>
      </div>
    </div>
  );
};
