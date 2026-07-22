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
      {/* glowing golden sun */}
      <Sun />

      {/* magical birds flying across the sky */}
      <Bird delay={2} top="15%" />
      <Bird delay={14} top="25%" scale={0.6} />

      {/* hazy morning tall mountains */}
      <Mountains />

      {/* cute countryside house on the right hill */}
      <House />

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
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-full font-body font-bold text-sm pointer-events-none anim-fade-in"
                  style={{
                    bottom: '100%',
                    marginBottom: 10,
                    background: 'rgba(255,245,208,0.95)',
                    color: '#5a1a1a',
                    boxShadow: '0 4px 16px rgba(255,220,130,0.8)',
                    border: '1px solid #c9a86a',
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
      {/* warm glowing aura */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,250,220,1) 0%, rgba(255,235,160,0.6) 25%, rgba(255,220,130,0.2) 50%, rgba(255,220,130,0) 75%)',
          boxShadow: '0 0 120px 40px rgba(255, 230, 150, 0.5)',
        }}
      />
      {/* radiant sun rays */}
      <svg viewBox="0 0 340 340" className="absolute inset-0" style={{ animation: 'breathe 8s ease-in-out infinite' }}>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (360 / 16) * i;
          return (
            <line
              key={i}
              x1="170"
              y1="170"
              x2="170"
              y2="20"
              stroke="rgba(255,235,160,0.6)"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${angle} 170 170)`}
            />
          );
        })}
      </svg>
      {/* crisp golden core */}
      <div
        className="absolute rounded-full"
        style={{
          top: '38%',
          left: '38%',
          width: '24%',
          height: '24%',
          background: 'radial-gradient(circle at 35% 35%, #fffdf0 0%, #ffdf87 70%, #f5b041 100%)',
          boxShadow: '0 0 30px 10px rgba(255,220,130,0.8)',
        }}
      />
    </div>
  );
}

// ---------- Bird ----------
function Bird({ delay, top, scale = 1 }: { delay: number; top: string; scale?: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top,
        left: '-10%',
        animation: `float-across 25s linear infinite ${delay}s`,
        transform: `scale(${scale})`,
        opacity: 0,
      }}
    >
      <svg width="40" height="20" viewBox="0 0 40 20" style={{ animation: 'wing-flap 1.5s ease-in-out infinite' }}>
        <path
          d="M 2 12 Q 10 2 20 10 Q 30 2 38 12 Q 30 14 20 11 Q 10 14 2 12 Z"
          fill="#3a2a5c"
          opacity="0.6"
        />
      </svg>
      <style>{`
        @keyframes float-across {
          0% { transform: translateX(0vw) scale(${scale}); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateX(120vw) scale(${scale}); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ---------- Mountains ----------
function Mountains() {
  return (
    <svg
      viewBox="0 0 1440 500"
      className="absolute left-0 w-full no-select pointer-events-none"
      style={{ top: '8%', height: '52%' }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mtn-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d5f0" />
          <stop offset="100%" stopColor="#c1cbe6" />
        </linearGradient>
        <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bacbe6" />
          <stop offset="100%" stopColor="#98b4d4" />
        </linearGradient>
        <linearGradient id="mtn-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87a8c9" />
          <stop offset="100%" stopColor="#678db3" />
        </linearGradient>
        <filter id="blur-distant" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="blur-mid" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* back range, majestic tall mountains */}
      <path
        d="M 0 320 Q 150 -50 350 250 Q 550 400 750 150 Q 950 -120 1150 200 Q 1300 400 1440 180 V 500 H 0 Z"
        fill="url(#mtn-back)"
        opacity="0.8"
        filter="url(#blur-distant)"
      />

      {/* mid range, rolling hills and lower peaks */}
      <path
        d="M 0 350 Q 200 50 450 320 Q 700 440 950 160 Q 1200 20 1440 250 V 500 H 0 Z"
        fill="url(#mtn-mid)"
        opacity="0.9"
        filter="url(#blur-mid)"
      />

      {/* front range, rolling foreground hills */}
      <path
        d="M 0 420 Q 250 280 500 380 Q 750 440 1000 300 Q 1250 200 1440 380 V 500 H 0 Z"
        fill="url(#mtn-front)"
      />
    </svg>
  );
}

// ---------- Countryside House ----------
function House() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        right: '12%',
        bottom: '41%', // sitting right on the front hill
        width: 120,
        height: 120,
        transform: 'scale(0.8)',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* house body */}
        <path d="M 20 50 L 80 50 L 80 90 L 20 90 Z" fill="#d9c08a" />
        {/* wood beams */}
        <path d="M 20 50 L 20 90 M 80 50 L 80 90 M 20 90 L 80 90 M 20 50 L 80 50" stroke="#5a4a2e" strokeWidth="3" />
        <path d="M 35 50 L 35 90 M 65 50 L 65 90 M 50 50 L 50 90" stroke="#8a6f4a" strokeWidth="1" opacity="0.5" />
        {/* chimney */}
        <rect x="65" y="25" width="12" height="25" fill="#a23b3b" stroke="#5a4a2e" strokeWidth="2" />
        {/* roof */}
        <path d="M 10 50 L 50 15 L 90 50 Z" fill="#a23b3b" stroke="#5a4a2e" strokeWidth="3" strokeLinejoin="round" />
        {/* glowing window */}
        <rect x="35" y="60" width="12" height="15" rx="2" fill="#fff5d0" stroke="#5a4a2e" strokeWidth="2" />
        <line x1="41" y1="60" x2="41" y2="75" stroke="#5a4a2e" strokeWidth="2" />
        <line x1="35" y1="67.5" x2="47" y2="67.5" stroke="#5a4a2e" strokeWidth="2" />
        {/* window glow */}
        <circle cx="41" cy="67.5" r="18" fill="#ffdf87" opacity="0.3" filter="blur(4px)" />
        {/* door */}
        <path d="M 58 65 L 72 65 L 72 90 L 58 90 Z" fill="#8a6f4a" stroke="#5a4a2e" strokeWidth="2" />
        <circle cx="70" cy="78" r="1.5" fill="#f5d76e" />
        
        {/* smoke animation */}
        <circle cx="71" cy="20" r="4" fill="white" opacity="0.6">
          <animate attributeName="cy" values="20;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cx" values="71;76" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="71" cy="25" r="3" fill="white" opacity="0.6">
          <animate attributeName="cy" values="25;5" dur="4s" repeatCount="indefinite" begin="2s" />
          <animate attributeName="opacity" values="0.6;0" dur="4s" repeatCount="indefinite" begin="2s" />
          <animate attributeName="cx" values="71;66" dur="4s" repeatCount="indefinite" begin="2s" />
        </circle>
      </svg>
    </div>
  );
}

