import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const SLIDES = [
  { img: 'https://i.imgur.com/OVOWpJZ.jpeg' },
  { img: 'https://i.imgur.com/jH8bfWm.jpeg' },
  { img: 'https://i.imgur.com/EK9Jopv.jpeg' },
  { img: 'https://i.imgur.com/pHtKFFv.jpeg' },
  { img: 'https://i.imgur.com/lzzIelA.jpeg' },
];

const AUTOPLAY_MS = 4200;

export default function Testimonials() {
  const [active, setActive]       = useState(0);
  const [prev, setPrev]           = useState<number | null>(null);
  const [dir, setDir]             = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const headRef                   = useRef<HTMLDivElement>(null);

  const go = useCallback((to: number, direction: 'next' | 'prev') => {
    if (animating) return;
    setDir(direction);
    setPrev(active);
    setActive(to);
    setAnimating(true);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 540);
  }, [active, animating]);

  const next = useCallback(() => go((active + 1) % SLIDES.length, 'next'), [active, go]);
  const back = useCallback(() => go((active - 1 + SLIDES.length) % SLIDES.length, 'prev'), [active, go]);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTOPLAY_MS);
  };

  const handleNext = () => { next(); resetTimer(); };
  const handleBack = () => { back(); resetTimer(); };
  const handleDot  = (i: number) => {
    if (i === active) return;
    go(i, i > active ? 'next' : 'prev');
    resetTimer();
  };

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const slideEnter  = dir === 'next' ? 'translateX(7%)  scale(0.96)' : 'translateX(-7%) scale(0.96)';
  const slideExit   = dir === 'next' ? 'translateX(-5%) scale(0.97)' : 'translateX(5%)  scale(0.97)';

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #3d2030 0%, #5c2840 50%, #3d2030 100%)' }}
    >
      {/* Orbs */}
      <div className="orb w-[700px] h-[700px] top-[-150px] left-[-200px] opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.45) 0%, transparent 65%)' }} />
      <div className="orb w-[500px] h-[500px] bottom-[-100px] right-[-100px] opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(245,213,220,0.4) 0%, transparent 65%)' }} />

      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(245,213,220,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,213,220,0.2) 50%, transparent)' }} />

      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div ref={headRef} className="reveal text-center mb-14">
          <p className="font-montserrat text-[11px] tracking-[0.4em] uppercase mb-4"
            style={{ color: 'rgba(245,213,220,0.5)' }}>
            Depoimentos
          </p>
          <h2
            className="font-playfair font-bold leading-tight text-white mb-5"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}
          >
            O que dizem quem{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f5d5dc, #e8829a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              já viveu
            </span>
          </h2>
          <div className="w-20 h-px mx-auto"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.6), transparent)' }} />
        </div>

        {/* Carousel */}
        <div className="relative flex flex-col items-center">

          {/* Stage */}
          <div
            className="relative w-full overflow-hidden"
            style={{ borderRadius: '2rem' }}
          >
            {/* Quote icon watermark */}
            <div className="absolute top-6 left-8 z-10 pointer-events-none opacity-20">
              <Quote size={52} style={{ color: '#f5d5dc', transform: 'scaleX(-1)' }} />
            </div>

            {/* Slides */}
            <div className="relative" style={{ aspectRatio: '16/9', maxHeight: 520 }}>

              {/* Previous slide (exiting) */}
              {prev !== null && (
                <div
                  key={`prev-${prev}`}
                  className="absolute inset-0"
                  style={{
                    animation: `slideOut${dir === 'next' ? 'Left' : 'Right'} 540ms cubic-bezier(0.4,0,0.2,1) forwards`,
                  }}
                >
                  <img
                    src={SLIDES[prev].img}
                    alt={`Depoimento ${prev + 1}`}
                    className="w-full h-full object-contain"
                    style={{ background: '#1a0d14' }}
                  />
                </div>
              )}

              {/* Active slide (entering) */}
              <div
                key={`active-${active}`}
                className="absolute inset-0"
                style={{
                  transform: prev !== null ? slideEnter : 'none',
                  opacity: prev !== null ? 0 : 1,
                  animation: prev !== null
                    ? `slideIn${dir === 'next' ? 'Right' : 'Left'} 540ms cubic-bezier(0.4,0,0.2,1) forwards`
                    : 'none',
                }}
              >
                <img
                  src={SLIDES[active].img}
                  alt={`Depoimento ${active + 1}`}
                  className="w-full h-full object-contain"
                  style={{ background: '#1a0d14' }}
                />
              </div>

              {/* Subtle vignette */}
              <div className="absolute inset-0 pointer-events-none rounded-[2rem]"
                style={{ boxShadow: 'inset 0 0 80px rgba(61,32,48,0.55)' }} />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-6 mt-8">
            {/* Prev button */}
            <button
              onClick={handleBack}
              aria-label="Anterior"
              className="group flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: 48,
                height: 48,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(245,213,220,0.15)',
                color: 'rgba(245,213,220,0.7)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'rgba(196,99,122,0.25)';
                el.style.borderColor = 'rgba(196,99,122,0.5)';
                el.style.color = '#f5d5dc';
                el.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'rgba(255,255,255,0.07)';
                el.style.borderColor = 'rgba(245,213,220,0.15)';
                el.style.color = 'rgba(245,213,220,0.7)';
                el.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDot(i)}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  style={{
                    width: i === active ? 28 : 8,
                    height: 8,
                    borderRadius: 9999,
                    background: i === active
                      ? 'linear-gradient(90deg, #c4637a, #e8829a)'
                      : 'rgba(245,213,220,0.25)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: i === active ? '0 0 12px rgba(196,99,122,0.55)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              aria-label="Próximo"
              className="group flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: 48,
                height: 48,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(245,213,220,0.15)',
                color: 'rgba(245,213,220,0.7)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'rgba(196,99,122,0.25)';
                el.style.borderColor = 'rgba(196,99,122,0.5)';
                el.style.color = '#f5d5dc';
                el.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'rgba(255,255,255,0.07)';
                el.style.borderColor = 'rgba(245,213,220,0.15)';
                el.style.color = 'rgba(245,213,220,0.7)';
                el.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Counter */}
          <p className="font-montserrat mt-4"
            style={{ fontSize: '11px', color: 'rgba(245,213,220,0.35)', letterSpacing: '0.2em' }}>
            {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,213,220,0.15) 50%, transparent)' }} />

      {/* Keyframes injected */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(7%) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)  scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-7%) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0)   scale(1); }
          to   { opacity: 0; transform: translateX(-5%) scale(0.97); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0)  scale(1); }
          to   { opacity: 0; transform: translateX(5%) scale(0.97); }
        }
      `}</style>
    </section>
  );
}
