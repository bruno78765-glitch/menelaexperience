import { useEffect, useRef } from 'react';
import { Mic2, Sparkles } from 'lucide-react';

const SPEAKERS = [
  { name: 'Natália Ferreira',        topic: 'A Beleza que Vende no Digital',                                           img: 'https://i.imgur.com/7YQS6qg.jpeg' },
  { name: 'Gabriela Fritsch',        topic: 'Velvet Blush – Lábios Aveludados',                                        img: 'https://i.imgur.com/KooMMgo.jpeg' },
  { name: 'Lord',                    topic: 'Segredos do Brow',                                                         img: 'https://i.imgur.com/Is2t4X7.jpeg' },
  { name: 'Dr. Remi Goulart',        topic: 'Estudo da Pele – Nanotecnologia Aplicada à Função da Pele',               img: 'https://i.imgur.com/m0aygnq.jpeg' },
  { name: 'Jordana Rocha',           topic: 'Micropigmentação com Vida e Textura',                                     img: 'https://i.imgur.com/ykKcXYw.jpeg' },
  { name: 'Fransielli Geviewski',    topic: 'Desafios Emocionais na Área da Beleza',                                   img: 'https://i.imgur.com/VGAidiZ.jpeg' },
  { name: 'Kendra Müller & Bruno Senquitel', topic: 'QREMOVE: Evolução das Sobrancelhas — Tratamento da Pele, do Pelo e do Pigmento', img: 'https://i.imgur.com/tp1S4sw.jpeg' },
  { name: 'Adriane Costa',           topic: 'Saúde Ocular, consequências, mitos e verdades!',                         img: 'https://i.imgur.com/wWkCUJs.jpeg' },
];

export default function Speakers() {
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [titleRef.current, gridRef.current].filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === gridRef.current) {
              const cards = (entry.target as HTMLElement).querySelectorAll<HTMLElement>('.speaker-reveal');
              cards.forEach((card, i) => setTimeout(() => card.classList.add('visible'), i * 90));
            } else {
              (entry.target as HTMLElement).classList.add('visible');
            }
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0a10 0%, #2c1020 40%, #1e0c16 70%, #140810 100%)' }}
    >
      {/* Background texture orbs */}
      <div className="absolute top-[-80px] left-[-120px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(220,140,160,0.13) 0%, transparent 65%)', filter: 'blur(50px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.06) 0%, transparent 60%)' }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.5) 50%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={titleRef} className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(196,99,122,0.12)',
              border: '1px solid rgba(196,99,122,0.3)',
            }}>
            <Sparkles size={12} className="text-rose-400" />
            <span className="font-montserrat text-[10px] tracking-[0.45em] uppercase text-rose-400">Conteúdo</span>
            <Sparkles size={12} className="text-rose-400" />
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
            Palestrantes
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.6))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c4637a' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(196,99,122,0.6), transparent)' }} />
          </div>

          <p
            className="font-cormorant italic max-w-xl mx-auto"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(245,213,220,0.7)' }}
          >
            Profissionais de referência que vão transformar seu olhar sobre a beleza.
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SPEAKERS.map((speaker, idx) => (
            <div
              key={speaker.name}
              className="speaker-reveal reveal group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(196,99,122,0.04) 100%)',
                border: '1px solid rgba(196,99,122,0.18)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
                transitionDelay: `${idx * 25}ms`,
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease, border-color 0.4s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(196,99,122,0.25), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,99,122,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,99,122,0.18)';
              }}
            >
              {/* Photo */}
              <div className="relative overflow-hidden" style={{ height: 300 }}>
                <img
                  src={speaker.img}
                  alt={speaker.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay always present */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(22,8,14,0.85) 0%, rgba(22,8,14,0.2) 50%, transparent 100%)' }}
                />
                {/* Extra hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(196,99,122,0.15) 0%, transparent 60%)' }}
                />

                {/* Badge */}
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(196,99,122,0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245,213,220,0.25)',
                    boxShadow: '0 4px 12px rgba(196,99,122,0.4)',
                  }}
                >
                  <Mic2 size={9} className="text-white" />
                  <span className="font-montserrat text-[9px] tracking-widest uppercase text-white/90">Palestra</span>
                </div>

                {/* Number */}
                <div
                  className="absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="font-montserrat text-[10px] font-semibold text-white/50">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="h-px mb-4"
                  style={{ background: 'linear-gradient(90deg, rgba(196,99,122,0.5), rgba(196,99,122,0.1), transparent)' }} />
                <h3 className="font-playfair font-semibold text-[15px] mb-2 leading-snug"
                  style={{ color: '#f5d5dc' }}>
                  {speaker.name}
                </h3>
                <p className="font-cormorant italic text-sm leading-relaxed"
                  style={{ color: 'rgba(220,160,175,0.8)' }}>
                  "{speaker.topic}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer fade */}
        <div className="text-center mt-14 mb-4">
          <p
            className="font-cormorant italic"
            style={{
              fontSize: 'clamp(1.35rem, 3vw, 1.9rem)',
              background: 'linear-gradient(135deg, #f5d5dc, #c4637a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            E muito mais…
          </p>

          <div className="mt-16 text-center">
            <p className="font-montserrat text-[11px] tracking-[0.35em] uppercase text-rose-400 font-semibold mb-3">
              Conheça
            </p>
            <h2
              className="font-playfair font-bold"
              style={{
                fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: '#f5d5dc',
              }}
            >
              Nosso Time de{' '}
              <span style={{
                background: 'linear-gradient(135deg, #c4637a, #e8a0b0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Juradas Oficiais
              </span>
            </h2>
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.6))' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c4637a' }} />
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(196,99,122,0.6), transparent)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.4) 50%, transparent)' }} />
    </section>
  );
}
