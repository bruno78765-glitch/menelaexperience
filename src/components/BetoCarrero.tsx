import { useEffect, useRef } from 'react';
import { MapPin, CreditCard, Hotel, ChevronRight } from 'lucide-react';

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

const BENEFITS = [
  { label: 'Ingresso incluso' },
  { label: 'Transfer ida e volta' },
  { label: 'Conforto e segurança' },
  { label: 'Atendimento personalizado' },
  { label: 'Parcelamento facilitado' },
];

export default function BetoCarrero() {
  const headRef  = useReveal(0.1);
  const leftRef  = useReveal(0.08);
  const rightRef = useReveal(0.08);

  return (
    <section className="relative overflow-hidden" style={{ background: '#fdf5f7' }}>

      {/* ── Full-bleed hero banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(320px, 42vw, 520px)' }}>
        <img
          src="https://i.imgur.com/gIydCOA.jpeg"
          alt="Parque temático"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 60%', filter: 'brightness(0.55) saturate(0.8)' }}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(61,32,48,0.25) 0%, rgba(61,32,48,0.75) 80%, #fdf5f7 100%)' }} />

        {/* Badge + Headline — stacked vertically, centered, anchored to bottom */}
        <div ref={headRef} className="reveal absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6 pb-10 sm:pb-14 text-center">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: 'rgba(196,99,122,0.28)',
              border: '1px solid rgba(245,213,220,0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <MapPin size={12} className="text-rose-200" />
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-rose-100/90 whitespace-nowrap">
              Passeio Opcional · Beto Carrero World
            </span>
          </div>

          <h2
            className="font-playfair font-bold leading-tight text-white"
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 3.6rem)',
              textShadow: '0 4px 32px rgba(0,0,0,0.5)',
            }}
          >
            Transforme sua viagem em uma{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f5d5dc, #e8829a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              experiência inesquecível
            </span>
          </h2>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-28" style={{ marginTop: '-2px' }}>

        {/* Subtitle */}
        <div className="text-center pt-10 sm:pt-12 pb-10 sm:pb-14 max-w-2xl mx-auto">
          <p
            className="font-cormorant italic text-[#5a3a45] leading-relaxed"
            style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)' }}
          >
            Aproveite sua ida ao Menela Experience para viver um dia incrível no Beto Carrero World com conforto, praticidade e suporte completo.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 items-stretch">

          {/* LEFT — Ticket card */}
          <div
            ref={leftRef}
            className="reveal relative rounded-[2rem] overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #3d2030 0%, #5c2840 55%, #3d2030 100%)',
              boxShadow: '0 24px 80px rgba(61,32,48,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
              border: '1px solid rgba(245,213,220,0.08)',
            }}
          >
            {/* Glow top */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(196,99,122,0.28) 0%, transparent 60%)' }} />

            {/* Ticket perforation line */}
            <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '52%' }}>
              <div className="flex items-center px-6">
                <div className="w-5 h-5 rounded-full flex-shrink-0 -ml-8"
                  style={{ background: '#fdf5f7' }} />
                <div className="flex-1 border-t-2 border-dashed mx-2"
                  style={{ borderColor: 'rgba(245,213,220,0.1)' }} />
                <div className="w-5 h-5 rounded-full flex-shrink-0 -mr-8"
                  style={{ background: '#fdf5f7' }} />
              </div>
            </div>

            {/* Top half — price */}
            <div className="relative px-6 sm:px-10 pt-8 sm:pt-10 pb-7 sm:pb-8 text-center" style={{ borderBottom: '1px dashed rgba(245,213,220,0.12)' }}>
              <p className="font-montserrat text-[10px] tracking-[0.4em] uppercase mb-5"
                style={{ color: 'rgba(245,213,220,0.45)' }}>
                Valor do Pacote
              </p>

              {/* Price display */}
              <div className="mb-1">
                <span className="font-montserrat font-semibold text-rose-300/60 text-lg">por apenas</span>
              </div>
              <div
                className="font-playfair font-bold leading-none mb-4"
                style={{
                  fontSize: 'clamp(4rem, 9vw, 6rem)',
                  background: 'linear-gradient(135deg, #fff 0%, rgba(245,213,220,0.95) 55%, #e8829a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 28px rgba(196,99,122,0.55))',
                }}
              >
                R$245
              </div>

              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
                style={{
                  background: 'rgba(196,99,122,0.16)',
                  border: '1px solid rgba(196,99,122,0.3)',
                }}
              >
                <CreditCard size={12} className="text-rose-300" />
                <span className="font-montserrat text-[10px] tracking-[0.18em] uppercase text-rose-200/75">
                  PIX · parcelado em até 5x sem juros
                </span>
              </div>
            </div>

            {/* Bottom half — CTA */}
            <div className="relative px-6 sm:px-10 py-7 sm:py-8 flex flex-col items-center gap-5">
              <a
                href="https://wa.me/5548991994250"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full flex items-center justify-center gap-3 rounded-2xl py-4 px-6"
                style={{
                  background: 'linear-gradient(135deg, #25d366 0%, #1aa44e 100%)',
                  boxShadow: '0 8px 32px rgba(37,211,102,0.4)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-4px) scale(1.02)';
                  el.style.boxShadow = '0 16px 48px rgba(37,211,102,0.55)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0) scale(1)';
                  el.style.boxShadow = '0 8px 32px rgba(37,211,102,0.4)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"
                  style={{ transition: 'transform 0.3s ease', flexShrink: 0 }}
                  className="group-hover:scale-110">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar com a agência
              </a>

              <p className="font-cormorant italic text-center"
                style={{ color: 'rgba(245,213,220,0.45)', fontSize: '0.88rem' }}>
                Tudo pensado para você viver o Menela Experience da melhor forma possível.
              </p>
            </div>
          </div>

          {/* RIGHT — Benefits + Hotel */}
          <div ref={rightRef} className="reveal flex flex-col gap-5">

            {/* Benefits */}
            <div
              className="flex-1 rounded-[2rem] overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(196,99,122,0.1)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 12px 56px rgba(196,99,122,0.08), inset 0 1px 0 rgba(255,255,255,1)',
              }}
            >
              {/* Header strip */}
              <div
                className="px-6 sm:px-8 pt-7 sm:pt-8 pb-5 sm:pb-6"
                style={{ borderBottom: '1px solid rgba(196,99,122,0.07)' }}
              >
                <p className="font-montserrat text-[10px] tracking-[0.38em] uppercase text-[#c4637a]/55 mb-2">
                  Tudo incluso no pacote
                </p>
                <h3 className="font-playfair font-bold text-[#3d2030]"
                  style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)' }}>
                  O que você recebe
                </h3>
              </div>

              {/* Benefit rows */}
              <div className="px-4 sm:px-8 py-5 sm:py-6 space-y-1 sm:space-y-2">
                {BENEFITS.map((b, i) => (
                  <div
                    key={b.label}
                    className="group flex items-center gap-4 rounded-xl px-4 py-3.5 cursor-default"
                    style={{
                      transition: 'all 0.3s ease',
                      background: 'transparent',
                      animationDelay: `${i * 70}ms`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(196,99,122,0.06)';
                      el.style.transform = 'translateX(6px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'transparent';
                      el.style.transform = 'translateX(0)';
                    }}
                  >
                    {/* Animated number */}
                    <span
                      className="font-montserrat font-bold flex-shrink-0 w-6 text-right"
                      style={{ fontSize: '11px', color: 'rgba(196,99,122,0.35)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Check */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(196,99,122,0.18), rgba(245,213,220,0.45))',
                        border: '1px solid rgba(196,99,122,0.2)',
                        boxShadow: '0 2px 8px rgba(196,99,122,0.12)',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c4637a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <span className="font-montserrat text-[13px] font-semibold text-[#3d2030] tracking-wide">
                      {b.label}
                    </span>

                    <ChevronRight size={14} className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ color: '#c4637a' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel card */}
            <div
              className="group rounded-[1.75rem] overflow-hidden cursor-default"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(252,232,236,0.85) 100%)',
                border: '1px solid rgba(196,99,122,0.12)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(196,99,122,0.07), inset 0 1px 0 rgba(255,255,255,1)',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 20px 56px rgba(196,99,122,0.15), inset 0 1px 0 rgba(255,255,255,1)';
                el.style.borderColor = 'rgba(196,99,122,0.22)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 8px 32px rgba(196,99,122,0.07), inset 0 1px 0 rgba(255,255,255,1)';
                el.style.borderColor = 'rgba(196,99,122,0.12)';
              }}
            >
              <div className="p-6 flex gap-5 items-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-400 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #c4637a, #d4849a)',
                    boxShadow: '0 6px 20px rgba(196,99,122,0.38)',
                  }}
                >
                  <Hotel size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-[#3d2030] mb-1" style={{ fontSize: '1.05rem' }}>
                    Precisa de hospedagem?
                  </h4>
                  <p className="font-montserrat text-[11.5px] leading-relaxed" style={{ color: 'rgba(90,58,69,0.6)' }}>
                    Nossa equipe também pode auxiliar você com hotéis e acomodações.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.25) 50%, transparent)' }} />
    </section>
  );
}
