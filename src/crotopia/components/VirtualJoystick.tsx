import React, { useRef, useState, useCallback } from 'react';

interface VirtualJoystickProps {
  onChange: (dx: number, dz: number) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onChange }) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const pointerIdRef = useRef<number | null>(null);

  const maxRadius = 38;

  const updateVector = useCallback(
    (clientX: number, clientY: number) => {
      if (!baseRef.current) return;
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawX = clientX - centerX;
      const rawY = clientY - centerY;
      const dist = Math.hypot(rawX, rawY);

      const clampedDist = Math.min(dist, maxRadius);
      const angle = Math.atan2(rawY, rawX);
      const kx = Math.cos(angle) * clampedDist;
      const ky = Math.sin(angle) * clampedDist;

      setKnobPos({ x: kx, y: ky });

      // Normalize to [-1, 1] and convert screen joystick vector into isometric world axes
      // In our isometric camera (+X+Z eye looking at origin):
      // Screen Right (+kx) -> (+X, -Z)
      // Screen Down (+ky)  -> (+X, +Z)
      const normX = kx / maxRadius;
      const normY = ky / maxRadius;

      const isoDx = normX * 0.7071 + normY * 0.7071;
      const isoDz = -normX * 0.7071 + normY * 0.7071;

      onChange(isoDx, isoDz);
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    setIsActive(true);
    updateVector(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    updateVector(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    pointerIdRef.current = null;
    setIsActive(false);
    setKnobPos({ x: 0, y: 0 });
    onChange(0, 0);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
      className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 flex items-center justify-center transition-colors pointer-events-auto cursor-pointer select-none shadow-2xl ${
        isActive
          ? 'bg-slate-900/90 border-amber-400/80'
          : 'bg-slate-900/75 border-slate-700/80 hover:border-slate-500'
      }`}
      aria-label="Movement Joystick"
      title="Drag to move Explorer smoothly"
    >
      {/* Subtle Compass Ticks */}
      <span className="absolute top-1.5 text-[9px] font-mono font-bold text-slate-500">▲</span>
      <span className="absolute bottom-1.5 text-[9px] font-mono font-bold text-slate-500">▼</span>
      <span className="absolute left-2 text-[9px] font-mono font-bold text-slate-500">◀</span>
      <span className="absolute right-2 text-[9px] font-mono font-bold text-slate-500">▶</span>

      {/* Thumb Knob */}
      <div
        style={{
          transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`,
        }}
        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg border transition-transform duration-75 ${
          isActive
            ? 'bg-gradient-to-br from-amber-400 to-red-500 border-white text-slate-950 scale-105'
            : 'bg-slate-800 border-slate-600 text-amber-300'
        }`}
      >
        <span className="text-sm font-bold">🧭</span>
      </div>
    </div>
  );
};
