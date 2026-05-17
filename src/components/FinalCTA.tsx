import { useEffect, useRef } from 'react';

const PETALS_CTA = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i / 14) * 100 + (Math.random() - 0.5) * 7}%`,
  duration: `${9 + Math.random() * 12}s`,
  delay: `${Math.random() * 9}s`,
  size: `${11 + Math.random() * 18}px`,
  drift: `${(Math.random() - 0.5) * 130}px`,
  spin: `${180 + Math.random() * 380}deg`,
  opacity: 0.3 + Math.random() * 0.38,
}));

const SPARKLES_CTA = [
  { top: '14%', left: '7%',  delay: '0s',   size: 8 },
  { top: '72%', left: '91%', delay: '1.3s', size: 5 },
  { top: '32%', left: '86%', delay: '0.7s', size: 6 },
  { top: '82%', left: '11%', delay: '2.1s', size: 7 },
  { top: '50%', left: '95%', delay: '1.8s', size: 4 },
];

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(160deg, #2d1522 0%, #5a2035 30%, #7a3050 55%, #4a2638 80%, #2d1522 100%)',
        minHeight: '75vh',
        paddingTop: '7rem',
        paddingBottom: '7rem',
      }}
    >
      {/* Orbs */}
      <div className="orb animate-glow-orb w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.2) 0%, transparent 70%)' }} />
      <div className="orb animate-glow-orb w-[450px] h-[450px] top-[-80px] left-[-60px]"
        style={{ background: 'radial-gradient(circle, rgba(245,213,220,0.12) 0%, transparent 70%)', animationDelay: '1.5s' }} />
      <div className="orb animate-glow-orb w-[450px] h-[450px] bottom-[-80px] right-[-60px]"
        style={{ background: 'radial-gradient(circle, rgba(201,150,127,0.14) 0%, transparent 70%)', animationDelay: '3s' }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(245,213,220,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,213,220,0.025) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Petals */}
      {PETALS_CTA.map((p) => (
        <div key={p.id} className="petal" style={{
          left: p.left, width: p.size, height: p.size,
          animationDuration: p.duration, animationDelay: p.delay,
          opacity: p.opacity,
          '--drift': p.drift, '--spin': p.spin,
        } as React.CSSProperties}>
          <svg viewBox="0 0 40 40" fill="none">
            <ellipse cx="20" cy="20" rx="11" ry="17" transform="rotate(30 20 20)" fill="rgba(245,213,220,0.68)" />
          </svg>
        </div>
      ))}

      {/* Sparkles */}
      {SPARKLES_CTA.map((s, i) => (
        <div key={i} className="sparkle absolute pointer-events-none"
          style={{ top: s.top, left: s.left, animationDuration: `${2.4 + i * 0.45}s`, animationDelay: s.delay }}>
          <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" fill="rgba(245,213,220,0.72)" />
          </svg>
        </div>
      ))}

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,213,220,0.15) 50%, transparent)' }} />

      <div ref={ref} className="reveal relative z-10 max-w-3xl mx-auto px-6 text-center">

        {/* Badge */}
        <div
          className="badge-pulse inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full"
          style={{
            background: 'rgba(196,99,122,0.14)',
            border: '1px solid rgba(196,99,122,0.32)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="font-montserrat text-[11px] tracking-[0.28em] uppercase text-rose-200/75">
            Vagas Limitadas
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-playfair font-bold mb-6 leading-tight"
          style={{
            fontSize: 'clamp(2.6rem, 7.5vw, 5.2rem)',
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(245,213,220,0.92) 55%, rgba(196,99,122,0.68) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 32px rgba(196,99,122,0.3))',
          }}
        >
          Sua Evolução Começa Aqui.
        </h2>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-rose-400/38" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" fill="rgba(245,213,220,0.55)" />
          </svg>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-rose-400/38" />
        </div>

        {/* Subtext */}
        <p
          className="font-cormorant italic mb-10 leading-[1.85]"
          style={{ color: 'rgba(255,255,255,0.92)', fontSize: 'clamp(1.15rem, 2.6vw, 1.55rem)' }}
        >
          {"Você pode assistir de longe…"}
          <br />
          {"ou viver uma experiência capaz de transformar sua trajetória."}
        </p>
        {/* Date chip */}
        <div
          className="inline-flex items-center gap-2 mb-10 px-5 py-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(245,213,220,0.14)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="font-montserrat text-[11px] tracking-wider" style={{ color: 'rgba(255,255,255,0.82)' }}>
            20 de Setembro de 2026 — Balneário Camboriú, SC
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/5521969129464"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary animate-cta-glow px-10 py-4 rounded-full text-[12px] inline-flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #c4637a 0%, #d4849a 100%)',
              color: 'white',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <span className="relative z-10">GARANTIR MINHA VAGA AGORA</span>
          </a>
          <a
            href="https://wa.me/5521969129464"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full text-[12px] inline-flex items-center justify-center transition-all duration-400"
            style={{
              border: '1.5px solid rgba(245,213,220,0.34)',
              color: 'rgba(245,213,220,0.86)',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(245,213,220,0.09)';
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = '0 12px 32px rgba(196,99,122,0.22)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
            }}
          >
            FALAR COM SUPORTE VIP
          </a>
        </div>
      </div>
    </section>
  );
}
