import { useEffect, useRef } from 'react';
import { Crown } from 'lucide-react';

const LEADER = {
  name: 'Josy Lira',
  role: 'Líder das Embaixadoras',
  img: 'https://i.imgur.com/IUHnKMa.jpeg',
};

const AMBASSADORS = [
  { name: 'Samara Vaz',          img: 'https://i.imgur.com/TdcKUXN.jpeg', pos: 'center' },
  { name: 'Kely Oliveira',       img: 'https://i.imgur.com/d7CcBMu.jpeg', pos: 'center' },
  { name: 'Priscilla Santana',   img: 'https://i.imgur.com/ebx3JxU.jpeg', pos: 'top' },
  { name: 'Noelia Méndez',       img: 'https://i.imgur.com/p7UNtad.jpeg', pos: 'center' },
  { name: 'Jaqueline Freittas',  img: 'https://i.imgur.com/g6GumsC.jpeg', pos: 'center' },
  { name: 'Maiara Lopes',        img: 'https://i.imgur.com/xNQIc7P.jpeg', pos: 'center' },
  { name: 'Juliana Silva',       img: 'https://i.imgur.com/rkv5HpK.jpeg', pos: 'center' },
  { name: 'Aline Oliveira',      img: 'https://i.imgur.com/gM09pIE.jpeg', pos: 'center' },
  { name: 'Sayonara Prado',      img: 'https://i.imgur.com/JcAMVVt.jpeg', pos: 'center' },
  { name: 'Nadine Carnetti',     img: 'https://i.imgur.com/jAF6mZw.jpeg', pos: 'top' },
  { name: 'Rose Cavalcante',     img: 'https://i.imgur.com/Sc36cIa.jpeg', pos: 'center' },
  { name: 'Luana Oliveira',      img: 'https://i.imgur.com/DnHzBky.jpeg', pos: 'top' },
  { name: 'Alandra Gonçalves',   img: 'https://i.imgur.com/Dj4DYWs.jpeg', pos: 'center' },
];

export default function Ambassadors() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>('.amb-item');
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => setTimeout(() => item.classList.add('visible'), i * 55));
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: '#fdf5f7' }}
    >
      {/* Orbs */}
      <div className="orb animate-glow-pulse w-[600px] h-[600px] top-[-60px] left-1/2 -translate-x-1/2 opacity-28"
        style={{ background: 'radial-gradient(circle, rgba(245,213,220,0.9) 0%, transparent 70%)' }} />
      <div className="orb w-72 h-72 bottom-0 left-[-40px] opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.12) 0%, transparent 70%)' }} />
      <div className="orb w-72 h-72 bottom-0 right-[-40px] opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.12) 0%, transparent 70%)' }} />

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.2) 50%, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6" ref={sectionRef}>
        {/* Header */}
        <div className="amb-item reveal text-center mb-14">
          <p className="font-montserrat text-[11px] tracking-[0.4em] uppercase text-[#c4637a] mb-3">
            Time Oficial
          </p>
          <h2 className="section-title text-[#3d2030] mb-4">Time de Embaixadoras</h2>
          <div className="divider-rose mb-5" />
          <p className="font-cormorant italic text-[#7a5560] max-w-md mx-auto" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>
            Mulheres que representam o melhor da beleza e inspiram a comunidade.
          </p>
        </div>

        {/* Leader */}
        <div className="amb-item reveal flex flex-col items-center mb-16">
          <div className="relative">
            {/* Crown badge */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center animate-float-slow"
                style={{
                  background: 'linear-gradient(135deg, #c9967f, #e8c4a8)',
                  boxShadow: '0 6px 20px rgba(201,150,127,0.55)',
                }}
              >
                <Crown size={18} className="text-white" />
              </div>
            </div>
            {/* Avatar */}
            <div
              className="rounded-full overflow-hidden transition-all duration-500"
              style={{
                width: 150,
                height: 150,
                border: '3px solid #c4637a',
                boxShadow: '0 0 50px rgba(196,99,122,0.4), 0 0 100px rgba(196,99,122,0.12)',
                marginTop: 20,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 70px rgba(196,99,122,0.55), 0 0 140px rgba(196,99,122,0.18)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(196,99,122,0.4), 0 0 100px rgba(196,99,122,0.12)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              <img
                src={LEADER.img}
                alt={LEADER.name}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.88)' }}
              />
            </div>
          </div>
          <h3
            className="font-playfair font-bold text-[#3d2030] mt-5 mb-2"
            style={{ fontSize: '1.55rem' }}
          >
            {LEADER.name}
          </h3>
          <span
            className="font-montserrat text-[11px] tracking-[0.22em] uppercase px-5 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(196,99,122,0.1), rgba(245,213,220,0.22))',
              border: '1px solid rgba(196,99,122,0.2)',
              color: '#c4637a',
            }}
          >
            {LEADER.role}
          </span>
        </div>

        {/* Ambassadors grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {AMBASSADORS.map((amb) => (
            <div
              key={amb.name}
              className="amb-item reveal group flex flex-col items-center gap-2.5 cursor-default"
              style={{ width: 105 }}
            >
              <div
                className="rounded-full overflow-hidden transition-all duration-400"
                style={{
                  width: 84,
                  height: 84,
                  border: '1.5px solid rgba(196,99,122,0.14)',
                  boxShadow: '0 3px 14px rgba(196,99,122,0.08)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(196,99,122,0.48)';
                  el.style.boxShadow = '0 8px 28px rgba(196,99,122,0.22), 0 0 0 3px rgba(196,99,122,0.08)';
                  el.style.transform = 'translateY(-5px) scale(1.06)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(196,99,122,0.14)';
                  el.style.boxShadow = '0 3px 14px rgba(196,99,122,0.08)';
                  el.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <img
                  src={amb.img}
                  alt={amb.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ objectPosition: amb.pos, filter: 'saturate(0.82)', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.4s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.82)'; }}
                />
              </div>
              <span className="font-montserrat text-[11px] text-[#3d2030]/68 text-center font-medium leading-tight">
                {amb.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.15) 50%, transparent)' }} />
    </section>
  );
}
