import React from 'react';
import { Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { ITENS_COSMETICOS_CATALOGO } from './itensCosmeticos';

interface LojaEmBreveProps {
  ehFundador: boolean;
  aoFechar: () => void;
}

export const LojaEmBreve: React.FC<LojaEmBreveProps> = ({ ehFundador, aoFechar }) => {
  return (
    <div className="space-y-4 text-[#f2ead8]">
      <div className="flex items-center justify-between border-b border-[#f8d040]/30 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#f8d040]" />
          <h2 className="font-pixel text-lg text-[#f8d040]">LOJA DE COSMÉTICOS · EM BREVE</h2>
        </div>
        <button
          type="button"
          onClick={aoFechar}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold hover:bg-white/20"
        >
          Fechar
        </button>
      </div>

      <p className="text-sm text-[#f2ead8]/85">
        Em Asterion, recursos de jogo e força da vila nunca são vendidos por dinheiro real. A loja
        futura trará apenas itens visuais (cosméticos) para personalizar sua casa e apoiar a série{' '}
        <span className="font-bold text-[#f8d040]">@mundoasterion</span>.
      </p>

      {ehFundador && (
        <div className="flex items-center gap-2 rounded-xl border border-[#f8d040]/50 bg-[#f8d040]/15 p-3 text-xs text-[#f8d040]">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>
            Sua casa possui o selo <strong>Fundador</strong>! Você terá acesso antecipado aos
            brasões dos primeiros moradores.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ITENS_COSMETICOS_CATALOGO.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-white/15 bg-[#0c1030]/80 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#f8d040]">
                  {item.categoria}
                </span>
                <h3 className="font-bold text-[#f2ead8]">{item.nome}</h3>
              </div>
              <span
                className="h-6 w-6 shrink-0 rounded-md border border-white/30"
                style={{ backgroundColor: item.preview_cor }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-[#f2ead8]/70">
                {item.exclusivo_fundador ? 'Exclusivo Fundador' : `${item.preco_gemas} Gemas`}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[11px] text-[#f8d040]">
                <Lock className="h-3 w-3" /> Em breve
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
