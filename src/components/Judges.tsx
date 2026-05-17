import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

const JUDGES = [
  { name: 'Emily Nunes',      img: 'https://i.imgur.com/nVJ3wpk.jpeg', pos: 'center' },
  { name: 'Silvia Costa',     img: 'https://i.imgur.com/cEeFZ9S.jpeg', pos: 'center' },
  { name: 'Liliana Sosa',     img: 'https://i.imgur.com/jqURak2.jpeg', pos: 'top' },
  { name: 'Beatriz Bandeira', img: 'https://i.imgur.com/mT4gTkt.jpeg', pos: 'center' },
  { name: 'Karol Dias',       img: 'https://i.imgur.com/07cengI.jpeg', pos: 'center' },
];

export default function Judges() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>('.judge-item');
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => setTimeout(() => item.classList.add('visible'), i * 110));
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #140810 0%, #1e0c16 40%, #2a1020 70%, #1a0a10 100%)' }}
    >
      {/* Orbs */}
      <div className="absolute top-[-60px] right-[-100px] w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.16) 0%, transparent 65%)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-[-40px] left-[-80px] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(220,140,160,0.12) 0%, transparent 65%)', filter: 'blur(45px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(196,99,122,0.07) 0%, transparent 70%)' }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.45) 50%, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6" ref={sectionRef}>

        {/* Header */}
        <div className="reveal text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(196,99,122,0.12)',
              border: '1px solid rgba(196,99,122,0.3)',
            }}>
            <Star size={11} className="text-rose-400" />
            <span className="font-montserrat text-[10px] tracking-[0.45em] uppercase text-rose-400">Avaliação</span>
            <Star size={11} className="text-rose-400" />
          </div>

          <h2
            className="font-playfair font-bold mb-5"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #f5d5dc 0%, #e8a0b0 40%, #c4637a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Time de Juradas
          </h2>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.6))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c4637a' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(196,99,122,0.6), transparent)' }} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
          {JUDGES.map((judge, idx) => (
            <div
              key={judge.name}
              className="judge-item reveal group flex flex-col items-center gap-0 cursor-default"
            >
              {/* Photo card */}
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  height: 260,
                  border: '1px solid rgba(196,99,122,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                  transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease, border-color 0.4s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-8px)';
                  el.style.boxShadow = '0 24px 56px rgba(196,99,122,0.3), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)';
                  el.style.borderColor = 'rgba(196,99,122,0.55)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)';
                  el.style.borderColor = 'rgba(196,99,122,0.2)';
                }}
              >
                <img
                  src={judge.img}
                  alt={judge.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: judge.pos }}
                />
                {/* Bottom gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(20,8,16,0.8) 0%, rgba(20,8,16,0.15) 50%, transparent 100%)' }}
                />
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(196,99,122,0.12) 0%, transparent 60%)' }}
                />

                {/* Number badge */}
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(196,99,122,0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(245,213,220,0.2)',
                  }}
                >
                  <span className="font-montserrat text-[10px] font-semibold text-white">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="h-px mb-3"
                    style={{ background: 'linear-gradient(90deg, rgba(196,99,122,0.7), rgba(196,99,122,0.15), transparent)' }} />
                  <h3
                    className="font-playfair font-semibold text-[15px] leading-snug"
                    style={{ color: '#f5d5dc' }}
                  >
                    {judge.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={8} className="text-rose-400 fill-rose-400 opacity-70" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative bottom text */}
        <div className="text-center mt-20">
          <p
            className="font-cormorant italic"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(245,213,220,0.45)',
              letterSpacing: '0.05em',
            }}
          >
            Profissionais que inspiram e elevam o padrão da beleza brasileira.
          </p>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.4) 50%, transparent)' }} />
    </section>
  );
}
