// ============================================================
//  Flower — hand-drawn SVG flowers with bloom animation
//  ------------------------------------------------------------
//  Each flower type is drawn with layered gradients and soft
//  organic shapes for a realistic, storybook look.
//  Bloom states: 'bud' | 'blooming' | 'bloomed' | 'locked'
// ============================================================

import { useEffect, useState } from 'react';
import type { FlowerType } from './flowers';
import { FLOWER_PHOTOS } from './flowers';

export type BloomState = 'bud' | 'blooming' | 'bloomed' | 'locked';

interface FlowerProps {
  type: FlowerType;
  state: BloomState;
  rare?: boolean;
  size?: number;
  /** index used to stagger petal unfurl timing */
  index?: number;
}

// Rich palettes with multiple shades for realistic depth
interface Palette {
  petalLight: string;
  petal: string;
  petalDark: string;
  center: string;
  centerDark: string;
}

const PALETTES: Record<FlowerType, Palette> = {
  rose: { petalLight: '#fde0e6', petal: '#f6c6d4', petalDark: '#d8789a', center: '#f3d77a', centerDark: '#c99a2e' },
  daisy: { petalLight: '#ffffff', petal: '#fbf3e4', petalDark: '#d4c290', center: '#f5c74e', centerDark: '#a8761e' },
  tulip: { petalLight: '#f4b8c8', petal: '#e89aa9', petalDark: '#b85a76', center: '#7a5a3e', centerDark: '#4a3a24' },
  sunflower: { petalLight: '#ffe88a', petal: '#f5d76e', petalDark: '#c9982e', center: '#7a5a2e', centerDark: '#3a2a14' },
  lily: { petalLight: '#e0d4f0', petal: '#c9b6e4', petalDark: '#7d5fa7', center: '#f5c74e', centerDark: '#a8761e' },
  cherry: { petalLight: '#fde8ef', petal: '#fbd5e0', petalDark: '#e898b0', center: '#f5c74e', centerDark: '#a8761e' },
  poppy: { petalLight: '#f6b0ae', petal: '#f0918f', petalDark: '#b8484a', center: '#3a2a1c', centerDark: '#1a1208' },
};

const RARE_PALETTE: Palette = {
  petalLight: '#fff5c8',
  petal: '#f5d76e',
  petalDark: '#c9982e',
  center: '#a23b3b',
  centerDark: '#5a1a1a',
};

let gradId = 0;
function nextId() {
  gradId += 1;
  return `fg${gradId}`;
}