// ---------- Grass field ----------
function GrassField() {
  const blades = useMemo(
    () =>
      Array.from({ length: 120 }).map(() => ({
        x: Math.random() * 1440,
        y: 350 + Math.random() * 160,
        h: 20 + Math.random() * 25,
        tilt: -20 + Math.random() * 40,
        shade: Math.random() > 0.5 ? '#5c9c45' : '#7abd5a',
      })),
    [],
  );

  return (
    <svg
      viewBox="0 0 1440 500"
      className="absolute inset-0 w-full h-full no-select pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="grass-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3d674" />
          <stop offset="100%" stopColor="#4a8a3a" />
        </linearGradient>
      </defs>
      
      {/* soft curved ground so there's no harsh horizontal seam line */}
      <path
        d="M 0 360 Q 360 320 720 340 T 1440 330 V 500 H 0 Z"
        fill="url(#grass-gradient)"
        opacity="0.6"
      />

      {/* elegant tapering grass blades */}
      {blades.map((b, i) => (
        <path
          key={i}
          d={`M ${b.x} ${b.y} Q ${b.x + b.tilt * 0.5} ${b.y - b.h * 0.5} ${b.x + b.tilt} ${b.y - b.h} Q ${b.x + b.tilt * 0.5 + 2} ${b.y - b.h * 0.5} ${b.x + 4} ${b.y} Z`}
          fill={b.shade}
          opacity="0.85"
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
