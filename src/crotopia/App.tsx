import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { BottomDrawer } from './components/BottomDrawer';
import { CodexModal } from './components/CodexModal';
import { CharacterCustomizerModal } from './components/CharacterCustomizerModal';
import { PauseModal, VictoryModal } from './components/StatusModals';
import { WorldScene } from './game/worldScene';
import { generateCroatiaMap, LANDMARKS, SPAWN_X, SPAWN_Z, getTileKey } from './game/mapData';
import { canMoveTo, getReachableTiles, revealFogOfWar } from './game/logic';
import {
  TileData,
  LandmarkData,
  PlayerState,
  CharacterCustomization,
  DEFAULT_CHARACTER_CUSTOMIZATION,
} from './game/types';
import { sound } from './game/audio';
import { trackVibeAppMetric } from '../analytics/tracker';

type GameState = 'title' | 'playing' | 'paused' | 'victory';

const CUSTOMIZATION_STORAGE_KEY = 'crotopia_character_v1';

function loadSavedCustomization(): CharacterCustomization {
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CHARACTER_CUSTOMIZATION, ...JSON.parse(raw) };
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_CHARACTER_CUSTOMIZATION;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Selected tile and landmark for the bottom drawer
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);

  // Map and game state (42x40 = 1,680 tiles, 4x size)
  const [tiles, setTiles] = useState<TileData[]>(() => generateCroatiaMap());
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    const initialRevealed = new Set<string>();
    return {
      x: SPAWN_X,
      z: SPAWN_Z,
      isMoving: false,
      isMounted: false,
      moveRange: 4,
      stars: 50,
      discoveredLandmarks: new Set<string>(['st_marks_church']),
      revealedTiles: initialRevealed,
      activeBuffs: ['Triune Kingdom Civic Anchor'],
      customization: loadSavedCustomization(),
    };
  });

  const canvasMountRef = useRef<HTMLDivElement>(null);
  const worldSceneRef = useRef<WorldScene | null>(null);
  const tilesMapRef = useRef<Map<string, TileData>>(new Map());
  const pressedKeysRef = useRef<Set<string>>(new Set());

  const playerStateRef = useRef(playerState);
  playerStateRef.current = playerState;

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Sync dataset.state with body
  useEffect(() => {
    document.body.dataset.state =
      gameState === 'title'
        ? 'title'
        : gameState === 'paused'
        ? 'paused'
        : gameState === 'victory'
        ? 'gameover'
        : 'playing';
  }, [gameState]);

  // Initial map tiles lookup population
  useEffect(() => {
    const map = new Map<string, TileData>();
    tiles.forEach(t => map.set(getTileKey(t.x, t.z), t));
    tilesMapRef.current = map;
  }, [tiles]);

  // Reveal fog around a position
  const revealAreaAround = useCallback((px: number, pz: number, radius: number = 4) => {
    const { newlyRevealed, updatedRevealed } = revealFogOfWar(
      px,
      pz,
      radius,
      playerStateRef.current.revealedTiles,
      tilesMapRef.current
    );

    if (newlyRevealed.length > 0) {
      setTiles(prev =>
        prev.map(t => {
          const key = getTileKey(t.x, t.z);
          if (updatedRevealed.has(key) && !t.revealed) {
            return { ...t, revealed: true };
          }
          return t;
        })
      );

      const newlyFoundLandmarks: string[] = [];
      newlyRevealed.forEach(key => {
        const tile = tilesMapRef.current.get(key);
        if (tile?.landmarkId && !playerStateRef.current.discoveredLandmarks.has(tile.landmarkId)) {
          newlyFoundLandmarks.push(tile.landmarkId);
        }
      });

      setPlayerState(prev => {
        const nextDiscovered = new Set(prev.discoveredLandmarks);
        newlyFoundLandmarks.forEach(id => nextDiscovered.add(id));
        const addedStars = newlyRevealed.length + newlyFoundLandmarks.length * 25;

        return {
          ...prev,
          stars: prev.stars + addedStars,
          revealedTiles: updatedRevealed,
          discoveredLandmarks: nextDiscovered,
        };
      });

      worldSceneRef.current?.revealTiles(newlyRevealed);

      if (newlyFoundLandmarks.length > 0) {
        sound.playDiscoveryChime();
        trackVibeAppMetric('crotopia', `Crotopia: Discovered ${newlyFoundLandmarks.length} landmark(s)`);
      }
    }
  }, []);

  // Handle player entering a new grid tile during smooth movement
  const handlePlayerEnterTile = useCallback(
    (x: number, z: number) => {
      setPlayerState(prev => ({
        ...prev,
        x,
        z,
      }));

      revealAreaAround(x, z, playerStateRef.current.isMounted ? 6 : 4);

      const currentTile = tilesMapRef.current.get(getTileKey(x, z));
      if (currentTile?.landmarkId) {
        const lm = LANDMARKS[currentTile.landmarkId];
        if (lm && !playerStateRef.current.discoveredLandmarks.has(lm.id)) {
          setPlayerState(p => {
            const d = new Set(p.discoveredLandmarks);
            d.add(lm.id);
            return { ...p, discoveredLandmarks: d, stars: p.stars + 35 };
          });
          sound.playDiscoveryChime();
          trackVibeAppMetric('crotopia', `Crotopia: Discovered ${lm.name}`);
        }
        setSelectedTile(currentTile);
        setSelectedLandmark(lm);
      }

      if (playerStateRef.current.discoveredLandmarks.size >= Object.keys(LANDMARKS).length) {
        setTimeout(() => {
          setGameState('victory');
        }, 600);
      }
    },
    [revealAreaAround]
  );

  // Initialize Three.js scene once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const scene = new WorldScene(canvasMountRef.current, {
      onTileSelect: tile => {
        setSelectedTile(tile);
        const lm = tile.landmarkId ? LANDMARKS[tile.landmarkId] || null : null;
        setSelectedLandmark(lm);

        const currentP = playerStateRef.current;
        const reachable = getReachableTiles(
          currentP.x,
          currentP.z,
          currentP.moveRange,
          tilesMapRef.current
        );
        scene.updateReachableIndicators(reachable);
      },
      onPlayerTileEnter: (x, z) => {
        handlePlayerEnterTile(x, z);
      },
      onMoveComplete: (x, z) => {
        setPlayerState(prev => ({
          ...prev,
          x,
          z,
          isMoving: false,
        }));
        handlePlayerEnterTile(x, z);
      },
    });

    worldSceneRef.current = scene;
    scene.setCharacterCustomization(playerStateRef.current.customization);
    scene.populateMap(tiles, LANDMARKS);

    // Initial reveal at spawn (Zagreb)
    revealAreaAround(SPAWN_X, SPAWN_Z, 5);

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setGameState('playing');
      sound.startAmbient();
    }

    return () => {
      sound.stopAmbient();
      delete document.body.dataset.state;
      scene.dispose();
      worldSceneRef.current = null;
    };
  }, [revealAreaAround, handlePlayerEnterTile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Smoothly walk/ride player to target tile anywhere on map
  const handleMovePlayer = useCallback((targetX: number, targetZ: number) => {
    setPlayerState(prev => ({ ...prev, isMoving: true }));
    worldSceneRef.current?.movePlayerTo(targetX, targetZ);
  }, []);

  // Continuous smooth keyboard navigation (WASD & Arrow keys)
  useEffect(() => {
    const syncKeyboardVector = () => {
      const keys = pressedKeysRef.current;
      let dx = 0;
      let dz = 0;
      if (keys.has('w') || keys.has('arrowup')) dz -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dz += 1;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;

      if (dx !== 0 && dz !== 0) {
        const inv = 1 / Math.SQRT2;
        dx *= inv;
        dz *= inv;
      }

      worldSceneRef.current?.setManualInput(dx, dz);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts if typing in customizer input
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (gameStateRef.current === 'title') {
        if ((e.key === 'Enter' || e.key === ' ') && !isCustomizerOpen) {
          e.preventDefault();
          setGameState('playing');
          sound.startAmbient();
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (isCustomizerOpen) {
          setIsCustomizerOpen(false);
          return;
        }
        if (isCodexOpen) {
          setIsCodexOpen(false);
          return;
        }
        setGameState(prev =>
          prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev
        );
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(sound.toggleMute());
        return;
      }

      if (gameStateRef.current !== 'playing') return;

      const k = e.key.toLowerCase();
      if (
        k === 'w' ||
        k === 'a' ||
        k === 's' ||
        k === 'd' ||
        k === 'arrowup' ||
        k === 'arrowdown' ||
        k === 'arrowleft' ||
        k === 'arrowright'
      ) {
        e.preventDefault();
        pressedKeysRef.current.add(k);
        syncKeyboardVector();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (pressedKeysRef.current.has(k)) {
        pressedKeysRef.current.delete(k);
        syncKeyboardVector();
      }
    };

    const handleBlur = () => {
      if (pressedKeysRef.current.size > 0) {
        pressedKeysRef.current.clear();
        worldSceneRef.current?.setManualInput(0, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isCustomizerOpen, isCodexOpen]);

  // Update character customization & persist
  const handleUpdateCustomization = useCallback((updated: CharacterCustomization) => {
    setPlayerState(prev => ({
      ...prev,
      customization: updated,
    }));
    worldSceneRef.current?.setCharacterCustomization(updated);
    try {
      localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Special landmark interactions
  const handleInteractLandmark = (landmark: LandmarkData) => {
    switch (landmark.id) {
      case 'zadar_sea_organ':
        sound.playSeaOrganChord();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 15,
          activeBuffs: Array.from(
            new Set([...prev.activeBuffs, 'Adriatic Wave Harmony (+100% Joy)'])
          ),
        }));
        break;

      case 'smiljan_tesla_coil':
        sound.playTeslaZap();
        revealAreaAround(landmark.gridX, landmark.gridZ, 9);
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 20,
          activeBuffs: Array.from(new Set([...prev.activeBuffs, 'Tesla Wireless Grid'])),
        }));
        break;

      case 'djakovo_stables': {
        const nextMounted = !playerState.isMounted;
        setPlayerState(prev => ({
          ...prev,
          isMounted: nextMounted,
          moveRange: nextMounted ? 6 : 4,
          stars: prev.stars + 10,
        }));
        worldSceneRef.current?.setMountedState(nextMounted);
        sound.playHop();
        break;
      }

      case 'st_marks_church':
        sound.playCathedralBell();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 10,
        }));
        break;

      case 'vukovar_water_tower':
        sound.playCathedralBell();
        setPlayerState(prev => ({
          ...prev,
          activeBuffs: Array.from(new Set([...prev.activeBuffs, 'Unbreakable Morale Defense'])),
          stars: prev.stars + 25,
        }));
        break;

      case 'plitvice_lakes':
        sound.playDiscoveryChime();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 20,
          activeBuffs: Array.from(new Set([...prev.activeBuffs, 'Travertine Restoration Aura'])),
        }));
        break;

      default:
        sound.playDiscoveryChime();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 10,
        }));
        break;
    }

    worldSceneRef.current?.selectTile(landmark.gridX, landmark.gridZ);
  };

  const handleStartGame = () => {
    setGameState('playing');
    sound.startAmbient();
    trackVibeAppMetric('crotopia', 'Crotopia: Started biome exploration');
  };

  const handleRestart = () => {
    const initialRevealed = new Set<string>();
    const freshTiles = generateCroatiaMap();
    setPlayerState(prev => ({
      x: SPAWN_X,
      z: SPAWN_Z,
      isMoving: false,
      isMounted: false,
      moveRange: 4,
      stars: 50,
      discoveredLandmarks: new Set<string>(['st_marks_church']),
      revealedTiles: initialRevealed,
      activeBuffs: ['Triune Kingdom Civic Anchor'],
      customization: prev.customization,
    }));
    setTiles(freshTiles);
    setSelectedTile(null);
    setSelectedLandmark(null);
    worldSceneRef.current?.populateMap(freshTiles, LANDMARKS);
    worldSceneRef.current?.setPlayerTilePosition(SPAWN_X, SPAWN_Z, false);
    worldSceneRef.current?.setMountedState(false);
    worldSceneRef.current?.recenterOnPlayer();
    revealAreaAround(SPAWN_X, SPAWN_Z, 5);
    setGameState('playing');
  };

  const isReachable = Boolean(
    selectedTile &&
      canMoveTo(
        playerState.x,
        playerState.z,
        selectedTile.x,
        selectedTile.z,
        playerState.moveRange,
        tilesMapRef.current
      )
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Isolated Three.js WebGL Mount */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          customization={playerState.customization}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onStart={handleStartGame}
        />
      )}

      {/* In-Game World HUD */}
      {gameState !== 'title' && (
        <HUD
          playerState={playerState}
          totalLandmarks={Object.keys(LANDMARKS).length}
          tiles={tiles}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(sound.toggleMute())}
          onOpenCodex={() => setIsCodexOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onRecenterPlayer={() => worldSceneRef.current?.recenterOnPlayer()}
          onFocusCamera={(x, z) => worldSceneRef.current?.focusCameraOn(x, z)}
          onAdjustZoom={delta => worldSceneRef.current?.adjustZoom(delta)}
          onJoystickMove={(dx, dz) => worldSceneRef.current?.setManualInput(dx, dz)}
          onPause={() => setGameState('paused')}
        />
      )}

      {/* Polytopia-Style Minimalist Bottom Drawer */}
      {gameState !== 'title' && selectedTile && (
        <BottomDrawer
          selectedTile={selectedTile}
          selectedLandmark={selectedLandmark}
          playerPos={{ x: playerState.x, z: playerState.z }}
          isReachable={isReachable}
          onMoveHere={handleMovePlayer}
          onInteractLandmark={handleInteractLandmark}
          onFocusCamera={(x, z) => worldSceneRef.current?.focusCameraOn(x, z)}
          onClose={() => {
            setSelectedTile(null);
            setSelectedLandmark(null);
          }}
        />
      )}

      {/* Character Customizer Modal (Available from Title Screen and In-Game) */}
      {isCustomizerOpen && (
        <CharacterCustomizerModal
          customization={playerState.customization}
          onChange={handleUpdateCustomization}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}

      {/* Croatian Regional Codex / Travel Encyclopedia Modal */}
      {isCodexOpen && (
        <CodexModal
          discoveredLandmarks={playerState.discoveredLandmarks}
          onClose={() => setIsCodexOpen(false)}
          onSelectLandmark={lm => {
            setSelectedLandmark(lm);
            const tile = tilesMapRef.current.get(getTileKey(lm.gridX, lm.gridZ));
            if (tile) setSelectedTile(tile);
            worldSceneRef.current?.focusCameraOn(lm.gridX, lm.gridZ);
            worldSceneRef.current?.selectTile(lm.gridX, lm.gridZ);
          }}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal onResume={() => setGameState('playing')} onRestart={handleRestart} />
      )}

      {/* Grand Tour Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          playerState={playerState}
          onContinue={() => setGameState('playing')}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
