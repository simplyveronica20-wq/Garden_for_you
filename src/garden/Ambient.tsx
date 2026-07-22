// ============================================================
//  Ambient particles — sparkles, fireflies, butterflies, petals
//  ------------------------------------------------------------
//  Purely decorative, lightweight, CSS-animated.
// ============================================================

import { useEffect, useMemo, useState } from 'react';

// ---------- Fairy dust sparkles (always drifting) ----------
export function FairyDust({ count = 24 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 12,
        size: 2 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 80,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: `${m.left}%`,
              bottom: '-10px',
              width: m.size,
              height: m.size,
              background: 'radial-gradient(circle, #fff5d0 0%, rgba(255,245,208,0) 70%)',
              animation: `float-up ${m.duration}s linear ${m.delay}s infinite`,
              '--drift': `${m.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// ---------- Twinkling stars (background) ----------
export function Stars({ count = 40 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 55,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        size: 1 + Math.random() * 2.5,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cream"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: '0 0 4px rgba(255,245,208,0.8)',
          }}
        />
      ))}
    </div>
  );
}

// ---------- Drifting fireflies (clickable for easter egg) ----------
export function Fireflies({
  count = 5,
  onClick,
}: {
  count?: number;
  onClick?: (id: number) => void;
}) {
  const [flies, setFlies] = useState<{ id: number; left: number; top: number; fx: number; fy: number; dur: number; delay: number }[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      top: Math.random() * 70 + 15,
      fx: (Math.random() - 0.5) * 300,
      fy: -(Math.random() * 200 + 100),
      dur: 8 + Math.random() * 6,
      delay: Math.random() * 6,
    }));
    setFlies(initial);
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {flies.map((f) => (
        <button
          key={f.id}
          aria-label="a firefly"
          className="pointer-events-auto absolute"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              animation: `float-firefly ${f.dur}s ease-in-out ${f.delay}s infinite`,
              '--fx': `${f.fx}px`,
              '--fy': `${f.fy}px`,
            } as React.CSSProperties
          }
          onClick={() => onClick?.(f.id)}
        >
          <span
            className="block rounded-full"
            style={{
              width: 8,
              height: 8,
              background: 'radial-gradient(circle, #fff5d0 0%, #f5d76e 50%, rgba(245,215,110,0) 80%)',
              boxShadow: '0 0 12px 4px rgba(255,245,208,0.7)',
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ---------- Butterfly fluttering across the screen ----------
export function Butterfly({ color = '#f6c6d4', delay = 0 }: { color?: string; delay?: number }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: '-10vw',
        top: `${20 + Math.random() * 40}%`,
        animation: `butterfly-flutter 18s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg width="36" height="30" viewBox="0 0 36 30" className="no-select">
        <g style={{ transformOrigin: '18px 15px', animation: `wing-flap 0.25s ease-in-out infinite` }}>
          <ellipse cx="10" cy="10" rx="9" ry="7" fill={color} opacity="0.85" />
          <ellipse cx="10" cy="20" rx="7" ry="5" fill={color} opacity="0.75" />
          <ellipse cx="26" cy="10" rx="9" ry="7" fill={color} opacity="0.85" />
          <ellipse cx="26" cy="20" rx="7" ry="5" fill={color} opacity="0.75" />
        </g>
        <rect x="17" y="8" width="2" height="14" rx="1" fill="#5a4a2e" />
      </svg>
    </div>
  );
}

// ---------- Petal firework (celebration) ----------
export function PetalFirework({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        px: Math.cos((i / 12) * Math.PI * 2) * (60 + Math.random() * 40),
        py: Math.sin((i / 12) * Math.PI * 2) * (60 + Math.random() * 40) - 40,
        pr: Math.random() * 360,
        color: ['#f6c6d4', '#f5d76e', '#c9b6e4', '#fbd5e0'][i % 4],
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-full"
          style={
            {
              width: 8,
              height: 12,
              background: p.color,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: `petal-firework 2s ease-out ${delay}s forwards`,
              '--px': `${p.px}px`,
              '--py': `${p.py}px`,
              '--pr': `${p.pr}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
