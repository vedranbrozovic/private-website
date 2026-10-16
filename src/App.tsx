import React, { useEffect, useState, useRef } from 'react';
import Matter from 'matter-js';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  ArrowRight, 
  Instagram, 
  Youtube,
  Target,
  Sparkles,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';
import { SocialLink } from './SocialLink';

interface InteractiveItem {
  id: string;
  type: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

const ITEMS: InteractiveItem[] = [
  { id: 'efzg', type: 'efzg', w: 64, h: 48, x: -140, y: -45 },
  { id: 'ikea', type: 'ikea', w: 86, h: 36, x: -50, y: -45 },
  { id: 'ey', type: 'ey', w: 58, h: 42, x: 45, y: -45 },
  { id: 'amazon', type: 'amazon', w: 108, h: 38, x: 135, y: -45 },
  { id: 'acap', type: 'acap', w: 124, h: 44, x: -125, y: 35 },
  { id: 'basketball', type: 'basketball', w: 50, h: 50, x: -20, y: 35 },
  { id: 'reading', type: 'reading', w: 54, h: 54, x: 55, y: 35 },
  { id: 'photography', type: 'photography', w: 50, h: 50, x: 135, y: 35 },
];

type GravityDirection = 'down' | 'up' | 'left' | 'right';

interface DirectionConfig {
  key: GravityDirection;
  label: string;
  icon: React.ElementType;
  vector: { x: number; y: number };
  symbol: string;
}

const DIRECTIONS: DirectionConfig[] = [
  { key: 'down', label: 'Down', icon: ArrowDown, vector: { x: 0, y: 1 }, symbol: '↓' },
  { key: 'up', label: 'Up', icon: ArrowUp, vector: { x: 0, y: -1 }, symbol: '↑' },
  { key: 'left', label: 'Left', icon: ArrowLeft, vector: { x: -1, y: 0 }, symbol: '←' },
  { key: 'right', label: 'Right', icon: ArrowRight, vector: { x: 1, y: 0 }, symbol: '→' },
];

const InteractiveBox = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gravityActive, setGravityActive] = useState(false);
  const [gravityDirection, setGravityDirection] = useState<GravityDirection>('down');
  const [gravityStrength, setGravityStrength] = useState<number>(1.0);
  const [itemScale, setItemScale] = useState<number>(1);

  const gravityActiveRef = useRef(gravityActive);
  const gravityDirRef = useRef(gravityDirection);
  const gravityStrengthRef = useRef(gravityStrength);
  const scaleFactorRef = useRef<number>(1);

  const itemsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<{ [key: string]: Matter.Body }>({});
  const boundariesRef = useRef<Matter.Body[]>([]);

  // Function to apply gravity mode immediately
  const applyGravity = (active: boolean, dir: GravityDirection, strength: number) => {
    gravityActiveRef.current = active;
    gravityDirRef.current = dir;
    gravityStrengthRef.current = strength;

    if (engineRef.current) {
      const dirConfig = DIRECTIONS.find(d => d.key === dir) || DIRECTIONS[0];
      if (active) {
        engineRef.current.world.gravity.x = dirConfig.vector.x * strength;
        engineRef.current.world.gravity.y = dirConfig.vector.y * strength;
        // Wake up bodies and give immediate directional nudge
        Object.values(bodiesRef.current).forEach((body: Matter.Body) => {
          Matter.Sleeping.set(body, false);
          Matter.Body.applyForce(body, body.position, {
            x: dirConfig.vector.x * 0.0025 * strength,
            y: dirConfig.vector.y * 0.0025 * strength
          });
        });
      } else {
        engineRef.current.world.gravity.x = 0;
        engineRef.current.world.gravity.y = 0;
        // Instant float velocity
        Object.values(bodiesRef.current).forEach((body: Matter.Body) => {
          Matter.Sleeping.set(body, false);
          Matter.Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 2.2,
            y: (Math.random() - 0.5) * 2.2
          });
        });
      }
    }
  };

  const handleToggleMode = (mode: 'float' | 'gravity') => {
    const newActive = mode === 'gravity';
    setGravityActive(newActive);
    applyGravity(newActive, gravityDirection, gravityStrength);
  };

  const handleSelectDirection = (dir: GravityDirection) => {
    setGravityDirection(dir);
    setGravityActive(true);
    applyGravity(true, dir, gravityStrength);
  };

  const handleStrengthChange = (val: number) => {
    setGravityStrength(val);
    if (gravityActive) {
      applyGravity(true, gravityDirection, val);
    }
  };

  const resetPositions = () => {
    if (!containerRef.current || !engineRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const scaleFactor = Math.min(1, Math.max(0.65, w / 520));

    ITEMS.forEach(item => {
      const body = bodiesRef.current[item.id];
      if (body) {
        Matter.Sleeping.set(body, false);
        Matter.Body.setPosition(body, {
          x: w / 2 + item.x * scaleFactor,
          y: h / 2 + item.y * scaleFactor
        });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngle(body, 0);
        Matter.Body.setAngularVelocity(body, 0);
      }
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Bodies, Runner, MouseConstraint, Mouse, Composite } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    
    // Set initial gravity
    const initialDir = DIRECTIONS.find(d => d.key === gravityDirRef.current) || DIRECTIONS[0];
    engine.world.gravity.x = gravityActiveRef.current ? initialDir.vector.x * gravityStrengthRef.current : 0;
    engine.world.gravity.y = gravityActiveRef.current ? initialDir.vector.y * gravityStrengthRef.current : 0;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scaleFactor = Math.min(1, Math.max(0.65, width / 520));
    scaleFactorRef.current = scaleFactor;
    const currentItemScale = Math.min(1, Math.max(0.72, width / 480));
    setItemScale(currentItemScale);

    const createBoundaries = (w: number, h: number) => {
      const thickness = 200;
      return [
        Bodies.rectangle(w / 2, h + thickness / 2, w * 2, thickness, { isStatic: true, label: 'ground' }),
        Bodies.rectangle(w / 2, -thickness / 2, w * 2, thickness, { isStatic: true, label: 'ceiling' }),
        Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 2, { isStatic: true, label: 'leftWall' }),
        Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 2, { isStatic: true, label: 'rightWall' })
      ];
    };

    const boundaries = createBoundaries(width, height);
    boundariesRef.current = boundaries;
    Composite.add(engine.world, boundaries);

    ITEMS.forEach(item => {
      const body = Bodies.rectangle(
        width / 2 + item.x * scaleFactor,
        height / 2 + item.y * scaleFactor,
        item.w * currentItemScale,
        item.h * currentItemScale,
        {
          restitution: 0.65,
          friction: 0.1,
          frictionAir: 0.035,
          density: 0.001
        }
      );
      bodiesRef.current[item.id] = body;
      Composite.add(engine.world, body);
    });

    const mouse = Mouse.create(containerRef.current);
    // Remove scroll-wheel traps
    // @ts-ignore
    mouse.element.removeEventListener?.("mousewheel", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener?.("DOMMouseScroll", mouse.mousewheel);

    // Remove default Matter touch handlers so mobile browsers can scroll freely
    // @ts-ignore
    mouse.element.removeEventListener?.("touchstart", mouse.mousedown);
    // @ts-ignore
    mouse.element.removeEventListener?.("touchmove", mouse.mousemove);
    // @ts-ignore
    mouse.element.removeEventListener?.("touchend", mouse.mouseup);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // Smart touch interaction: if touching a body, drag it. If touching empty space, let user scroll the page smoothly!
    let activeTouchId: number | null = null;
    let isDraggingBody = false;

    const getTouchCoords = (touch: Touch) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const coords = getTouchCoords(touch);

      const allBodies = Object.values(bodiesRef.current);
      const hits = Matter.Query.point(allBodies, coords);

      if (hits.length > 0) {
        // Touched an interactive item: engage drag & prevent page scroll
        isDraggingBody = true;
        activeTouchId = touch.identifier;
        mouse.position.x = coords.x;
        mouse.position.y = coords.y;
        mouse.button = 0;
        Matter.Sleeping.set(hits[0], false);
        if (e.cancelable) {
          e.preventDefault();
        }
      } else {
        // Touched background: allow native browser page scrolling!
        isDraggingBody = false;
        activeTouchId = null;
        mouse.button = -1;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingBody || activeTouchId === null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouchId) {
          const coords = getTouchCoords(touch);
          mouse.position.x = coords.x;
          mouse.position.y = coords.y;
          if (e.cancelable) {
            e.preventDefault();
          }
          break;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (activeTouchId !== null) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === activeTouchId) {
            mouse.button = -1;
            isDraggingBody = false;
            activeTouchId = null;
            break;
          }
        }
      }
    };

    const containerEl = containerRef.current;
    containerEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    containerEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    containerEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    containerEl.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !engineRef.current || !containerRef.current) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      if (newW === 0 || newH === 0) return;

      const newScaleFactor = Math.min(1, Math.max(0.65, newW / 520));
      scaleFactorRef.current = newScaleFactor;
      const newScale = Math.min(1, Math.max(0.72, newW / 480));
      setItemScale(newScale);

      Composite.remove(engineRef.current.world, boundariesRef.current);
      const newBoundaries = createBoundaries(newW, newH);
      boundariesRef.current = newBoundaries;
      Composite.add(engineRef.current.world, newBoundaries);
    });
    resizeObserver.observe(containerRef.current);

    const runner = Runner.create();
    Runner.run(runner, engine);

    let animationId: number;
    const update = () => {
      if (engineRef.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        const currentScale = scaleFactorRef.current;

        if (!gravityActiveRef.current) {
          const time = Date.now() * 0.001;
          ITEMS.forEach((item, idx) => {
            const body = bodiesRef.current[item.id];
            if (body) {
              const forceMagnitude = 0.00003;
              Matter.Body.applyForce(body, body.position, {
                x: Math.sin(time + idx * 1.2) * forceMagnitude,
                y: Math.cos(time * 0.8 + idx * 1.5) * forceMagnitude
              });

              const targetX = w / 2 + item.x * currentScale;
              const targetY = h / 2 + item.y * currentScale;
              const dx = targetX - body.position.x;
              const dy = targetY - body.position.y;
              Matter.Body.applyForce(body, body.position, {
                x: dx * 0.000004,
                y: dy * 0.000004
              });
            }
          });
        }

        ITEMS.forEach(item => {
          const body = bodiesRef.current[item.id];
          const element = itemsRef.current[item.id];
          if (body && element) {
            const x = body.position.x - w / 2;
            const y = body.position.y - h / 2;
            element.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
          }
        });
      }
      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      containerEl.removeEventListener('touchstart', handleTouchStart);
      containerEl.removeEventListener('touchmove', handleTouchMove);
      containerEl.removeEventListener('touchend', handleTouchEnd);
      containerEl.removeEventListener('touchcancel', handleTouchEnd);
      Runner.stop(runner);
      Engine.clear(engine);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  const activeDirObj = DIRECTIONS.find(d => d.key === gravityDirection) || DIRECTIONS[0];

  return (
    <div className="relative group my-5 sm:my-6 select-none">
      <div
        ref={containerRef}
        style={{ touchAction: 'pan-y' }}
        className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#1f242e]/10 bg-white/75 backdrop-blur-xs shadow-xs flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Subtle dot pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#20242c 0.75px, transparent 0.75px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Status header on top: Section title + Real-time Gravity/Float status */}
        <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3.5 pointer-events-none flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span 
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 transition-colors duration-300 ${
                gravityActive 
                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' 
                  : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse'
              }`} 
            />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[#555f6f] truncate">
              Background & hobbies <span className="text-[#8c94a4] font-normal hidden sm:inline">· Drag & toss</span>
            </span>
          </div>

          {/* Status badge on top showing whether float or gravity is on */}
          <div className="pointer-events-auto shrink-0">
            <div 
              className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide flex items-center gap-1 sm:gap-1.5 backdrop-blur-md border shadow-2xs transition-all duration-300 ${
                gravityActive
                  ? 'bg-amber-50/95 text-amber-900 border-amber-300/80 shadow-amber-500/10'
                  : 'bg-emerald-50/95 text-emerald-900 border-emerald-300/80 shadow-emerald-500/10'
              }`}
            >
              <span 
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  gravityActive ? 'bg-amber-600' : 'bg-emerald-600'
                }`} 
              />
              <span className="font-semibold whitespace-nowrap">
                {gravityActive ? `Gravity (${activeDirObj.symbol} ${gravityStrength.toFixed(1)}x)` : 'Float Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Floating / Physics items */}
        <div className="relative w-full h-full pointer-events-none">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              ref={(el) => { itemsRef.current[item.id] = el; }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ 
                width: item.w * itemScale, 
                height: item.h * itemScale,
                transform: `translate(${item.x}px, ${item.y}px)` 
              }}
            >
              <div className="w-full h-full flex items-center justify-center filter drop-shadow-sm transition-opacity hover:opacity-95">
                {item.type === 'efzg' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#460F40]">
                    <path d="M 5 20 H 95 V 36 H 54 Q 50 36 50 42 Q 50 36 46 36 H 5 Z" fill="currentColor" />
                    <path d="M 25 48 H 80 V 64 H 54 Q 50 64 50 70 Q 50 64 46 64 H 25 Z" fill="currentColor" />
                    <path d="M 5 76 H 68 V 92 H 54 Q 50 92 50 98 Q 50 92 46 92 H 5 Z" fill="currentColor" />
                  </svg>
                )}

                {item.type === 'ikea' && (
                  <svg viewBox="0 0 120 50" className="w-full h-full">
                    <rect x="0" y="0" width="120" height="50" rx="4" fill="#0051BA" />
                    <ellipse cx="60" cy="25" rx="55" ry="22" fill="#FFCC00" />
                    <text x="60" y="36.5" fontFamily="Verdana, Geneva, sans-serif" fontWeight="900" fontSize="33" fontStyle="italic" fill="#0051BA" textAnchor="middle" letterSpacing="-1.5">IKEA</text>
                  </svg>
                )}

                {item.type === 'ey' && (
                  <svg viewBox="0 0 80 50" className="w-full h-full text-[#1c1c1c]">
                    <text x="0" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="48" fill="currentColor" letterSpacing="-4">EY</text>
                    <polygon points="61,42 66,16 76,16" fill="#FFE600" /> 
                  </svg>
                )}

                {item.type === 'amazon' && (
                  <svg viewBox="0 0 130 50" className="w-full h-full text-[#1c1c1c] overflow-visible">
                    <text x="0" y="30" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="36" letterSpacing="-1.5" fill="currentColor">amazon</text>
                    <path d="M 12 36 Q 50 51 106 34" fill="none" stroke="#FF9900" strokeWidth="3.5" strokeLinecap="round"/>
                    <polygon points="106,34 100,29 96,35" fill="#FF9900"/>
                  </svg>
                )}

                {item.type === 'acap' && (
                  <svg viewBox="0 0 180 50" className="w-full h-full text-[#E31D3B] overflow-visible">
                    <text x="0" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="48" letterSpacing="-3.5" fill="currentColor">A</text>
                    <g transform="translate(36, 12)">
                      <rect x="0" y="0" width="10" height="9" fill="currentColor" />
                      <rect x="0" y="10" width="10" height="10" fill="transparent" />
                      <rect x="0" y="21" width="10" height="9" fill="currentColor" />
                      <rect x="11" y="0" width="10" height="9" fill="transparent" />
                      <rect x="11" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="11" y="21" width="10" height="9" fill="transparent" />
                    </g>
                    <path d="M 85,12 A 16,15 0 1,0 85,42" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square" />
                    <text x="88" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="48" letterSpacing="-3.5" fill="currentColor">AP</text>
                  </svg>
                )}

                {item.type === 'basketball' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
                    <defs>
                      <radialGradient id="ballGlowNew" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="70%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="46" fill="url(#ballGlowNew)" />
                    <g fill="none" stroke="#431407" strokeWidth="3" className="opacity-90">
                      <circle cx="50" cy="50" r="46" />
                      <path d="M 50 4 Q 52 50 50 96" />
                      <path d="M 4 50 Q 50 52 96 50" />
                      <path d="M 17 21 C 45 40, 45 60, 17 79" />
                      <path d="M 83 21 C 55 40, 55 60, 83 79" />
                    </g>
                  </svg>
                )}

                {item.type === 'reading' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
                    <g transform="rotate(-5 50 50)">
                      <path d="M 10 80 L 10 20 C 30 15 45 20 50 25 C 55 20 70 15 90 20 L 90 80 C 70 75 55 80 50 85 C 45 80 30 75 10 80 Z" fill="#64748b" />
                      <path d="M 12 78 L 12 22 C 30 18 45 22 50 27 L 50 83 C 45 78 30 74 12 78 Z" fill="#f8fafc" />
                      <path d="M 88 78 L 88 22 C 70 18 55 22 50 27 L 50 83 C 55 78 70 74 88 78 Z" fill="#e2e8f0" />
                      <g stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="20" y1="35" x2="40" y2="38" />
                        <line x1="20" y1="45" x2="42" y2="48" />
                        <line x1="20" y1="55" x2="35" y2="57" />
                        <line x1="60" y1="38" x2="80" y2="35" />
                        <line x1="58" y1="48" x2="75" y2="45" />
                      </g>
                    </g>
                    <g transform="translate(68, 48) rotate(-35)">
                      <rect x="-4" y="-20" width="8" height="40" rx="1" fill="#fcd34d" />
                      <polygon points="-4,20 4,20 0,30" fill="#e4e4e7" />
                      <polygon points="-1.5,26 1.5,26 0,30" fill="#1f2937" />
                      <rect x="-4" y="-25" width="8" height="5" fill="#f87171" rx="1" />
                    </g>
                  </svg>
                )}

                {item.type === 'photography' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#4b5563] drop-shadow-xs">
                    <rect x="10" y="32" width="80" height="52" rx="8" fill="currentColor" />
                    <path d="M 28 32 L 35 20 L 65 20 L 72 32 Z" fill="currentColor" className="opacity-80"/>
                    <circle cx="22" cy="45" r="4.5" fill="#fcd34d" />
                    <circle cx="80" cy="42" r="3" fill="#000" className="opacity-20" />
                    <circle cx="50" cy="58" r="18" fill="#1f2937" />
                    <circle cx="50" cy="58" r="9" fill="#9ca3af" />
                    <circle cx="47" cy="54" r="2.5" fill="#fff" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Minimalist Controls Toolbar at the bottom */}
        <div 
          className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-3 pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 bg-white/92 backdrop-blur-md px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#20242c]/10 shadow-xs"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Left: Mode Switch (Float vs Gravity) + Reset Button */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Segmented Float / Gravity Switch */}
            <div className="flex items-center p-0.5 bg-[#f0f2f5] rounded-lg border border-[#20242c]/5">
              <button
                type="button"
                onClick={() => handleToggleMode('float')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-all ${
                  !gravityActive
                    ? 'bg-white text-[#1c2229] shadow-2xs font-semibold'
                    : 'text-[#64748b] hover:text-[#1c2229]'
                }`}
                title="Press for Float Mode"
              >
                <Sparkles size={11} className={!gravityActive ? 'text-emerald-600' : ''} />
                <span>Float</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleMode('gravity')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-all ${
                  gravityActive
                    ? 'bg-[#20242c] text-[#faf9f6] shadow-2xs font-semibold'
                    : 'text-[#64748b] hover:text-[#1c2229]'
                }`}
                title="Press for Gravity Mode"
              >
                <Target size={11} className={gravityActive ? 'text-amber-400' : ''} />
                <span>Gravity</span>
              </button>
            </div>

            {/* Reset button */}
            <button
              type="button"
              onClick={resetPositions}
              className="p-1 sm:p-1.5 rounded-lg text-[#64748b] hover:text-[#1c2229] hover:bg-[#f0f2f5] transition-colors border border-transparent hover:border-[#20242c]/10"
              title="Reset positions"
              aria-label="Reset positions"
            >
              <RotateCcw size={12} strokeWidth={2} />
            </button>
          </div>

          {/* Right: Direction switcher and Strength slider */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Minimalist Direction Switch */}
            <div className="flex items-center gap-0.5 bg-[#f0f2f5] p-0.5 rounded-lg border border-[#20242c]/5">
              {DIRECTIONS.map((dir) => {
                const Icon = dir.icon;
                const isSelected = gravityActive && gravityDirection === dir.key;
                return (
                  <button
                    key={dir.key}
                    type="button"
                    onClick={() => handleSelectDirection(dir.key)}
                    className={`p-1 sm:p-1.5 rounded-md transition-all ${
                      isSelected
                        ? 'bg-[#20242c] text-[#faf9f6] shadow-2xs scale-105'
                        : 'text-[#64748b] hover:text-[#1c2229] hover:bg-white/70'
                    }`}
                    title={`Pull gravity ${dir.label} (${dir.symbol})`}
                    aria-label={`Pull gravity ${dir.label}`}
                  >
                    <Icon size={11} strokeWidth={2.2} />
                  </button>
                );
              })}
            </div>

            {/* Strength slider */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-[#555f6f]">
              <span className="hidden sm:inline text-[10px] uppercase font-medium tracking-wider text-[#8c94a4]">Pull</span>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={gravityStrength}
                onChange={(e) => handleStrengthChange(parseFloat(e.target.value))}
                className="w-10 sm:w-16 h-1 bg-[#d5dae2] rounded-lg appearance-none cursor-pointer accent-[#20242c]"
                title={`Gravity Strength: ${gravityStrength.toFixed(1)}x`}
                aria-label="Gravity strength"
              />
              <span className="text-[10px] font-mono text-[#1c2229] w-5 sm:w-6 text-right font-medium">
                {gravityStrength.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReadingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      window.history.pushState({}, '', '/reading');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleVibecodingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      window.history.pushState({}, '', '/vibecoding');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#Faf9f6] text-[#20242c] font-sans flex flex-col justify-start px-4 sm:px-6 pt-8 sm:pt-14 pb-14 sm:pb-16 selection:bg-[#20242c] selection:text-[#Faf9f6]">
      <main 
        className={`w-full max-w-xl mx-auto transition-all duration-700 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      >
        <header className="mb-5 sm:mb-6">
          <h1 className="text-3xl sm:text-[34px] font-light tracking-tight text-[#1c2229] mb-1.5 font-sans">
            Vedran Brozović
          </h1>
          <p className="text-[#555f6f] text-sm sm:text-[15px] font-normal tracking-wide font-sans">
            PM @ Amazon | Board @ ACAP
          </p>
        </header>

        {/* Background & Hobbies Interactive Box */}
        <InteractiveBox />

        <section className="mb-10 space-y-4 text-[#374151] leading-relaxed text-[15px] sm:text-[16px] font-normal">
          <p>
            I'm an AI and Data Product Manager with 6+ years of experience scaling enterprise GenAI and analytics products at Amazon, defining the vision, setting multi-year roadmaps and leading high-ambiguity products from 0 to 1. My AI work was the first featured story of Amazon's <em className="italic font-normal">rAIsing the Bar</em> series and was discussed on the{' '}
            <a 
              href="https://open.spotify.com/episode/1MThk2sP927U64eeRbBIE0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              <em className="italic font-normal">strAIght talk</em> podcast
            </a>
            . My career took me from Croatia via Luxembourg to the United States, and from finance via engineering to product. Earlier, I worked in consulting at Ernst &amp; Young, business analytics at IKEA, and econometric modeling at the Croatian National Bank.
          </p>

          <p>
            Born and raised in Zagreb, I earned my MSc in Economics and Managerial Informatics from the University of Zagreb, with research on{' '}
            <a 
              href="https://repozitorij.efzg.unizg.hr/en/object/efzg:2726" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              artificial intelligence
            </a>
            ,{' '}
            <a 
              href="https://repozitorij.efzg.unizg.hr/en/object/efzg:5862" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              advanced analytics
            </a>{' '}
            and the{' '}
            <a 
              href="https://apps.unizg.hr/rektorova-nagrada/javno/radovi/298/preuzmi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              sharing economy
            </a>
            , recognized with two Rector's and two Dean's Awards. Today I mentor early-stage founders through{' '}
            <a 
              href="https://nuqleus.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              Nuqleus
            </a>{' '}
            and the{' '}
            <a 
              href="https://www.egcnyc.org/programs/scale-2-0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              Infobip Startup Tribe
            </a>
            . Outside the office, I'm a former Croatian junior national basketball champion who later played in Luxembourg's top division.
          </p>

          <p>
            I'm also a Director at the{' '}
            <a 
              href="https://croampro.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              Association of Croatian-American Professionals (ACAP)
            </a>
            , where I chair the Technology and Innovation Committee. I previously led the Pacific Northwest chapter and chaired the{' '}
            <a 
              href="https://conference.croampro.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              10th Annual ACAP Conference
            </a>{' '}
            in Seattle.
          </p>

          <p>
            Outside of work, I love{' '}
            <a 
              href="/reading" 
              onClick={handleReadingClick}
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              reading
            </a>
            ,{' '}
            <a 
              href="https://www.youtube.com/shorts/9izlIisXmcA" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              playing basketball
            </a>
            , riding my motorcycle,{' '}
            <a 
              href="https://www.youtube.com/shorts/epX53oBfZ5s" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              exercising
            </a>
            ,{' '}
            <a 
              href="https://www.youtube.com/shorts/CgKeP-biekc" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              riding ferries
            </a>{' '}
            around Puget Sound, and{' '}
            <a 
              href="https://www.instagram.com/stories/highlights/18126152053478952/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              traveling
            </a>
            . Lately, I've also been having fun{' '}
            <a 
              href="https://www.youtube.com/watch?v=zsYeshucbHE" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              creating music with AI
            </a>{' '}
            and{' '}
            <a 
              href="/vibecoding" 
              onClick={handleVibecodingClick}
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              vibe coding apps
            </a>
            .
          </p>

          <p>
            Learn more about me in{' '}
            <a 
              href="https://www.youtube.com/watch?v=D06qaNG_qWs&t=187s" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              English
            </a>{' '}
            or{' '}
            <a 
              href="https://www.youtube.com/watch?v=0WG-pwNJxKM&t=1264s" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] transition-colors"
            >
              Croatian
            </a>
            .
          </p>
        </section>

        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 border-t border-[#e2e5eb] pt-7">
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
          
          <a 
            href="/old" 
            className="flex items-center gap-1.5 text-xs text-[#717b8c] hover:text-[#1c2229] transition-colors group py-1"
          >
            <span>View previous version</span>
            <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
          </a>
        </footer>
      </main>
    </div>
  );
};

export default App;

