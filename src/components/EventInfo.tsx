import { useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';

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

const INFO_CARDS = [
  { icon: <Calendar size={22} />, label: 'Data',     value: '20 Setembro 2026', sub: 'Sábado' },
  { icon: <Clock size={22} />,    label: 'Horário',  value: '08:00 às 19:00',  sub: 'Dia completo de imersão' },
  { icon: <MapPin size={22} />,   label: 'Local',    value: 'Marambaia Hotel e Convenções', sub: 'Balneário Camboriú · SC' },
  { icon: <Navigation size={22} />, label: 'Endereço', value: 'Av. Atlântica, 300', sub: 'Balneário Camboriú - SC · 88330-003' },
];

export default function EventInfo() {
  const titleRef = useReveal();
  const quoteRef = useReveal();
  const mapRef   = useReveal();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('.info-card');
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => setTimeout(() => card.classList.add('visible'), i * 110));
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#fdf5f7' }}>
      {/* Orbs */}
      <div className="orb animate-glow-orb w-[500px] h-[500px] top-[-80px] right-[-80px] opacity-55"
        style={{ background: 'radial-gradient(circle, rgba(245,213,220,0.7) 0%, transparent 70%)' }} />
      <div className="orb w-64 h-64 bottom-0 left-0 opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.12) 0%, transparent 70%)' }} />

      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196,99,122,0.2) 40%, rgba(196,99,122,0.35) 50%, rgba(196,99,122,0.2) 60%, transparent 100%)' }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={titleRef} className="reveal text-center mb-14">
          <p className="font-montserrat text-[11px] tracking-[0.4em] uppercase text-[#c4637a] mb-4">
            Detalhes
          </p>
          <h2 className="section-title text-[#3d2030] mb-5">
            Informações do Evento
          </h2>
          <div className="divider-rose mb-5" />
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {INFO_CARDS.map((card, idx) => (
            <div
              key={card.label}
              className="info-card reveal group relative rounded-2xl p-6 text-center cursor-default overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(196,99,122,0.1)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 4px 28px rgba(196,99,122,0.06), inset 0 1px 0 rgba(255,255,255,0.85)',
                transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
                transitionDelay: `${idx * 30}ms`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-8px)';
                el.style.boxShadow = '0 24px 60px rgba(196,99,122,0.16), inset 0 1px 0 rgba(255,255,255,0.9)';
                el.style.borderColor = 'rgba(196,99,122,0.24)';
                el.style.background = 'rgba(255,255,255,0.92)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 4px 28px rgba(196,99,122,0.06), inset 0 1px 0 rgba(255,255,255,0.85)';
                el.style.borderColor = 'rgba(196,99,122,0.1)';
                el.style.background = 'rgba(255,255,255,0.72)';
              }}
            >
              {/* Hover glow accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.5), transparent)' }} />

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(196,99,122,0.1) 0%, rgba(245,213,220,0.3) 100%)',
                  boxShadow: '0 4px 16px rgba(196,99,122,0.08)',
                }}>
                <span className="text-[#c4637a]">{card.icon}</span>
              </div>
              <p className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-[#c4637a]/65 mb-2">
                {card.label}
              </p>
              <p className="font-playfair font-semibold text-[#3d2030] text-base leading-snug mb-1.5">
                {card.value}
              </p>
              <p className="font-montserrat text-[11px] text-[#7a5560]/65 leading-relaxed">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Inspirational title */}
        <div ref={quoteRef} className="reveal text-center py-16">
          <h2
            className="font-playfair font-semibold text-[#3d2030] leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Você não chegou até aqui para{' '}
            <span className="text-gradient-rose italic">viver resultados pequenos.</span>
          </h2>
        </div>

        {/* Map CTA */}
        <div ref={mapRef} className="reveal">
          <a
            href="https://maps.google.com/?q=Marambaia+Convention+Hotel,+Av.+Atlântica+300,+Balneário+Camboriú+SC"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-7 transition-all duration-500 cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(196,99,122,0.12)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 4px 28px rgba(196,99,122,0.07)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 20px 56px rgba(196,99,122,0.16)';
              el.style.borderColor = 'rgba(196,99,122,0.28)';
              el.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 4px 28px rgba(196,99,122,0.07)';
              el.style.borderColor = 'rgba(196,99,122,0.12)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <div className="flex items-center gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(196,99,122,0.12) 0%, rgba(245,213,220,0.3) 100%)',
                  boxShadow: '0 4px 16px rgba(196,99,122,0.1)',
                }}
              >
                <MapPin size={22} className="text-[#c4637a]" />
              </div>
              <div>
                <p className="font-playfair font-semibold text-[#3d2030] text-lg leading-snug mb-0.5">
                  Marambaia Hotel e Convenções
                </p>
                <p className="font-montserrat text-[12px] text-[#7a5560]/70">
                  Av. Atlântica, 300 · Balneário Camboriú - SC · 88330-003
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full flex-shrink-0 transition-all duration-400 group-hover:gap-3"
              style={{
                background: 'linear-gradient(135deg, #c4637a, #d4849a)',
                boxShadow: '0 4px 16px rgba(196,99,122,0.3)',
              }}
            >
              <Navigation size={14} className="text-white" />
              <span className="font-montserrat text-[11px] tracking-[0.18em] uppercase text-white font-semibold">
                Ver no Maps
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(252,232,236,0.4))' }} />
    </section>
  );
}
