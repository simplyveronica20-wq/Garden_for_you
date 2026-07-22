// ============================================================
//  Scene 1 — The Garden Gate
//  ------------------------------------------------------------
//  Illustrated gate with vines, fairy lights, twilight sky.
//  "Open the Gate" transitions into the garden.
// ============================================================

import { useState } from 'react';

interface GateProps {
  onEnter: () => void;
}

export function GardenGate({ onEnter }: GateProps) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(onEnter, 1400);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background:
          'linear-gradient(180deg, #241844 0%, #3a2a5c 35%, #6d4f8c 65%, #c9b6e4 100%)',
      }}
    >
      {/* moon / low sun glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          top: '12%',
          right: '18%',
          background: 'radial-gradient(circle, rgba(255,245,208,0.9) 0%, rgba(255,220,130,0.4) 40%, rgba(255,220,130,0) 70%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute rounded-full bg-cream"
        style={{
          width: 90,
          height: 90,
          top: '15%',
          right: '22%',
          boxShadow: '0 0 60px 20px rgba(255,245,208,0.6)',
        }}
      />

      {/* stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cream"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
            boxShadow: '0 0 4px rgba(255,245,208,0.8)',
          }}
        />
      ))}

      {/* distant hills */}
      <svg
        viewBox="0 0 1440 400"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
        style={{ height: '40%' }}
      >
        <path
          d="M0 280 Q200 200 400 240 T800 220 T1200 250 T1440 230 V400 H0 Z"
          fill="#3a2a5c"
          opacity="0.6"
        />
        <path
          d="M0 320 Q300 260 600 290 T1200 280 T1440 300 V400 H0 Z"
          fill="#241844"
          opacity="0.7"
        />
      </svg>

      {/* heading */}
      <div
        className={`relative z-10 text-center px-6 transition-all duration-700 ${
          opening ? 'opacity-0 -translate-y-4 scale-95' : 'opacity-100'
        }`}
      >
        <p className="font-body tracking-[0.3em] uppercase text-xs mb-4" style={{ color: '#f0e2ff', textShadow: '0 1px 8px rgba(36,24,68,0.9)' }}>
          a little world
        </p>
        <h1
          className="font-serif italic text-4xl sm:text-5xl md:text-6xl leading-tight"
          style={{ color: '#fff8e7', textShadow: '0 2px 18px rgba(36,24,68,0.95), 0 1px 3px rgba(36,24,68,1)' }}
        >
          Welcome to
          <br />
          Our Little Garden
        </h1>
        <p
          className="font-script text-xl sm:text-2xl mt-5"
          style={{ color: '#ffe9d6', textShadow: '0 1px 10px rgba(36,24,68,0.95)' }}
        >
          a little world that grows, just like my love for you
        </p>
      </div>

      {/* the gate */}
      <div
        className="relative z-10 mt-10"
        style={{ perspective: '800px' }}
      >
        <GateSVG opening={opening} onOpen={handleOpen} />
      </div>

      {/* open button */}
      <button
        onClick={handleOpen}
        disabled={opening}
        className={`relative z-10 mt-12 px-10 py-3.5 rounded-full font-serif italic text-2xl text-ink bg-gradient-to-r from-cream via-[#fbf7ec] to-cream spring hover:scale-110 hover:shadow-[0_0_40px_rgba(255,245,208,0.8)] shadow-[0_0_20px_rgba(255,245,208,0.4)] border border-[#d9c08a] ${
          opening ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Enter the Garden
      </button>

      {/* zoom-through transition overlay */}
      {opening && (
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ animation: 'zoom-through 1.4s ease-in forwards' }}
        >
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(circle at 50% 60%, rgba(255,245,208,0.9) 0%, rgba(201,182,228,0.6) 30%, rgba(36,24,68,0) 70%)',
            }}
          />
        </div>
      )}
    </div>
  );
}

function GateSVG({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  // A richer vine-flower palette so the arch feels like a real, varied garden
  // rather than a single repeated bloom.
  const vineFlowerColors = ['#f6c6d4', '#c9b6e4', '#f5d76e', '#a8c69a', '#f0918f'];

  return (
    <svg
      width="280"
      height="240"
      viewBox="0 0 260 230"
      className="no-select"
      style={{ filter: 'drop-shadow(0 6px 26px rgba(0,0,0,0.35))' }}
    >
      <defs>
        <linearGradient id="gate-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d2f1c" />
          <stop offset="50%" stopColor="#6a5238" />
          <stop offset="100%" stopColor="#3d2f1c" />
        </linearGradient>
        <linearGradient id="gate-wood-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6f4a" />
          <stop offset="50%" stopColor="#c9a86a" />
          <stop offset="100%" stopColor="#8a6f4a" />
        </linearGradient>
        <radialGradient id="lantern-glow" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#fff8dc" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffe9a8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="keystone-flower" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#fff5c8" />
          <stop offset="60%" stopColor="#f5d76e" />
          <stop offset="100%" stopColor="#c9982e" />
        </radialGradient>
      </defs>

      {/* soft glow pooling behind the whole arch */}
      <ellipse cx="130" cy="70" rx="110" ry="80" fill="url(#lantern-glow)" opacity="0.5" />

      {/* arch frame — layered iron + gilt trim for a richer, more ornate look */}
      <path
        d="M28 218 L28 78 Q130 -6 232 78 L232 218"
        fill="none"
        stroke="url(#gate-wood)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M28 218 L28 78 Q130 -6 232 78 L232 218"
        fill="none"
        stroke="url(#gate-wood-light)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* filigree studs along the arch */}
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const angle = Math.PI * (1 - t);
        const cx = 130 - Math.cos(angle) * 102;
        const cy = 78 - Math.sin(angle) * 84 + 8;
        return (
          <circle key={i} cx={cx} cy={Math.max(cy, -6)} r="2.2" fill="#e9d19a" opacity="0.85" />
        );
      })}

      {/* keystone flower at the very peak of the arch */}
      <g style={{ transformOrigin: '130px 4px' }}>
        <circle cx="130" cy="4" r="10" fill="url(#keystone-flower)" stroke="#a8761e" strokeWidth="1" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="130"
            cy="4"
            rx="4.5"
            ry="7"
            fill="#fff5c8"
            opacity="0.85"
            transform={`rotate(${deg} 130 4) translate(0 -9)`}
          />
        ))}
      </g>

      {/* lush vine with varied, richly colored blooms and leaves */}
      <path
        d="M28 78 Q42 52 56 66 Q68 42 82 60 Q94 36 108 54 Q120 30 130 48 Q140 30 152 54 Q166 36 178 60 Q192 42 204 66 Q218 52 232 78"
        fill="none"
        stroke="#5a8a48"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M28 78 Q42 52 56 66 Q68 42 82 60 Q94 36 108 54 Q120 30 130 48 Q140 30 152 54 Q166 36 178 60 Q192 42 204 66 Q218 52 232 78"
        fill="none"
        stroke="#8fbf7f"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {[36, 50, 64, 78, 92, 106, 120, 140, 154, 168, 182, 196, 210, 224].map((x, i) => {
        const y = 66 - Math.sin(i * 0.9) * 22;
        const color = vineFlowerColors[i % vineFlowerColors.length];
        const isLeaf = i % 3 === 2;
        return (
          <g key={i}>
            {/* leaf */}
            <ellipse
              cx={x - 4}
              cy={y + 6}
              rx="5.5"
              ry="3"
              fill="#8fbf7f"
              opacity="0.85"
              transform={`rotate(${(i % 2 === 0 ? -1 : 1) * 30} ${x - 4} ${y + 6})`}
            />
            {isLeaf ? null : (
              <>
                {/* small bloom */}
                {[0, 72, 144, 216, 288].map((deg) => (
                  <ellipse
                    key={deg}
                    cx={x}
                    cy={y}
                    rx="2.6"
                    ry="4.2"
                    fill={color}
                    opacity="0.95"
                    transform={`rotate(${deg} ${x} ${y}) translate(0 -3.2)`}
                  />
                ))}
                <circle cx={x} cy={y} r="1.6" fill="#fff5d0" opacity="0.95" />
              </>
            )}
          </g>
        );
      })}

      {/* fairy lights woven through — warm, varied twinkle */}
      {[32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 228].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={72 - Math.sin(i * 0.7) * 20}
          r={i % 4 === 0 ? 3 : 2.2}
          fill="#fff5d0"
          style={{
            animation: `twinkle ${1.4 + (i % 3) * 0.5}s ease-in-out ${i * 0.18}s infinite`,
            filter: 'drop-shadow(0 0 5px #fff5d0)',
          }}
        />
      ))}

      {/* hanging lantern — the gate's warm focal light */}
      <g style={{ transformOrigin: '130px 30px' }}>
        <line x1="130" y1="14" x2="130" y2="34" stroke="#5a4a2e" strokeWidth="1.5" />
        <circle cx="130" cy="34" r="9" fill="url(#lantern-glow)" />
        <rect
          x="124"
          y="30"
          width="12"
          height="14"
          rx="3"
          fill="#3d2f1c"
          stroke="#c9a86a"
          strokeWidth="1"
        />
        <rect x="126.5" y="32.5" width="7" height="9" rx="1.5" fill="#ffe9a8" opacity="0.9">
          <animate attributeName="opacity" values="0.65;1;0.65" dur="2.4s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* left gate door (swings open) — richer lattice ironwork */}
      <g
        style={{
          transformOrigin: '28px 218px',
          animation: opening ? 'gate-swing 1.2s ease-in-out forwards' : 'none',
        }}
      >
        <rect x="28" y="96" width="97" height="122" rx="5" fill="none" stroke="url(#gate-wood)" strokeWidth="4.5" />
        <rect x="28" y="96" width="97" height="122" rx="5" fill="none" stroke="url(#gate-wood-light)" strokeWidth="1.4" opacity="0.8" />
        <path d="M28 96 L125 96 M28 218 L125 218" stroke="url(#gate-wood)" strokeWidth="4.5" />
        <path d="M76.5 96 L76.5 218" stroke="url(#gate-wood-light)" strokeWidth="2" opacity="0.7" />
        {/* diamond lattice */}
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => {
            const cx = 50 + col * 52;
            const cy = 118 + row * 34;
            return (
              <path
                key={`${row}-${col}`}
                d={`M${cx} ${cy - 12} L${cx + 12} ${cy} L${cx} ${cy + 12} L${cx - 12} ${cy} Z`}
                fill="none"
                stroke="#c9a86a"
                strokeWidth="1"
                opacity="0.55"
              />
            );
          }),
        )}
        {/* heart-shaped charm handle */}
        <path
          d="M110 152 c-3 -4 -9 -4 -9 1 c0 4 4 6 9 10 c5 -4 9 -6 9 -10 c0 -5 -6 -5 -9 -1 Z"
          fill="#e8a8b8"
          stroke="#8a3a4a"
          strokeWidth="1"
        />
      </g>

      {/* right gate door */}
      <g>
        <rect x="135" y="96" width="97" height="122" rx="5" fill="none" stroke="url(#gate-wood)" strokeWidth="4.5" />
        <rect x="135" y="96" width="97" height="122" rx="5" fill="none" stroke="url(#gate-wood-light)" strokeWidth="1.4" opacity="0.8" />
        <path d="M135 96 L232 96 M135 218 L232 218" stroke="url(#gate-wood)" strokeWidth="4.5" />
        <path d="M183.5 96 L183.5 218" stroke="url(#gate-wood-light)" strokeWidth="2" opacity="0.7" />
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => {
            const cx = 157 + col * 52;
            const cy = 118 + row * 34;
            return (
              <path
                key={`${row}-${col}`}
                d={`M${cx} ${cy - 12} L${cx + 12} ${cy} L${cx} ${cy + 12} L${cx - 12} ${cy} Z`}
                fill="none"
                stroke="#c9a86a"
                strokeWidth="1"
                opacity="0.55"
              />
            );
          }),
        )}
        <path
          d="M150 152 c-3 -4 -9 -4 -9 1 c0 4 4 6 9 10 c5 -4 9 -6 9 -10 c0 -5 -6 -5 -9 -1 Z"
          fill="#e8a8b8"
          stroke="#8a3a4a"
          strokeWidth="1"
        />
      </g>

      {/* soft grass tufts grounding the gate */}
      {[10, 30, 52, 208, 230, 250].map((x, i) => (
        <path
          key={i}
          d={`M${x} 224 Q${x - 3} 214 ${x - 6} 220 M${x} 224 Q${x} 210 ${x + 2} 218 M${x} 224 Q${x + 4} 214 ${x + 7} 221`}
          stroke="#5a8a48"
          strokeWidth="1.4"
          fill="none"
          opacity="0.75"
        />
      ))}

      {/* glowing path through gate */}
      <path
        d="M76.5 218 Q130 246 183.5 218"
        fill="none"
        stroke="rgba(255,245,208,0.35)"
        strokeWidth="42"
        strokeLinecap="round"
      />
    </svg>
  );
}
