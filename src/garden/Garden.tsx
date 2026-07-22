// ============================================================
//  Scene 2 — The Garden (main experience)
//  ------------------------------------------------------------
//  Illustrated garden bed. Flowers bloom over time. Clicking a
//  bloom unfurls its message. Locked buds for future days.
//  Celebration when the garden is fully grown.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { FLOWERS, FIREFLY_SURPRISES, FlowerMessage } from './flowers';
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
        background:
          'linear-gradient(180deg, #b5dff0 0%, #dcf0e5 22%, #f2f7d4 38%, #dff2bc 52%, #c3e39b 68%, #93c970 85%, #6eb855 100%)',
      }}
    >
      {/* glowing morning sun */}
      <Sun />

      {/* hazy morning mountains */}
      <Mountains />

      {/* vibrant dew-kissed grass field */}
      <GrassField />

      {/* butterflies */}
      <Butterfly color="#f6c6d4" delay={0} />
      <Butterfly color="#f5d76e" delay={9} />

      {/* enchanting fireflies (they stay even in morning for magic!) */}
      <Fireflies count={8} onClick={handleFirefly} />

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

// ---------- Sun ----------
function Sun() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ top: '6%', left: '50%', transform: 'translateX(-50%)', width: 340, height: 340 }}
    >
      {/* warm realistic sun glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,245,210,0.8) 15%, rgba(255,230,160,0.4) 35%, rgba(255,220,130,0.1) 60%, rgba(255,220,130,0) 80%)',
          boxShadow: '0 0 100px 30px rgba(255, 240, 180, 0.5)',
        }}
      />
      {/* lens flares for realism */}
      <div
        className="absolute rounded-full"
        style={{
          top: '55%',
          left: '55%',
          width: '40%',
          height: '40%',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: '75%',
          left: '75%',
          width: '15%',
          height: '15%',
          background: 'rgba(200,240,255,0.15)',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: '90%',
          left: '90%',
          width: '8%',
          height: '8%',
          background: 'rgba(255,220,180,0.2)',
          filter: 'blur(1px)',
        }}
      />
    </div>
  );
}

// ---------- Mountains ----------
function Mountains() {
  return (
    <svg
      viewBox="0 0 1440 500"
      className="absolute left-0 w-full no-select pointer-events-none"
      style={{ top: '14%', height: '46%' }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mtn-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c5d5ea" />
          <stop offset="100%" stopColor="#a3b8d6" />
        </linearGradient>
        <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#96adca" />
          <stop offset="100%" stopColor="#7590b4" />
        </linearGradient>
        <linearGradient id="mtn-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b8ca8" />
          <stop offset="100%" stopColor="#4c6a85" />
        </linearGradient>
        <filter id="blur-distant" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="blur-mid" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* back range, distant hazy mountains with smooth peaks */}
      <path
        d="M0 280 Q 80 180 160 220 T 320 120 T 480 200 T 640 100 T 800 180 T 960 90 T 1120 160 T 1280 110 T 1440 210 V 500 H 0 Z"
        fill="url(#mtn-back)"
        opacity="0.8"
        filter="url(#blur-distant)"
      />

      {/* mid range, rolling hills and lower mountains */}
      <path
        d="M0 340 Q 120 220 240 290 T 500 180 T 760 300 T 1020 190 T 1260 290 T 1440 220 V 500 H 0 Z"
        fill="url(#mtn-mid)"
        opacity="0.9"
        filter="url(#blur-mid)"
      />

      {/* front range, rolling foreground hills */}
      <path
        d="M0 400 Q 180 280 360 360 T 720 250 T 1080 370 T 1440 280 V 500 H 0 Z"
        fill="url(#mtn-front)"
      />
    </svg>
  );
}

// ---------- Grass field ----------
function GrassField() {
  const blades = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        x: Math.random() * 100,
        y: 58 + Math.random() * 40,
        h: 10 + Math.random() * 16,
        tilt: -12 + Math.random() * 24,
        shade: Math.random() > 0.5 ? '#4a8a3a' : '#6fae52',
      })),
    [],
  );

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full no-select pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* soft ground shading so the grass has some depth */}
      <rect x="0" y="55" width="100" height="45" fill="url(#grass-gradient)" opacity="0.4" />
      <defs>
        <linearGradient id="grass-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3d674" />
          <stop offset="100%" stopColor="#4a8a3a" />
        </linearGradient>
      </defs>
      {blades.map((b, i) => (
        <path
          key={i}
          d={`M${b.x} ${b.y + b.h * 0.06} Q${b.x + b.tilt * 0.06} ${b.y - b.h * 0.5} ${b.x + b.tilt * 0.12} ${b.y - b.h * 0.12}`}
          stroke={b.shade}
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
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
