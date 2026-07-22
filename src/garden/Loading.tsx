// ============================================================
//  Loading — a seed-growing sparkle animation
// ============================================================

export function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #241844 0%, #3a2a5c 100%)' }}
    >
      <div className="relative" style={{ width: 60, height: 80 }}>
        {/* soil */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full"
          style={{ background: '#5a4a2e', opacity: 0.6 }}
        />
        {/* sprout */}
        <div
          className="absolute bottom-3 left-1/2 origin-bottom"
          style={{
            width: 4,
            height: 30,
            marginLeft: -2,
            background: '#8fbf7f',
            borderRadius: '2px',
            animation: 'seed-grow 1.2s ease-out forwards',
          }}
        />
        {/* leaves */}
        <div
          className="absolute bottom-7 left-1/2"
          style={{
            width: 18,
            height: 10,
            marginLeft: -16,
            background: '#8fbf7f',
            borderRadius: '50% 0 50% 0',
            transform: 'rotate(-20deg)',
            animation: 'seed-grow 1s ease-out 0.5s both',
            transformOrigin: 'right center',
          }}
        />
        <div
          className="absolute bottom-7 left-1/2"
          style={{
            width: 18,
            height: 10,
            marginLeft: -2,
            background: '#8fbf7f',
            borderRadius: '0 50% 0 50%',
            transform: 'rotate(20deg)',
            animation: 'seed-grow 1s ease-out 0.5s both',
            transformOrigin: 'left center',
          }}
        />
        {/* sparkle */}
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 text-butter anim-twinkle"
          style={{ fontSize: 18 }}
        >
          ✨
        </span>
      </div>
      <p className="font-script text-cream/80 text-lg mt-4">tending the garden…</p>
    </div>
  );
}