export function Flower({ type, state, rare, size = 80, index = 0 }: FlowerProps) {
  const palette = rare ? RARE_PALETTE : PALETTES[type];
  const [petalsUnfurled, setPetalsUnfurled] = useState(state === 'bloomed');
  const [ids] = useState(() => ({
    petal: nextId(),
    center: nextId(),
    stem: nextId(),
    leaf: nextId(),
    bud: nextId(),
  }));

  useEffect(() => {
    if (state === 'blooming') {
      setPetalsUnfurled(false);
      const t = setTimeout(() => setPetalsUnfurled(true), 60);
      return () => clearTimeout(t);
    }
    if (state === 'bloomed') setPetalsUnfurled(true);
  }, [state]);

  const isBlooming = state === 'blooming';
  const isBloomed = state === 'bloomed' || petalsUnfurled;

  // Both bud and bloomed states will share the same SVG wrapper so the stem and leaf 
  // stay grounded, and gradients are always defined.
  return (
    <div
      className={`no-select ${rare ? 'anim-glow' : ''}`}
      style={{
        position: 'relative',
        width: size,
        height: size,
        transformOrigin: '50% 100%',
        animation: isBloomed
          ? `${rare ? 'breathe 4s ease-in-out infinite' : 'sway 5s ease-in-out infinite'}`
          : state === 'locked'
          ? 'bud-shake 2.5s ease-in-out infinite'
          : 'none',
        animationDelay: `${index * 0.3}s`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: rare
            ? 'drop-shadow(0 0 12px rgba(245,215,110,0.85)) saturate(1.2)'
            : 'drop-shadow(0 4px 8px rgba(36,24,68,0.25)) saturate(1.1)',
        }}
      >
        <defs>
          <linearGradient id={ids.stem} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5a8a48" />
            <stop offset="50%" stopColor="#7eb86a" />
            <stop offset="100%" stopColor="#4a7a3a" />
          </linearGradient>
          <linearGradient id={ids.leaf} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9fd08a" />
            <stop offset="100%" stopColor="#5a8a48" />
          </linearGradient>
          <radialGradient id={ids.bud} cx="0.4" cy="0.35">
            <stop offset="0%" stopColor={palette.petalLight} />
            <stop offset="60%" stopColor={palette.petal} />
            <stop offset="100%" stopColor={palette.petalDark} />
          </radialGradient>
          <radialGradient id={ids.petal} cx="0.5" cy="0.9">
            <stop offset="0%" stopColor={palette.center} />
            <stop offset="40%" stopColor={palette.petalDark} />
            <stop offset="100%" stopColor={palette.petalLight} />
          </radialGradient>
          <radialGradient id={ids.center} cx="0.4" cy="0.4">
            <stop offset="0%" stopColor={palette.center} />
            <stop offset="100%" stopColor={palette.centerDark} />
          </radialGradient>
        </defs>

        {/* stem */}
        <path
          d="M50 100 Q48 80 50 60"
          stroke={`url(#${ids.stem})`}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* leaf */}
        <path
          d="M50 78 Q38 70 32 80 Q40 86 50 82 Z"
          fill={`url(#${ids.leaf})`}
          stroke="#4a7a3a"
          strokeWidth="0.5"
        />
        <path d="M50 80 Q40 76 34 80" stroke="#4a7a3a" strokeWidth="0.5" fill="none" opacity="0.5" />

        {(state === 'bud' || state === 'locked') ? (
          <g style={{ transformOrigin: '50px 52px' }}>
            <path
              d="M50 32 Q38 44 50 60 Q62 44 50 32"
              fill={`url(#${ids.bud})`}
              stroke={palette.petalDark}
              strokeWidth="0.8"
            />
            <path
              d="M50 34 Q44 46 50 58"
              stroke={palette.petalDark}
              strokeWidth="0.6"
              fill="none"
              opacity="0.5"
            />
            {/* sepals (green base) */}
            <path d="M50 58 Q44 56 42 62 Q50 64 50 60" fill="#6f9c63" opacity="0.85" />
            <path d="M50 58 Q56 56 58 62 Q50 64 50 60" fill="#5a8a48" opacity="0.85" />
            {state === 'locked' && (
              <circle cx="50" cy="48" r="5" fill="#f5d76e" opacity="0.55" className="anim-shimmer" />
            )}
          </g>
        ) : (
          <>
            {/* sepals underneath the bloomed flower */}
            <path d="M50 58 Q44 56 42 62 Q50 64 50 60" fill="#6f9c63" opacity="0.85" />
            <path d="M50 58 Q56 56 58 62 Q50 64 50 60" fill="#5a8a48" opacity="0.85" />
            <FlowerHead
              type={type}
              palette={palette}
              unfurled={petalsUnfurled}
              rare={rare}
              index={index}
              ids={ids}
            />
          </>
        )}
      </svg>

      {/* bloom sparkle burst during blooming */}
      {isBlooming && (
        <svg
          viewBox="0 0 100 100"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          <g style={{ transformOrigin: '50px 50px' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="2"
                fill="#fff5d0"
                style={{
                  transformOrigin: '50px 50px',
                  animation: `sparkle-burst 0.9s ease-out ${i * 0.04}s forwards`,
                  transform: `rotate(${deg}deg) translateX(20px)`,
                }}
              />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}

function FlowerHead({
  type,
  palette,
  unfurled,
  rare,
  index,
  ids,
}: {
  type: FlowerType;
  palette: Palette;
  unfurled: boolean;
  rare?: boolean;
  index: number;
  ids: { petal: string; center: string };
}) {
  const petalCount = type === 'daisy' || type === 'sunflower' ? 12 : type === 'cherry' ? 5 : 6;

  return (
    <g style={{ transformOrigin: '50px 45px' }}>
      {/* back layer of petals (offset) for depth on multi-petal flowers */}
      {(type === 'daisy' || type === 'sunflower') && (
        <g>
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (360 / petalCount) * i + (360 / petalCount / 2);
            return (
              <Petal
                key={`back-${i}`}
                type={type}
                palette={palette}
                gradId={ids.petal}
                angle={angle}
                unfurled={unfurled}
                delay={unfurled ? 0 : i * 0.06}
                rare={rare}
                back
              />
            );
          })}
        </g>
      )}

      {/* front petals */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (360 / petalCount) * i;
        const delay = unfurled ? 0 : i * 0.08;
        return (
          <Petal
            key={`front-${i}`}
            type={type}
            palette={palette}
            gradId={ids.petal}
            angle={angle}
            unfurled={unfurled}
            delay={delay}
            rare={rare}
          />
        );
      })}

      {/* center */}
      <Center type={type} palette={palette} gradId={ids.center} unfurled={unfurled} petalCount={petalCount} />

      {rare && (
        <circle
          cx="50"
          cy="45"
          r="15"
          fill="none"
          stroke="#fff5d0"
          strokeWidth="1.5"
          opacity="0.6"
          className="anim-shimmer"
        />
      )}
      {/* index used to keep React keys stable; referenced to avoid lint */}
      <g data-index={index} />
    </g>
  );
}

