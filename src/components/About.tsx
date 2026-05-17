import { useEffect, useRef } from 'react';
import { Sparkles, Users, Trophy, Star, Mic, Crown, Gift } from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const HIGHLIGHTS = [
  {
    icon: <Mic size={26} />,
    title: 'Momento MENELA',
    desc: 'Um momento único que marca a essência do evento.',
    accent: 'rgba(196,99,122,1)',
    glow: 'rgba(196,99,122,0.4)',
    num: '01',
  },
  {
    icon: <Sparkles size={26} />,
    title: 'Momento Experience',
    desc: 'Experiência sensorial e emocional inesquecível.',
    accent: 'rgba(212,132,154,1)',
    glow: 'rgba(212,132,154,0.4)',
    num: '02',
  },
  {
    icon: <Gift size={26} />,
    title: 'Sorteios Exclusivos',
    desc: 'Prêmios e surpresas especiais para as participantes.',
    accent: 'rgba(196,99,122,1)',
    glow: 'rgba(196,99,122,0.4)',
    num: '03',
  },
  {
    icon: <Users size={26} />,
    title: 'Networking Real',
    desc: 'Conexões de alto valor com profissionais da área.',
    accent: 'rgba(212,132,154,1)',
    glow: 'rgba(212,132,154,0.4)',
    num: '04',
  },
  {
    icon: <Trophy size={26} />,
    title: 'Campeonato Online',
    desc: 'Competição com reconhecimento nacional.',
    accent: 'rgba(196,99,122,1)',
    glow: 'rgba(196,99,122,0.4)',
    num: '05',
  },
  {
    icon: <Crown size={26} />,
    title: 'Momento das Embaixadoras',
    desc: 'Celebração e reconhecimento das embaixadoras.',
    accent: 'rgba(212,132,154,1)',
    glow: 'rgba(212,132,154,0.4)',
    num: '06',
  },
  {
    icon: <Star size={26} />,
    title: 'Surpresas ao Longo do Evento',
    desc: 'Momentos especiais preparados com muito carinho.',
    accent: 'rgba(196,99,122,1)',
    glow: 'rgba(196,99,122,0.4)',
    num: '07',
  },
];

export default function About() {
  const titleRef = useReveal();
  const textRef  = useReveal();
  const gridRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('.about-card');
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => setTimeout(() => card.classList.add('visible'), i * 90));
          obs.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #fdf5f7 0%, #fce8ec 40%, #fdf5f7 70%, #fce8ec 100%)',
      }}
    >
      {/* Background orbs */}
      <div className="orb animate-glow-orb w-[520px] h-[520px] top-[-60px] left-[-120px] opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.18) 0%, transparent 70%)' }} />
      <div className="orb animate-glow-orb w-[480px] h-[480px] bottom-[-40px] right-[-100px] opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(201,150,127,0.22) 0%, transparent 70%)', animationDelay: '2.5s' }} />
      <div className="orb w-72 h-72 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(245,213,220,0.5) 0%, transparent 70%)' }} />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196,99,122,0.2) 40%, rgba(196,99,122,0.35) 50%, rgba(196,99,122,0.2) 60%, transparent 100%)' }} />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: 'radial-gradient(circle, rgba(196,99,122,0.12) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }} />

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div ref={titleRef} className="reveal text-center mb-6">
          <p className="font-montserrat text-[11px] tracking-[0.4em] uppercase text-[#c4637a] mb-4">
            O Evento
          </p>
          <h2
            className="font-playfair font-semibold text-[#3d2030] mb-5 leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)' }}
          >
            Uma Experiência que Vai{' '}
            <span className="text-gradient-rose italic">Muito Além do Palco</span>
          </h2>
          <div className="divider-rose" />
        </div>

        {/* Intro quote */}
        <div ref={textRef} className="reveal max-w-2xl mx-auto text-center mb-20">
          <p
            className="font-cormorant italic text-[#5a3a45] leading-loose"
            style={{ fontSize: 'clamp(1.05rem, 2.1vw, 1.28rem)' }}
          >
            "Este não será apenas mais um evento.
            <br />
            É uma imersão criada para conectar você a novas ideias, novas pessoas e ao seu próprio potencial."
          </p>
        </div>

        {/* Cards grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item, idx) => {
            const isLast = idx === HIGHLIGHTS.length - 1;
            return (
              <div
                key={item.title}
                className={`about-card reveal group relative rounded-3xl overflow-hidden cursor-default${isLast ? ' sm:col-span-2 lg:col-span-3 lg:max-w-sm lg:mx-auto' : ''}`}
                style={{
                  background: 'rgba(255,255,255,0.72)',
                  border: '1px solid rgba(196,99,122,0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 40px rgba(196,99,122,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
                  transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                  transitionDelay: `${idx * 60}ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-10px)';
                  el.style.boxShadow = `0 32px 72px rgba(196,99,122,0.18), inset 0 1px 0 rgba(255,255,255,0.95)`;
                  el.style.borderColor = 'rgba(196,99,122,0.28)';
                  el.style.background = 'rgba(255,255,255,0.92)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 8px 40px rgba(196,99,122,0.07), inset 0 1px 0 rgba(255,255,255,0.9)';
                  el.style.borderColor = 'rgba(196,99,122,0.1)';
                  el.style.background = 'rgba(255,255,255,0.72)';
                }}
              >
                {/* Top gradient bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`, opacity: 0.5 }}
                />

                <div className="p-8">
                  {/* Number + icon row */}
                  <div className="flex items-start justify-between mb-6">
                    {/* Big number */}
                    <span
                      className="font-playfair font-bold leading-none select-none"
                      style={{
                        fontSize: '4.5rem',
                        background: `linear-gradient(135deg, rgba(196,99,122,0.12), rgba(196,99,122,0.04))`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1,
                      }}
                    >
                      {item.num}
                    </span>

                    {/* Icon bubble */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-400 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, rgba(196,99,122,0.13) 0%, rgba(245,213,220,0.35) 100%)`,
                        boxShadow: `0 4px 20px ${item.glow}`,
                        border: '1px solid rgba(196,99,122,0.15)',
                      }}
                    >
                      <span style={{ color: item.accent }}>{item.icon}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px mb-5 transition-all duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, ${item.accent}55, transparent)`,
                      opacity: 0.4,
                    }}
                  />

                  {/* Title */}
                  <h3
                    className="font-playfair font-bold text-[#3d2030] mb-3 leading-snug"
                    style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.28rem)' }}
                  >
                    {item.title}
                  </h3>

                  {/* Desc */}
                  <p className="font-montserrat text-[12.5px] text-[#7a5560]/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom glow on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.accent}80, transparent)` }}
                />

                {/* Corner light effect */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${item.glow}, transparent 70%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196,99,122,0.15) 50%, transparent 100%)' }} />
    </section>
  );
}
