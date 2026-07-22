// ============================================================
//  MessageCard — parchment scroll that unfurls from a flower
//  ------------------------------------------------------------
//  Handles all content kinds: note, photo, memory, reason, riddle.
//  Riddles ask a question first; the message reveals on answer.
// ============================================================

import { useState } from 'react';
import type { FlowerMessage } from './flowers';
import { X, Sparkles } from 'lucide-react';

interface MessageCardProps {
  message: FlowerMessage;
  onClose: () => void;
}

export function MessageCard({ message, onClose }: MessageCardProps) {
  const [revealed, setRevealed] = useState(message.kind !== 'riddle');
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [wrong, setWrong] = useState(false);

  const checkAnswer = () => {
    const norm = answer.trim().toLowerCase();
    const target = (message.answer || '').toLowerCase();
    if (norm && target.includes(norm)) {
      setRevealed(true);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 600);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in"
      style={{ background: 'rgba(36, 24, 68, 0.55)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto parchment-scroll text-cream"
        style={{
          background: 'linear-gradient(180deg, rgba(42,32,74,0.92) 0%, rgba(24,18,48,0.96) 100%)',
          borderRadius: '24px',
          border: '2px solid rgba(217, 192, 138, 0.4)',
          boxShadow: '0 0 60px rgba(160, 140, 255, 0.25), inset 0 0 40px rgba(217, 192, 138, 0.08)',
          animation: 'scroll-unfurl 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          transformOrigin: 'top center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* floral border corners */}
        <FloralCorner className="top-1 left-1" />
        <FloralCorner className="top-1 right-1 rotate-90" />
        <FloralCorner className="bottom-1 left-1 -rotate-90" />
        <FloralCorner className="bottom-1 right-1 rotate-180" />

        {/* wax seal close button */}
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center spring hover:scale-110"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #7a6ba8 0%, #463b6d 100%)',
            boxShadow: '0 0 16px rgba(180, 150, 255, 0.6), inset 0 -2px 4px rgba(0,0,0,0.4)',
            border: '2px solid #9486c4',
          }}
        >
          <X size={18} className="text-cream" strokeWidth={2.5} />
        </button>

        <div className="px-7 py-8">
          {message.rare && (
            <div className="flex items-center justify-center gap-1.5 mb-3 text-butterDeep">
              <Sparkles size={16} className="anim-shimmer" />
              <span className="font-script text-lg">a rare bloom</span>
              <Sparkles size={16} className="anim-shimmer" />
            </div>
          )}

          {message.title && (
            <h3 className="font-serif italic text-3xl text-center text-cream mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {message.title}
            </h3>
          )}

          {/* divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-16 bg-cream opacity-30" />
            <span className="text-butterDeep text-sm drop-shadow-[0_0_8px_rgba(255,220,130,0.6)]">✨</span>
            <span className="h-px w-16 bg-cream opacity-30" />
          </div>

          {!revealed ? (
            <Riddle
              message={message}
              answer={answer}
              setAnswer={setAnswer}
              showHint={showHint}
              setShowHint={setShowHint}
              wrong={wrong}
              onCheck={checkAnswer}
            />
          ) : (
            <Reveal message={message} />
          )}
        </div>
      </div>
    </div>
  );
}

function Riddle({
  message,
  answer,
  setAnswer,
  showHint,
  setShowHint,
  wrong,
  onCheck,
}: {
  message: FlowerMessage;
  answer: string;
  setAnswer: (s: string) => void;
  showHint: boolean;
  setShowHint: (b: boolean) => void;
  wrong: boolean;
  onCheck: () => void;
}) {
  return (
    <div className="text-center">
      <p className="font-script text-2xl text-cream leading-relaxed mb-6 drop-shadow-md">
        {message.riddle}
      </p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onCheck()}
        placeholder="your answer…"
        className={`w-full px-4 py-3 rounded-full text-center font-body text-cream bg-white/10 border-2 outline-none transition-all placeholder:text-cream/40 backdrop-blur-sm ${
          wrong ? 'border-blush animate-pulse' : 'border-white/20 focus:border-butterDeep focus:bg-white/20'
        }`}
      />
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={onCheck}
          className="px-6 py-2.5 rounded-full font-body font-semibold text-twilight bg-butterDeep spring hover:scale-105 hover:bg-butter drop-shadow-[0_0_12px_rgba(255,220,130,0.4)]"
        >
          reveal it
        </button>
        <button
          onClick={() => setShowHint(true)}
          className="px-5 py-2.5 rounded-full font-body text-cream bg-white/10 spring hover:bg-white/20 text-sm backdrop-blur-sm"
        >
          {showHint ? message.hint : 'need a hint?'}
        </button>
      </div>
      {wrong && (
        <p className="mt-4 text-blushLight font-body text-sm drop-shadow-md">not quite… try again ✨</p>
      )}
    </div>
  );
}

function Reveal({ message }: { message: FlowerMessage }) {
  if (message.kind === 'photo' && message.photo) {
    return (
      <div className="text-center">
        <div
          className="relative mx-auto p-2.5 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={message.photo}
            alt={message.caption || 'a pressed memory'}
            className="rounded-lg w-full max-h-72 object-cover"
            loading="lazy"
          />
          {/* magical accents */}
          <span className="absolute -top-3 -left-3 text-butterDeep text-2xl rotate-[-20deg] drop-shadow-[0_0_8px_rgba(255,220,130,0.8)]">✦</span>
          <span className="absolute -bottom-3 -right-3 text-butterDeep text-2xl rotate-[15deg] drop-shadow-[0_0_8px_rgba(255,220,130,0.8)]">✦</span>
        </div>
        {message.caption && (
          <p className="font-script text-2xl text-cream mt-5 drop-shadow-md">{message.caption}</p>
        )}
        {message.body && (
          <p className="font-body text-cream/90 mt-3 leading-relaxed text-sm drop-shadow-sm">{message.body}</p>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="font-script text-[26px] text-cream leading-relaxed whitespace-pre-line drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {message.body}
      </p>
    </div>
  );
}

function FloralCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={`absolute ${className} no-select`}
    >
      <path
        d="M4 4 Q10 6 12 12 Q6 10 4 4"
        fill="#b496ff"
        opacity="0.3"
      />
      <circle cx="12" cy="12" r="2.5" fill="#f5d76e" opacity="0.9" />
      <path d="M4 4 Q6 10 12 12" stroke="#d4c290" strokeWidth="1" fill="none" opacity="0.7" />
    </svg>
  );
}
