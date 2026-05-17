import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function CEO() {
  const leftRef   = useReveal();
  const rightRef  = useReveal();
  const videoRef  = useReveal();
  const [playing, setPlaying] = useState(false);
  const videoElRef = useRef<HTMLVideoElement>(null);

  function handlePlay() {
    setPlaying(true);
    videoElRef.current?.play();
  }

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2d1522 0%, #4a2035 30%, #6b2d4a 60%, #3d2030 100%)',
      }}
    >
      {/* Orbs */}
      <div className="orb animate-glow-orb w-[580px] h-[580px] top-[-120px] left-[-160px]"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.22) 0%, transparent 70%)' }} />
      <div className="orb animate-glow-orb w-[450px] h-[450px] bottom-[-60px] right-[-100px]"
        style={{ background: 'radial-gradient(circle, rgba(201,150,127,0.16) 0%, transparent 70%)', animationDelay: '2.5s' }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(245,213,220,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,213,220,0.025) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,213,220,0.12) 50%, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left: Visual */}
          <div ref={leftRef} className="reveal-left flex-shrink-0 relative">
            {/* Animated conic ring */}
            <div
              className="absolute inset-[-20px] rounded-full animate-glow-pulse pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, rgba(196,99,122,0.65) 0%, transparent 35%, rgba(245,213,220,0.45) 65%, transparent 100%)',
                filter: 'blur(2px)',
              }}
            />
            {/* Secondary ring */}
            <div
              className="absolute inset-[-8px] rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 180deg, transparent 0%, rgba(245,213,220,0.2) 50%, transparent 100%)',
                filter: 'blur(1px)',
              }}
            />
            {/* Avatar */}
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden animate-float-slow"
              style={{
                background: 'linear-gradient(135deg, rgba(196,99,122,0.3) 0%, rgba(245,213,220,0.2) 100%)',
                border: '2px solid rgba(245,213,220,0.28)',
                boxShadow: '0 0 80px rgba(196,99,122,0.35), 0 0 160px rgba(196,99,122,0.1)',
              }}
            >
              <img
                src="/WhatsApp_Image_2026-02-20_at_19.44.59_(1).jpeg"
                alt="Edna Mari — CEO MENELA EXPERIENCE"
                className="w-full h-full object-cover object-center"
                style={{ filter: 'saturate(0.88)' }}
              />
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent 45%, rgba(61,32,48,0.45) 100%)' }} />
            </div>

            {/* Label badge */}
            <div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #c4637a, #d4849a)',
                boxShadow: '0 10px 28px rgba(196,99,122,0.55)',
              }}
            >
              <span className="font-montserrat text-[11px] font-bold tracking-[0.28em] uppercase text-white">
                CEO & FUNDADORA
              </span>
            </div>
          </div>

          {/* Right: Content */}
          <div ref={rightRef} className="reveal-right flex-1 text-center lg:text-left">
            <p className="font-montserrat text-[11px] tracking-[0.4em] uppercase text-rose-300/65 mb-4">
              Quem está por trás
            </p>
            <h2
              className="font-playfair font-bold mb-2 leading-tight"
              style={{
                fontSize: 'clamp(2.8rem, 6.5vw, 4.8rem)',
                background: 'linear-gradient(180deg, #ffffff 0%, rgba(245,213,220,0.92) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 16px rgba(196,99,122,0.2))',
              }}
            >
              Edna Mari
            </h2>
            <p
              className="font-cormorant italic text-rose-300/65 mb-8"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.32rem)' }}
            >
              CEO do MENELA EXPERIENCE
            </p>

            {/* Ornamental divider */}
            <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
              <div className="h-px w-14 bg-gradient-to-r from-rose-500/45 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" fill="rgba(245,213,220,0.5)" />
              </svg>
              <div className="h-px w-14 bg-gradient-to-l from-rose-500/45 to-transparent" />
            </div>

            <p
              className="font-cormorant italic leading-[1.9] mb-8"
              style={{ fontSize: 'clamp(1.05rem, 1.85vw, 1.28rem)', color: 'rgba(255,255,255,0.92)' }}
            >
              "Por trás do MENELA EXPERIENCE está uma visão ousada: criar o espaço que cada profissional de beleza merece. Um evento construído com propósito, amor e a convicção de que quando mulheres se unem, o mundo se transforma."
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {['Empreendedora', 'Visionária', 'Líder', 'Inspiração'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full font-montserrat text-[11px] tracking-wider transition-all duration-300"
                  style={{
                    background: 'rgba(196,99,122,0.14)',
                    border: '1px solid rgba(196,99,122,0.28)',
                    color: 'rgba(245,213,220,0.78)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(196,99,122,0.24)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,99,122,0.5)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(196,99,122,0.14)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,99,122,0.28)';
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Video */}
        <div ref={videoRef} className="reveal mt-20 max-w-3xl mx-auto">
          {/* Label */}
          <div className="text-center mb-6">
            <p className="font-montserrat text-[11px] tracking-[0.4em] uppercase text-rose-300/55 mb-2">
              Mensagem da CEO
            </p>
            <h3
              className="font-playfair font-semibold"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                background: 'linear-gradient(180deg, #ffffff 0%, rgba(245,213,220,0.88) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Uma palavra de quem criou tudo isso
            </h3>
          </div>

          {/* Player */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              boxShadow: '0 0 80px rgba(196,99,122,0.35), 0 32px 64px rgba(0,0,0,0.45)',
              border: '1px solid rgba(245,213,220,0.12)',
            }}
          >
            <video
              ref={videoElRef}
              src="https://i.imgur.com/REKX2Lu.mp4"
              className="w-full block"
              style={{ aspectRatio: '9/16', maxHeight: '85vh', objectFit: 'contain', background: '#1a0d14' }}
              controls={playing}
              playsInline
              onPlay={() => setPlaying(true)}
            />

            {/* Custom play overlay */}
            {!playing && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 group"
                style={{ background: 'linear-gradient(to top, rgba(45,21,34,0.85) 0%, rgba(45,21,34,0.35) 60%, transparent 100%)' }}
              >
                {/* Ring + play icon */}
                <div className="relative flex items-center justify-center">
                  <div
                    className="absolute w-28 h-28 rounded-full animate-ping"
                    style={{ background: 'rgba(196,99,122,0.15)', animationDuration: '2s' }}
                  />
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #c4637a, #d4849a)',
                      boxShadow: '0 0 48px rgba(196,99,122,0.65)',
                    }}
                  >
                    <Play size={28} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-playfair italic text-white/90" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                    Assista a mensagem da Edna Mari
                  </p>
                  <p className="font-montserrat text-[11px] tracking-[0.2em] uppercase text-rose-300/60 mt-1">
                    CEO & Fundadora
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #fdf5f7)' }} />
    </section>
  );
}
