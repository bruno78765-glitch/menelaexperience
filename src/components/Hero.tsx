import { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Calendar, ChevronDown } from 'lucide-react';

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number;
}

function useCountdown(target: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

const EVENT_DATE = new Date('2026-09-20T08:00:00-03:00');

const SPARKLES = [
  { top: '18%', left: '8%',  delay: '0s',   size: 5 },
  { top: '25%', left: '88%', delay: '1.3s', size: 4 },
  { top: '60%', left: '5%',  delay: '2.4s', size: 4 },
  { top: '42%', left: '92%', delay: '0.7s', size: 6 },
  { top: '75%', left: '18%', delay: '1.9s', size: 3 },
  { top: '12%', left: '70%', delay: '3.2s', size: 5 },
  { top: '55%', left: '80%', delay: '0.4s', size: 3 },
];

export default function Hero() {
  const timeLeft  = useCountdown(EVENT_DATE);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded]         = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const pad = (n: number) => String(n).padStart(2, '0');

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Parallax video on scroll */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onScroll = () => {
      vid.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.12}px))`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Reveal content section when it enters viewport */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setContentVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════
          SEÇÃO 1 — VÍDEO FULLSCREEN (intro puro)
      ══════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden" style={{ background: '#060104' }}>

        {/* Vídeo */}
        <div
          className="absolute inset-0"
          style={{
            opacity: videoReady && loaded ? 1 : 0,
            transition: 'opacity 2.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
            }}
          >
            <source src="https://i.imgur.com/1VzFW4R.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Fallback gradiente enquanto carrega */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(160deg, #2d1522 0%, #4a2035 35%, #6b2d4a 65%, #2d1522 100%)',
            opacity: videoReady ? 0 : 1,
            transition: 'opacity 2s ease',
          }}
        />

        {/* Escurecimento base — mais suave no mobile para o vídeo aparecer melhor */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(6,1,4,0.22)' }} />

        {/* Vinheta perimetral — menor no mobile */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 90% 85% at 50% 40%, transparent 25%, rgba(4,0,3,0.72) 100%)',
          }} />

        {/* Glow rosé central */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(196,99,122,0.14) 0%, transparent 65%)',
          }} />

        {/* Letterbox topo */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '12vh', background: 'linear-gradient(to bottom, rgba(4,0,3,0.9), transparent)' }} />

        {/* Letterbox rodapé */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '22vh', background: 'linear-gradient(to top, rgba(4,0,3,1) 0%, rgba(4,0,3,0.5) 50%, transparent 100%)' }} />

        {/* Sparkles */}
        {SPARKLES.map((s, i) => (
          <div key={i} className="sparkle absolute pointer-events-none"
            style={{
              top: s.top, left: s.left,
              animationDuration: `${3 + (i % 3) * 0.9}s`,
              animationDelay: s.delay,
              opacity: 0.45,
            }}>
            <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" fill="rgba(245,213,220,0.9)" />
            </svg>
          </div>
        ))}

        {/* Seta de scroll */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float z-10"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1.5s ease 2s',
          }}
        >
          <span className="font-montserrat text-[9px] tracking-[0.4em] uppercase"
            style={{ color: 'rgba(245,213,220,0.5)' }}>
            Scroll
          </span>
          <ChevronDown size={14} style={{ color: 'rgba(245,213,220,0.5)' }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SEÇÃO 2 — CONTEÚDO (sobre fundo escuro)
      ══════════════════════════════════════════ */}
      <section
        ref={contentRef}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #060104 0%, #1a0a12 35%, #2d1522 70%, #3d1e2e 100%)',
          paddingBottom: '6rem',
        }}
      >
        {/* Orbs decorativos */}
        <div className="orb w-[600px] h-[600px] top-0 left-[-150px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.14) 0%, transparent 68%)', filter: 'blur(100px)' }} />
        <div className="orb w-[500px] h-[500px] bottom-[-100px] right-[-100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.1) 0%, transparent 68%)', filter: 'blur(80px)' }} />

        {/* Grid sutil */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(245,213,220,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,213,220,0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        <div
          className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center pt-16 sm:pt-20"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 1.2s cubic-bezier(0.22,1,0.36,1), transform 1.2s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Subtítulo da seção */}
          <p
            className="font-cormorant italic mb-6 max-w-2xl leading-relaxed"
            style={{
              fontSize: 'clamp(1.15rem, 4.5vw, 1.6rem)',
              color: 'rgba(245,213,220,0.9)',
            }}
          >
            A experiência que conecta profissionais, desperta evolução e transforma trajetórias.
          </p>

          {/* Divisor */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.5))' }} />
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" fill="rgba(196,99,122,0.65)" />
            </svg>
            <div className="h-px w-16" style={{ background: 'linear-gradient(270deg, transparent, rgba(196,99,122,0.5))' }} />
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: <Calendar size={14} />, text: '20 Setembro 2026' },
              { icon: <Clock size={14} />,    text: '08:00 às 19:00' },
              { icon: <MapPin size={14} />,   text: 'Balneário Camboriú · SC' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: 'rgba(40,12,24,0.9)',
                  border: '1px solid rgba(196,99,122,0.35)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}>
                <span style={{ color: 'rgba(220,150,168,1)' }}>{item.icon}</span>
                <span className="font-montserrat text-[12px] font-semibold tracking-wide"
                  style={{ color: 'rgba(245,213,220,0.95)' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div className="mb-12 w-full max-w-md">
            <p className="font-montserrat text-[10px] tracking-[0.4em] uppercase mb-5"
              style={{ color: 'rgba(196,99,122,0.75)' }}>
              Contagem Regressiva
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: pad(timeLeft.days),    label: 'Dias' },
                { value: pad(timeLeft.hours),   label: 'Horas' },
                { value: pad(timeLeft.minutes), label: 'Min' },
                { value: pad(timeLeft.seconds), label: 'Seg' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center py-6 px-2 rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'rgba(30,10,20,0.92)',
                    border: '1px solid rgba(196,99,122,0.4)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}>
                  <div className="absolute inset-x-0 bottom-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.6), transparent)' }} />
                  <span className="countdown-digit">{item.value}</span>
                  <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase mt-1.5"
                    style={{ color: 'rgba(245,213,220,0.65)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <a href="https://wa.me/5521969129464" target="_blank" rel="noopener noreferrer"
              className="btn-primary animate-cta-glow flex-1 flex items-center justify-center px-8 py-4 rounded-full text-[12px]">
              <span className="relative z-10">GARANTIR MINHA VAGA</span>
            </a>
            <a href="https://wa.me/5521969129464" target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center px-8 py-4 rounded-full text-[12px] font-montserrat font-semibold tracking-widest uppercase"
              style={{
                border: '1.5px solid rgba(196,99,122,0.45)',
                color: 'rgba(245,213,220,0.95)',
                background: 'rgba(40,12,24,0.9)',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(196,99,122,0.15)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(196,99,122,0.28)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}>
              SUPORTE VIP
            </a>
          </div>
        </div>

        {/* Transição para EventInfo */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '120px', background: 'linear-gradient(to bottom, transparent, #fdf5f7)' }} />
      </section>
    </>
  );
}
