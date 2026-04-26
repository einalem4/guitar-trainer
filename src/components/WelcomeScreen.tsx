interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative min-h-screen sm:h-screen bg-[#faf8f4] overflow-y-auto flex flex-col items-center justify-center px-6 py-12">

      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="fret" x="0" y="0" width="48" height="80" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="2" height="80" fill="#92400e" opacity="0.06" />
            <line x1="0" y1="20" x2="48" y2="20" stroke="#78716c" strokeWidth="0.5" opacity="0.08" />
            <line x1="0" y1="35" x2="48" y2="35" stroke="#78716c" strokeWidth="0.5" opacity="0.08" />
            <line x1="0" y1="50" x2="48" y2="50" stroke="#78716c" strokeWidth="0.5" opacity="0.08" />
            <line x1="0" y1="65" x2="48" y2="65" stroke="#78716c" strokeWidth="0.5" opacity="0.08" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fret)" />
      </svg>

      <div className="relative w-full max-w-md flex flex-col gap-8">

        <div className="text-center pb-2">
          <div className="text-6xl mb-4">🎸</div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-4">
            Guitar Trainer
          </h1>
          <p className="text-stone-600 text-base leading-relaxed">
            Memorize note positions on the fretboard. The faster you know
            your notes, the faster you can play.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-white border border-stone-200 border-l-4 border-l-amber-400 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="4" stroke="#92400e" strokeWidth="1.5" />
                <line x1="9.5" y1="9.5" x2="13.5" y2="13.5" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="font-bold text-amber-700 text-sm">Find the Note</p>
            </div>
            <p className="text-stone-600 text-sm leading-snug">
              You are given a note name and a string — tap the correct fret on the fretboard.
            </p>
          </div>
          <div className="bg-white border border-stone-200 border-l-4 border-l-amber-400 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 11V5l6-1.5v2L6 7" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5" cy="11" r="2" fill="#92400e" />
                <circle cx="11" cy="9.5" r="2" fill="#92400e" />
              </svg>
              <p className="font-bold text-amber-700 text-sm">Name the Note</p>
            </div>
            <p className="text-stone-600 text-sm leading-snug">
              A fret position is highlighted — pick the correct note name from four options.
            </p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-4 rounded-xl text-lg transition-all"
        >
          Start Practicing →
        </button>

        <p className="text-center text-xs text-stone-400 -mt-4">
          No account needed. Just pick up and play.
        </p>

      </div>
    </div>
  );
}
