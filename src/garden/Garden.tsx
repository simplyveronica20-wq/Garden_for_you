// ============================================================
//  Scene 2 — The Garden (main experience)
//  ------------------------------------------------------------
//  Illustrated garden bed. Flowers bloom over time. Clicking a
//  bloom unfurls its message. Locked buds for future days.
//  Celebration when the garden is fully grown.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { FLOWERS, FIREFLY_SURPRISES, FlowerMessage, GARDEN_BACKGROUND_PHOTO } from './flowers';
import { Flower, BloomState } from './Flower';
import { MessageCard } from './MessageCard';
import { Fireflies, Butterfly, PetalFirework } from './Ambient';
import type { GardenState } from './useGardenState';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';

interface GardenProps {
  state: GardenState;
  audio: {
    muted: boolean;
    musicOn: boolean;
    toggleMute: () => void;
    toggleMusic: () => void;
    play: (m: 'gate' | 'bloom' | 'click' | 'rare' | 'celebrate' | 'firefly') => void;
  };
}

export function Garden({ state, audio }: GardenProps) {
  const [activeMessage, setActiveMessage] = useState<FlowerMessage | null>(null);
  const [bloomedToday, setBloomedToday] = useState<number | null>(null);
  const [fireflyNote, setFireflyNote] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Determine which day is "new" today (unlocked but not yet seen).
  const newToday = useMemo(() => {
    for (const f of FLOWERS) {
      if (state.unlockedDays.has(f.day) && !state.seenDays.has(f.day)) {
        return f.day;
      }
    }
    return null;
  }, [state.unlockedDays, state.seenDays]);

  // Auto-bloom the new flower on entry.
  useEffect(() => {
    if (newToday !== null && !state.adminMode) {
      setBloomedToday(newToday);
      const isRare = FLOWERS.find((f) => f.day === newToday)?.rare;
      audio.play(isRare ? 'rare' : 'bloom');
      const t = setTimeout(() => {
        state.markSeen(newToday);
        setBloomedToday(null);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [newToday]);

  // The single most-recently-bloomed flower — this is "today's" flower,
  // and stays marked as such (not just during the brief bloom animation)
  // so it's always clear which of the 19 is new.
  const latestBloomDay = useMemo(() => {
    let latest: number | null = null;
    for (const f of FLOWERS) {
      if (state.unlockedDays.has(f.day) && (state.seenDays.has(f.day) || bloomedToday === f.day)) {
        latest = f.day;
      }
    }
    return latest;
  }, [state.unlockedDays, state.seenDays, bloomedToday]);

  // Trigger celebration when garden is fully grown.
  useEffect(() => {
    if (state.bloomCount === state.total && !state.celebrated) {
      setShowCelebration(true);
      audio.play('celebrate');
      state.markCelebrated();
    }
  }, [state.bloomCount, state.total, state.celebrated]);

  const handleFlowerClick = (f: FlowerMessage) => {
    if (!state.unlockedDays.has(f.day)) {
      // locked bud — show the "still growing" note
      setFireflyNote('this one is still growing… come back tomorrow 🌱');
      return;
    }
    if (!state.seenDays.has(f.day) && !state.adminMode) return; // still blooming
    audio.play(f.rare ? 'rare' : 'click');
    setActiveMessage(f);
  };

  const handleFirefly = (_id: number) => {
    audio.play('firefly');
    const note = FIREFLY_SURPRISES[Math.floor(Math.random() * FIREFLY_SURPRISES.length)];
    setFireflyNote(note);
    setTimeout(() => setFireflyNote(null), 4500);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(109,79,140,0.55) 0%, rgba(157,127,199,0.25) 18%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 70%, rgba(20,30,10,0.35) 100%), url(${GARDEN_BACKGROUND_PHOTO})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* low sun glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 220,
          height: 220,
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(255,245,208,0.7) 0%, rgba(255,220,130,0.3) 40%, rgba(255,220,130,0) 70%)',
        }}
      />

      {/* butterflies */}
      <Butterfly color="#f6c6d4" delay={0} />
      <Butterfly color="#f5d76e" delay={9} />

      {/* fireflies (clickable easter egg) */}
      <Fireflies count={4} onClick={handleFirefly} />

      {/* garden bed — flowers positioned absolutely */}
      <div className="absolute inset-0 z-10">
        {FLOWERS.map((f, i) => {
          const unlocked = state.unlockedDays.has(f.day);
          const seen = state.seenDays.has(f.day);
          const isBloomingToday = bloomedToday === f.day;
          const isBloomed = state.adminMode || seen || isBloomingToday;
          const isTodaysBloom = !state.adminMode && f.day === latestBloomDay;

          let bloomState: BloomState;
          if (!unlocked) bloomState = 'locked';
          else if (isBloomingToday) bloomState = 'blooming';
          else if (isBloomed) bloomState = 'bloomed';
          else bloomState = 'bud';

          const size = f.rare ? 96 : 76;

          return (
            <button
              key={i}
              aria-label={`flower ${f.day}${isTodaysBloom ? ' — today’s bloom' : ''}`}
              className="absolute group spring hover:scale-110"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isBloomingToday || isTodaysBloom ? 30 : 10,
              }}
              onClick={() => handleFlowerClick(f)}
            >
              {/* persistent spotlight ring marking today's new bloom, so it
                  stays unmistakable among all 19 flowers, not just during
                  the initial bloom animation */}
              {isTodaysBloom && (
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: '-38%',
                    background:
                      'radial-gradient(circle, rgba(255,245,208,0.55) 0%, rgba(255,220,130,0.25) 45%, rgba(255,220,130,0) 75%)',
                    animation: 'breathe 2.6s ease-in-out infinite',
                  }}
                />
              )}

              {/* hover glow */}
              {isBloomed && (
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,245,208,0.5) 0%, rgba(255,245,208,0) 70%)',
                    transform: 'scale(1.8)',
                  }}
                />
              )}

              <Flower
                type={f.type}
                state={bloomState}
                rare={f.rare}
                size={size}
                index={i}
              />

              {/* "today's bloom" tag — always visible on the newest flower */}
              {isTodaysBloom && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full font-body font-semibold text-[11px] pointer-events-none anim-fade-in"
                  style={{
                    bottom: '100%',
                    marginBottom: 6,
                    background: 'rgba(255,245,208,0.95)',
                    color: '#5a1a1a',
                    boxShadow: '0 2px 10px rgba(255,220,130,0.6)',
                  }}
                >
                  ✨ today's bloom
                </span>
              )}

              {/* day tag — appears on hover for any bloomed flower, so each
                  one stays identifiable at a glance without cluttering
                  the whole scene by default */}
              {isBloomed && !isTodaysBloom && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full font-body text-[10px] text-twilight opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    bottom: '100%',
                    marginBottom: 4,
                    background: 'rgba(255,245,208,0.9)',
                  }}
                >
                  day {f.day}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* garden sign counter */}
      <GardenSign count={state.bloomCount} total={state.total} />

      {/* audio controls */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <button
          onClick={audio.toggleMusic}
          disabled={audio.muted}
          aria-label={audio.musicOn ? 'mute music' : 'play music'}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-twilight/60 text-cream spring hover:bg-twilight/80 disabled:opacity-40"
        >
          {audio.musicOn ? <Music size={18} /> : <Music2 size={18} />}
        </button>
        <button
          onClick={audio.toggleMute}
          aria-label={audio.muted ? 'unmute' : 'mute'}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-twilight/60 text-cream spring hover:bg-twilight/80"
        >
          {audio.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* firefly easter egg note */}
      {fireflyNote && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 anim-fade-in max-w-xs">
          <div
            className="px-5 py-3 rounded-2xl text-center font-script text-lg text-twilight"
            style={{
              background: 'rgba(255,245,208,0.92)',
              boxShadow: '0 0 20px rgba(255,245,208,0.5)',
            }}
          >
            {fireflyNote}
          </div>
        </div>
      )}

      {/* message card */}
      {activeMessage && (
        <MessageCard message={activeMessage} onClose={() => setActiveMessage(null)} />
      )}

      {/* celebration */}
      {showCelebration && (
        <Celebration
          onRevisit={() => {
            setShowCelebration(false);
          }}
        />
      )}
    </div>
  );
}

