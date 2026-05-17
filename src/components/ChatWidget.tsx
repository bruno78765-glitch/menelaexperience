import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div
          className="chat-widget rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 300,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(196,99,122,0.15)',
            boxShadow: '0 20px 60px rgba(196,99,122,0.2)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: 'linear-gradient(135deg, #c4637a 0%, #d4849a 100%)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
              <span className="font-montserrat text-xs font-700 tracking-wider text-white uppercase">
                Suporte VIP
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message */}
          <div className="px-4 py-4">
            <div
              className="rounded-xl rounded-tl-none px-4 py-3 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(196,99,122,0.08), rgba(245,213,220,0.15))',
                border: '1px solid rgba(196,99,122,0.1)',
              }}
            >
              <p className="font-montserrat text-xs text-[#3d2030]/80 leading-relaxed">
                Olá! Bem-vinda ao suporte exclusivo do{' '}
                <strong className="text-[#c4637a]">MENELA EXPERIENCE</strong>.
                <br /><br />
                Como podemos ajudar?
              </p>
            </div>

            {/* Input row */}
            <a
              href="https://wa.me/5521969129464"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-white text-xs font-montserrat font-600 tracking-wide justify-center transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #c4637a, #d4849a)',
                boxShadow: '0 4px 16px rgba(196,99,122,0.35)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(196,99,122,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(196,99,122,0.35)';
              }}
            >
              <Send size={12} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-full transition-all duration-400"
        style={{
          width: 56,
          height: 56,
          background: open
            ? 'linear-gradient(135deg, #7a3d54, #5a2d42)'
            : 'linear-gradient(135deg, #c4637a 0%, #d4849a 100%)',
          boxShadow: open
            ? '0 8px 24px rgba(61,32,48,0.4)'
            : '0 8px 32px rgba(196,99,122,0.5)',
          transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
        }}
        aria-label="Suporte VIP"
      >
        {open ? (
          <X size={22} className="text-white" />
        ) : (
          <MessageCircle size={22} className="text-white" />
        )}
      </button>

      {!open && (
        <div
          className="absolute bottom-14 right-0 px-3 py-1.5 rounded-full pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(196,99,122,0.15)',
            boxShadow: '0 4px 16px rgba(196,99,122,0.12)',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="font-montserrat text-[10px] font-600 text-[#c4637a] tracking-wider uppercase">
            Suporte VIP
          </span>
        </div>
      )}
    </div>
  );
}