function Center({
  type,
  palette,
  gradId,
  unfurled,
  petalCount,
}: {
  type: FlowerType;
  palette: Palette;
  gradId: string;
  unfurled: boolean;
  petalCount: number;
}) {
  const r = type === 'sunflower' ? 10 : type === 'daisy' ? 8 : type === 'rose' || type === 'poppy' ? 7 : 5;
  const delay = petalCount * 0.08 + 0.1;

  return (
    <g
      style={{
        transformOrigin: '50px 45px',
        animation: unfurled ? 'none' : `petal-unfurl 0.5s ease ${delay}s forwards`,
        transform: unfurled ? 'scale(1)' : 'scale(0)',
        opacity: unfurled ? 1 : 0,
      }}
    >
      <circle cx="50" cy="45" r={r} fill={`url(#${gradId})`} />

      {/* texture details per flower type */}
      {type === 'sunflower' && (
        <>
          <circle cx="50" cy="45" r={r} fill="none" stroke={palette.centerDark} strokeWidth="0.8" opacity="0.5" />
          {/* seed dots */}
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const rr = r * 0.6;
            return (
              <circle
                key={i}
                cx={50 + Math.cos(a) * rr}
                cy={45 + Math.sin(a) * rr}
                r="1"
                fill={palette.centerDark}
                opacity="0.7"
              />
            );
          })}
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * Math.PI * 2;
            const rr = r * 0.25;
            return (
              <circle
                key={`c-${i}`}
                cx={50 + Math.cos(a) * rr}
                cy={45 + Math.sin(a) * rr}
                r="1"
                fill={palette.centerDark}
                opacity="0.7"
              />
            );
          })}
        </>
      )}

      {type === 'daisy' && (
        <>
          <circle cx="50" cy="45" r={r} fill="none" stroke={palette.centerDark} strokeWidth="0.6" opacity="0.4" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const rr = r * 0.5;
            return (
              <circle
                key={i}
                cx={50 + Math.cos(a) * rr}
                cy={45 + Math.sin(a) * rr}
                r="0.8"
                fill={palette.centerDark}
                opacity="0.5"
              />
            );
          })}
        </>
      )}

      {(type === 'rose' || type === 'poppy') && (
        <>
          {/* inner spiral petals for rose */}
          <path
            d="M50 40 Q46 45 50 50 Q54 45 50 40"
            fill={palette.petalDark}
            opacity="0.4"
          />
          <circle cx="50" cy="45" r="2" fill={palette.centerDark} opacity="0.6" />
        </>
      )}

      {(type === 'tulip' || type === 'lily' || type === 'cherry') && (
        <>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            const rr = r * 0.45;
            return (
              <circle
                key={i}
                cx={50 + Math.cos(a) * rr}
                cy={45 + Math.sin(a) * rr}
                r="0.8"
                fill={palette.centerDark}
                opacity="0.6"
              />
            );
          })}
          {/* stamens */}
          {type === 'lily' &&
            [0, 72, 144, 216, 288].map((deg, i) => {
              const a = (deg * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="50"
                  y1="45"
                  x2={50 + Math.cos(a) * (r + 2)}
                  y2={45 + Math.sin(a) * (r + 2)}
                  stroke={palette.centerDark}
                  strokeWidth="0.6"
                  opacity="0.7"
                />
              );
            })}
        </>
      )}
    </g>
  );
}