// ---------- Garden sign counter ----------
function GardenSign({ count, total }: { count: number; total: number }) {
  return (
    <div className="absolute bottom-5 left-5 z-30 anim-fade-in">
      <div
        className="relative px-4 py-2.5 rounded-lg font-body text-twilight"
        style={{
          background: 'linear-gradient(180deg, #d9c08a 0%, #c9a86a 100%)',
          border: '2px solid #8a6f4a',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transform: 'rotate(-2deg)',
        }}
      >
        {/* little post */}
        <span
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-ink/60 rounded-b"
        />
        <span className="text-sm font-semibold">
          🌸 {count} of {total} flowers grown
        </span>
      </div>
    </div>
  );
}

// ---------- Tree silhouettes ----------
function TreeSilhouette({ className = '', side }: { className?: string; side: 'left' | 'right' }) {
  const treeId = `tree-${side}`;
  return (
    <svg
      width="200"
      height="320"
      viewBox="0 0 200 320"
      className={`${className} no-select`}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={`${treeId}-trunk`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2a1c" />
          <stop offset="50%" stopColor="#6a5238" />
          <stop offset="100%" stopColor="#3a2a1c" />
        </linearGradient>
        <radialGradient id={`${treeId}-leaf`} cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#9fd08a" />
          <stop offset="55%" stopColor="#6f9c63" />
          <stop offset="100%" stopColor="#3a6a2a" />
        </radialGradient>
        <radialGradient id={`${treeId}-leaf-light`} cx="0.4" cy="0.3">
          <stop offset="0%" stopColor="#c0e8a8" />
          <stop offset="100%" stopColor="#7eb86a" />
        </radialGradient>
      </defs>

      {/* trunk */}
      <path
        d="M100 320 Q98 260 102 200 Q100 160 104 130"
        stroke={`url(#${treeId}-trunk)`}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      {/* bark texture lines */}
      <path d="M100 300 Q99 260 102 220" stroke="#2a1a0c" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M103 280 Q102 240 105 200" stroke="#2a1a0c" strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* branches */}
      <path
        d="M101 200 Q80 180 60 185 M102 180 Q124 165 140 172 M101 160 Q88 150 70 155"
        stroke={`url(#${treeId}-trunk)`}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* layered foliage clusters — back (darker) */}
      <ellipse cx="100" cy="115" rx="78" ry="88" fill={`url(#${treeId}-leaf)`} opacity="0.9" />
      <ellipse cx="55" cy="140" rx="42" ry="48" fill={`url(#${treeId}-leaf)`} opacity="0.85" />
      <ellipse cx="145" cy="140" rx="42" ry="48" fill={`url(#${treeId}-leaf)`} opacity="0.85" />
      <ellipse cx="75" cy="85" rx="38" ry="42" fill={`url(#${treeId}-leaf)`} opacity="0.8" />
      <ellipse cx="125" cy="85" rx="38" ry="42" fill={`url(#${treeId}-leaf)`} opacity="0.8" />

      {/* front (lighter, adds depth) */}
      <ellipse cx="100" cy="95" rx="55" ry="60" fill={`url(#${treeId}-leaf-light)`} opacity="0.65" />
      <ellipse cx="68" cy="120" rx="30" ry="34" fill={`url(#${treeId}-leaf-light)`} opacity="0.5" />
      <ellipse cx="132" cy="120" rx="30" ry="34" fill={`url(#${treeId}-leaf-light)`} opacity="0.5" />
      <ellipse cx="100" cy="70" rx="32" ry="36" fill={`url(#${treeId}-leaf-light)`} opacity="0.55" />

      {/* small leaf bumps for texture */}
      {[
        [60, 100], [140, 100], [80, 60], [120, 60], [100, 40],
        [50, 130], [150, 130], [70, 160], [130, 160],
      ].map(([cx, cy], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="14"
          ry="16"
          fill={`url(#${treeId}-leaf-light)`}
          opacity="0.45"
        />
      ))}
    </svg>
  );
}

