import { MapPin, Phone, Instagram, Facebook, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1e0d16 0%, #150a10 100%)',
      }}
    >
      {/* Orb */}
      <div className="orb animate-glow-pulse w-[500px] h-[500px] top-[-80px] left-1/2 -translate-x-1/2 opacity-18"
        style={{ background: 'radial-gradient(circle, rgba(196,99,122,0.35) 0%, transparent 70%)' }} />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,99,122,0.22) 30%, rgba(245,213,220,0.15) 50%, rgba(196,99,122,0.22) 70%, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <h3
              className="font-playfair font-bold mb-2"
              style={{
                fontSize: '2rem',
                background: 'linear-gradient(180deg, #ffffff 0%, rgba(245,213,220,0.85) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MENELA
            </h3>
            <p className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-rose-300/45 mb-5">
              EXPERIENCE
            </p>
            <div className="w-10 h-px mb-5"
              style={{ background: 'linear-gradient(90deg, rgba(196,99,122,0.5), transparent)' }} />
            <p className="font-cormorant italic text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
              A experiência que conecta profissionais, desperta evolução e transforma trajetórias.
            </p>
          </div>

          {/* Event Info */}
          <div>
            <p className="font-montserrat text-[10px] tracking-[0.35em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.88)' }}>
              O Evento
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={13} className="text-[#c4637a] mt-0.5 flex-shrink-0 opacity-80" />
                <div>
                  <p className="font-montserrat text-[11px]" style={{ color: 'rgba(255,255,255,0.88)' }}>Marambaia Hotel e Convenções</p>
                  <p className="font-montserrat text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.72)' }}>Av. Atlântica, 300 - Centro</p>
                  <p className="font-montserrat text-[11px]" style={{ color: 'rgba(255,255,255,0.72)' }}>Balneário Camboriú - SC</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={13} className="text-[#c4637a] flex-shrink-0 opacity-80" />
                <a
                  href="https://wa.me/5521969129464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-montserrat text-[11px] transition-colors duration-300 hover:text-[#c4637a]"
                  style={{ color: 'rgba(255,255,255,0.88)' }}
                >
                  +55 21 96912-9464
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-montserrat text-[10px] tracking-[0.35em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.88)' }}>
              Siga o Evento
            </p>
            <div className="flex gap-3 mb-7">
              {[
                { icon: <Instagram size={15} />, label: 'Instagram', href: '#' },
                { icon: <Facebook size={15} />,  label: 'Facebook',  href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-350"
                  style={{
                    background: 'rgba(196,99,122,0.1)',
                    border: '1px solid rgba(196,99,122,0.18)',
                    color: 'rgba(245,213,220,0.5)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(196,99,122,0.22)';
                    el.style.borderColor = 'rgba(196,99,122,0.48)';
                    el.style.color = '#e8b4c0';
                    el.style.transform = 'translateY(-3px)';
                    el.style.boxShadow = '0 8px 20px rgba(196,99,122,0.2)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(196,99,122,0.1)';
                    el.style.borderColor = 'rgba(196,99,122,0.18)';
                    el.style.color = 'rgba(245,213,220,0.5)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
              <a
                href="https://wa.me/5521969129464"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-350"
                style={{
                  background: 'rgba(196,99,122,0.1)',
                  border: '1px solid rgba(196,99,122,0.18)',
                  color: 'rgba(245,213,220,0.5)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(196,99,122,0.22)';
                  el.style.borderColor = 'rgba(196,99,122,0.48)';
                  el.style.color = '#e8b4c0';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 8px 20px rgba(196,99,122,0.2)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(196,99,122,0.1)';
                  el.style.borderColor = 'rgba(196,99,122,0.18)';
                  el.style.color = 'rgba(245,213,220,0.5)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
                aria-label="WhatsApp"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>

            <a
              href="https://wa.me/5521969129464"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-montserrat font-bold tracking-wider uppercase text-white transition-all duration-350"
              style={{
                background: 'linear-gradient(135deg, #c4637a, #d4849a)',
                boxShadow: '0 4px 18px rgba(196,99,122,0.42)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(196,99,122,0.55)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(196,99,122,0.42)';
              }}
            >
              GARANTIR VAGA
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(245,213,220,0.07)' }}
        >
          <p className="font-montserrat text-[11px] tracking-wider" style={{ color: 'rgba(255,255,255,0.72)' }}>
            © 2026 MENELA EXPERIENCE — Todos os direitos reservados.
          </p>
          <p className="font-montserrat text-[11px] flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Feito com <Heart size={9} className="text-rose-400/60 mx-0.5" /> para mulheres extraordinárias
          </p>
        </div>
      </div>
    </footer>
  );
}
