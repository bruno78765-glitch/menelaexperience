import { useEffect, useRef } from 'react';

const MAIN_PHOTO = 'https://i.imgur.com/NKkbKce.jpeg';

export default function Experience() {
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [leftRef.current, rightRef.current].filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2d1522 0%, #4a2035 30%, #6b2d4a 60%, #3d2030 100%)',
      }}
    >
      {/* Orbs */}
      <div className="orb animate-glow-orb w-[560px] h-[560px] top-[-120px] right-[-100px]"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.22) 0%, transparent 70%)' }} />
      <div className="orb animate-glow-orb w-[450px] h-[450px] bottom-[-100px] left-[-100px]"
        style={{ background: 'radial-gradient(circle, rgba(201,150,127,0.16) 0%, transparent 70%)', animationDelay: '2s' }} />
      <div className="orb animate-glow-pulse w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(245,213,220,0.06) 0%, transparent 70%)', animationDelay: '1s' }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(245,213,220,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,213,220,0.025) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Diagonal accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute',
          top: '25%', left: '-10%',
          width: '120%', height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(245,213,220,0.06) 30%, rgba(245,213,220,0.14) 50%, rgba(245,213,220,0.06) 70%, transparent 100%)',
          transform: 'rotate(-8deg)',
        }} />
      </div>

      {/* Petals */}
      {[...Array(10)].map((_, i) => {
        const left = `${(i / 10) * 100}%`;
        const dur  = `${10 + (i % 5) * 2.5}s`;
        const del  = `${i * 1.1}s`;
        const sz   = `${13 + (i % 4) * 5}px`;
        return (
          <div key={i} className="petal" style={{
            left, width: sz, height: sz,
            animationDuration: dur, animationDelay: del,
            opacity: 0.28 + (i % 3) * 0.1,
            '--drift': `${(i % 2 === 0 ? 1 : -1) * (50 + i * 12)}px`,
            '--spin': `${200 + i * 40}deg`,
          } as React.CSSProperties}>
            <svg viewBox="0 0 40 40" fill="none">
              <ellipse cx="20" cy="20" rx="11" ry="17" transform="rotate(30 20 20)" fill="rgba(245,213,220,0.65)" />
            </svg>
          </div>
        );
      })}

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,213,220,0.12) 50%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">

          {/* Text */}
          <div ref={leftRef} className="reveal-left flex-1 lg:max-w-xl">
            <h2
              className="font-playfair font-bold mb-6 leading-tight"
              style={{
                fontSize: 'clamp(2.1rem, 5.5vw, 3.8rem)',
                background: 'linear-gradient(180deg, #ffffff 0%, rgba(245,213,220,0.88) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 20px rgba(196,99,122,0.2))',
              }}
            >
              Bem-vinda ao MENELA EXPERIENCE
            </h2>

            {/* Ornamental divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-14 bg-gradient-to-r from-rose-500/45 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" fill="rgba(245,213,220,0.5)" />
              </svg>
              <div className="h-px w-14 bg-gradient-to-l from-rose-500/45 to-transparent" />
            </div>

            <div
              className="font-cormorant italic leading-[1.95] space-y-4"
              style={{ fontSize: 'clamp(1.15rem, 2.1vw, 1.38rem)', color: 'rgba(255,255,255,0.92)' }}
            >
              <p>
                "Temos um time de peso com os melhores profissionais da área, trazendo um evento repleto de networking, conexões únicas e experiências que ficam para a vida toda.
              </p>
              <p>
                Palestras intensas, aprendizado real, resultados ao vivo e uma energia que arrepia.
              </p>
              <p>
                Quem vive o MENELA EXPERIENCE entende: você sai diferente de como entrou."
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: '8+',    label: 'Palestrantes' },
                { value: '1 Dia', label: 'Imersão Total' },
                { value: '∞',     label: 'Transformação' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center py-6 px-3 rounded-2xl relative overflow-hidden cursor-default"
                  style={{
                    background: 'linear-gradient(160deg, rgba(196,99,122,0.22) 0%, rgba(196,99,122,0.08) 100%)',
                    border: '1px solid rgba(196,99,122,0.45)',
                    boxShadow: '0 8px 32px rgba(196,99,122,0.18), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(196,99,122,0.35), inset 0 1px 0 rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(196,99,122,0.18), inset 0 1px 0 rgba(255,255,255,0.1)';
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(245,213,220,0.6), transparent)' }} />
                  <p
                    className="font-playfair font-bold mb-2 leading-none"
                    style={{
                      fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f5d5dc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 2px 8px rgba(196,99,122,0.4))',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="font-montserrat text-[10px] tracking-[0.25em] uppercase font-semibold"
                    style={{ color: 'rgba(245,213,220,0.85)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div ref={rightRef} className="reveal-right flex-1 max-w-lg w-full">
            <div
              className="relative overflow-hidden group"
              style={{
                borderRadius: '28px',
                border: '1px solid rgba(245,213,220,0.14)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,213,220,0.08)',
              }}
            >
              <img
                src={MAIN_PHOTO}
                alt="MENELA EXPERIENCE"
                className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-105"
                style={{ filter: 'saturate(0.85) sepia(0.08)', display: 'block', transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1), filter 0.5s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.95) sepia(0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.85) sepia(0.08)'; }}
              />
              {/* Overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                style={{ background: 'linear-gradient(135deg, rgba(196,99,122,0.12) 0%, transparent 100%)' }}
              />
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 opacity-40"
                style={{ borderTop: '1.5px solid rgba(245,213,220,0.6)', borderLeft: '1.5px solid rgba(245,213,220,0.6)', borderRadius: '4px 0 0 0' }} />
              <div className="absolute bottom-4 right-4 w-8 h-8 opacity-40"
                style={{ borderBottom: '1.5px solid rgba(245,213,220,0.6)', borderRight: '1.5px solid rgba(245,213,220,0.6)', borderRadius: '0 0 4px 0' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #fdf5f7)' }} />
    </section>
  );
}