// ---------- Celebration ----------
function Celebration({ onRevisit }: { onRevisit: () => void }) {
  const fireworks = useMemo(
    () =>
      Array.from({ length: 5 }).map(() => ({
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 40,
        delay: Math.random() * 1.5,
      })),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 anim-fade-in"
      style={{ background: 'rgba(36,24,68,0.7)', backdropFilter: 'blur(4px)' }}
    >
      {/* swirling fireflies */}
      <Fireflies count={12} />

      {/* petal fireworks */}
      {fireworks.map((fw, i) => (
        <PetalFirework key={i} x={fw.x} y={fw.y} delay={fw.delay} />
      ))}

      <div
        className="relative w-full max-w-lg text-center"
        style={{
          background: 'linear-gradient(180deg, #f3e4c1 0%, #ecd9ad 100%)',
          borderRadius: '20px',
          border: '2px solid #d9c08a',
          boxShadow: '0 0 50px rgba(255,220,130,0.6)',
          animation: 'scroll-unfurl 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards',
          transformOrigin: 'top center',
        }}
      >
        <div className="px-8 py-10">
          <div className="text-4xl mb-3">🌷💛</div>
          <h2 className="font-serif italic text-3xl text-ink mb-5">
            The garden is in full bloom
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-16 bg-parchmentDeep" />
            <span className="text-butterDeep">❀</span>
            <span className="h-px w-16 bg-parchmentDeep" />
          </div>
          <p className="font-script text-xl text-ink leading-relaxed">
            Every flower here grew because of you.
            <br />
            Thank you for filling my garden
            <br />
            with so much beauty. 🌷💛
          </p>
          <button
            onClick={onRevisit}
            className="mt-8 px-6 py-2.5 rounded-full font-body font-semibold text-cream bg-sageDeep spring hover:scale-105 hover:bg-sage"
          >
            read it again
          </button>
        </div>
      </div>
    </div>
  );
}
