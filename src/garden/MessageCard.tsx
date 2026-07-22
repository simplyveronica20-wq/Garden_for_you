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
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto parchment-scroll text-ink"
        style={{
          background: 'linear-gradient(180deg, #fbf7ec 0%, #f3e4c1 100%)',
          borderRadius: '24px',
          border: '2px solid #d9c08a',
          boxShadow: '0 0 60px rgba(255, 245, 208, 0.7), inset 0 0 40px rgba(217, 192, 138, 0.3)',
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
            background: 'radial-gradient(circle at 35% 35%, #e28e8e 0%, #ba5353 100%)',
            boxShadow: '0 0 16px rgba(186, 83, 83, 0.4), inset 0 -2px 4px rgba(0,0,0,0.15)',
            border: '2px solid #a44848',
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
            <h3 className="font-serif italic text-3xl text-center text-ink mb-4 drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]">
              {message.title}
            </h3>
          )}

          {/* divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-16 bg-parchmentDeep opacity-40" />
            <span className="text-butterDeep text-sm drop-shadow-[0_0_8px_rgba(255,220,130,0.6)]">✨</span>
            <span className="h-px w-16 bg-parchmentDeep opacity-40" />
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
      <p className="font-serif text-[22px] text-ink leading-relaxed mb-6 drop-shadow-sm">
        {message.riddle}
      </p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onCheck()}
        placeholder="your answer…"
        className={`w-full px-4 py-3 rounded-full text-center font-body text-ink bg-white/50 border-2 outline-none transition-all placeholder:text-ink/30 backdrop-blur-sm ${
          wrong ? 'border-wax animate-pulse' : 'border-parchmentDeep/50 focus:border-butterDeep focus:bg-white/70'
        }`}
      />
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={onCheck}
          className="px-6 py-2.5 rounded-full font-body font-semibold text-twilight bg-butterDeep spring hover:scale-105 hover:bg-butter drop-shadow-[0_0_12px_rgba(255,220,130,0.6)]"
        >
          reveal it
        </button>
        <button
          onClick={() => setShowHint(true)}
          className="px-5 py-2.5 rounded-full font-body text-ink bg-parchmentDeep/20 spring hover:bg-parchmentDeep/40 text-sm backdrop-blur-sm"
        >
          {showHint ? message.hint : 'need a hint?'}
        </button>
      </div>
      {wrong && (
        <p className="mt-4 text-wax font-body text-sm drop-shadow-sm">not quite… try again ✨</p>
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
            background: 'rgba(255,255,255,0.3)',
            border: '2px solid rgba(217,192,138,0.5)',
            boxShadow: '0 8px 30px rgba(217,192,138,0.2)',
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
          <p className="font-serif italic text-2xl text-ink mt-5 drop-shadow-sm">{message.caption}</p>
        )}
        {message.body && (
          <p className="font-body text-ink/90 mt-3 leading-relaxed text-sm drop-shadow-sm">{message.body}</p>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="font-serif text-[22px] font-medium text-ink leading-relaxed whitespace-pre-line drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
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
        fill="#a8c69a"
        opacity="0.5"
      />
      <circle cx="12" cy="12" r="2.5" fill="#f5d76e" opacity="0.9" />
      <path d="M4 4 Q6 10 12 12" stroke="#6f9c63" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}