function Petal({
  type,
  palette,
  gradId,
  angle,
  unfurled,
  delay,
  rare,
  back,
}: {
  type: FlowerType;
  palette: Palette;
  gradId: string;
  angle: number;
  unfurled: boolean;
  delay: number;
  rare?: boolean;
  back?: boolean;
}) {
  let shape: React.ReactNode;
  const fill = `url(#${gradId})`;
  const stroke = palette.petalDark;
  const scale = back ? 0.85 : 1;
  const opacity = back ? 0.75 : 1;

  switch (type) {
    case 'rose':
    case 'poppy':
      shape = (
        <g>
          <path
            d="M50 20 Q40 28 42 40 Q46 48 50 46 Q54 48 58 40 Q60 28 50 20"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.8"
            opacity={opacity}
          />
          {/* inner petal curl */}
          <path
            d="M50 26 Q46 32 47 40 Q50 42 53 40 Q54 32 50 26"
            fill={palette.petalLight}
            opacity={0.5 * opacity}
          />
          <path d="M50 22 Q48 34 50 44" stroke={palette.petalDark} strokeWidth="0.5" fill="none" opacity={0.4 * opacity} />
        </g>
      );
      break;
    case 'daisy':
      shape = (
        <g>
          <path
            d="M50 18 Q45 24 46 34 Q48 40 50 40 Q52 40 54 34 Q55 24 50 18"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.7"
            opacity={opacity}
          />
          <path
            d="M50 20 Q48 28 49 36"
            stroke={palette.petalDark}
            strokeWidth="0.4"
            fill="none"
            opacity={0.4 * opacity}
          />
        </g>
      );
      break;
    case 'tulip':
      shape = (
        <g>
          <path
            d="M50 18 Q40 24 40 36 Q44 44 50 44 Q56 44 60 36 Q60 24 50 18"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.8"
            opacity={opacity}
          />
          <path
            d="M50 20 Q44 28 46 38 Q50 40 54 38 Q56 28 50 20"
            fill={palette.petalLight}
            opacity={0.5 * opacity}
          />
          <path d="M50 20 Q50 32 50 42" stroke={palette.petalDark} strokeWidth="0.4" fill="none" opacity={0.4 * opacity} />
        </g>
      );
      break;
    case 'sunflower':
      shape = (
        <g>
          <path
            d="M50 16 Q45 22 46 32 Q48 38 50 38 Q52 38 54 32 Q55 22 50 16"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.7"
            opacity={opacity}
          />
          {/* vein lines */}
          <path d="M50 18 Q49 26 50 34" stroke={palette.petalDark} strokeWidth="0.4" fill="none" opacity={0.4 * opacity} />
          <path d="M50 18 Q47 26 48 34" stroke={palette.petalDark} strokeWidth="0.3" fill="none" opacity={0.3 * opacity} />
          <path d="M50 18 Q53 26 52 34" stroke={palette.petalDark} strokeWidth="0.3" fill="none" opacity={0.3 * opacity} />
        </g>
      );
      break;
    case 'lily':
      shape = (
        <g>
          <path
            d="M50 18 Q42 26 44 38 Q48 44 50 44 Q52 44 56 38 Q58 26 50 18"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.8"
            opacity={opacity}
          />
          {/* spots */}
          <circle cx="48" cy="30" r="0.8" fill={palette.petalDark} opacity={0.5 * opacity} />
          <circle cx="52" cy="32" r="0.8" fill={palette.petalDark} opacity={0.5 * opacity} />
          <circle cx="50" cy="36" r="0.6" fill={palette.petalDark} opacity={0.4 * opacity} />
        </g>
      );
      break;
    case 'cherry':
      shape = (
        <g>
          <path
            d="M50 20 Q42 26 42 36 Q46 44 50 44 Q54 44 58 36 Q58 26 50 20"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.7"
            opacity={opacity}
          />
          <path
            d="M50 24 Q46 30 48 38 Q50 40 52 38 Q54 30 50 24"
            fill={palette.petalLight}
            opacity={0.5 * opacity}
          />
          {/* notch at top */}
          <path d="M50 20 L50 24" stroke={palette.petalDark} strokeWidth="0.5" opacity={0.5 * opacity} />
        </g>
      );
      break;
  }

  return (
    <g
      style={{
        transformOrigin: '50px 45px',
        transform: `rotate(${angle}deg) scale(${scale})`,
      }}
    >
      <g
        style={{
          transformOrigin: '50px 45px',
          animation: unfurled
            ? 'none'
            : `petal-unfurl 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards`,
          transform: unfurled ? 'scale(1)' : 'scale(0)',
          opacity: unfurled ? 1 : 0,
        }}
      >
        {shape}
        {rare && (
          <ellipse cx="50" cy="28" rx="4" ry="8" fill="#fff5d0" opacity={0.35 * opacity} />
        )}
      </g>
    </g>
  );
}
