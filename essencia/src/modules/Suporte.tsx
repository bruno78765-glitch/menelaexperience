import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, ChevronRight } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import { BASE_CONHECIMENTO, MENSAGEM_INICIAL } from '@/data/suporte';
import { buscarResposta, type AcaoBot } from '@/lib/busca';
import { moduloValido } from '@/data/modulos';

interface Mensagem {
  id: number;
  texto: string;
  autora: 'aluna' | 'essencia';
  acao?: AcaoBot;
}

const MENSAGEM_ZERO: Mensagem = { id: 0, texto: MENSAGEM_INICIAL, autora: 'essencia' };

export function Suporte({ onNavegar }: { onNavegar: (id: string) => void }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([MENSAGEM_ZERO]);
  const [input, setInput] = useState('');
  const listaRef = useRef<HTMLDivElement>(null);
  const sequencia = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollTo({ top: lista.scrollHeight, behavior: 'smooth' });
  }, [mensagens]);

  useEffect(() => {
    const pendentes = timers.current;
    return () => {
      pendentes.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function enviar(origem?: string) {
    const texto = (origem ?? input).trim();
    if (!texto) return;
    sequencia.current += 1;
    const idAluna = sequencia.current;
    setMensagens((atual) => [...atual, { id: idAluna, texto, autora: 'aluna' }]);
    setInput('');

    const timer = window.setTimeout(() => {
      const encontrada = buscarResposta(texto, BASE_CONHECIMENTO);
      sequencia.current += 1;
      const resposta: Mensagem = {
        id: sequencia.current,
        autora: 'essencia',
        texto: encontrada
          ? encontrada.resposta
          : 'Não encontrei isso na base do sistema. Eu só respondo dúvidas sobre os módulos.',
        acao: encontrada?.acao,
      };
      setMensagens((atual) => [...atual, resposta]);
    }, 450);
    timers.current.push(timer);
  }

  const sugestoes = ['Como montar meu calendário?', 'Como responder “está caro”?', 'Quero falar com um humano'];

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Módulo 5 · Painel de Suporte & Atendimento Direto"
        titulo="Tira-dúvidas e suporte humanizado"
        descricao="A assistente responde sobre os módulos do sistema."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-essencia-500/30 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-500/15 text-champagne-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg text-creme-50">Assistente Essência</p>
              <p className="text-xs text-creme-200/60">Respostas automáticas da base do sistema</p>
            </div>
          </div>

          <div ref={listaRef} className="mt-4 h-[380px] space-y-3 overflow-y-auto pr-2 scrollbar-lux">
            {mensagens.map((mensagem) => (
              <div key={mensagem.id} className={`flex ${mensagem.autora === 'aluna' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    mensagem.autora === 'aluna'
                      ? 'rounded-br-md bg-champagne-500 text-essencia-900'
                      : 'glass-soft rounded-bl-md text-creme-50'
                  }`}
                >
                  <p>{mensagem.texto}</p>
                  {mensagem.acao && moduloValido(mensagem.acao.modulo) && (
                    <button
                      type="button"
                      onClick={() => onNavegar(mensagem.acao!.modulo)}
                      className="mt-3 inline-flex items-center gap-1 rounded-lg border border-champagne-500/40 px-3 py-1.5 text-xs font-semibold text-champagne-500"
                    >
                      {mensagem.acao.label}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {sugestoes.map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                onClick={() => enviar(sugestao)}
                className="chip text-creme-200/80 hover:border-champagne-500/60 hover:text-champagne-500"
              >
                {sugestao}
              </button>
            ))}
          </div>

          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              enviar();
            }}
          >
            <label htmlFor="suporte-pergunta" className="sr-only">
              Sua dúvida
            </label>
            <input
              id="suporte-pergunta"
              className="input-lux"
              placeholder="Digite sua dúvida…"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" className="btn-gold px-4" aria-label="Enviar dúvida">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="eyebrow mb-3">Atalhos</p>
            <div className="space-y-2">
              {[
                { label: 'Dashboard e diagnóstico', modulo: 'dashboard' },
                { label: 'Calendário editorial', modulo: 'calendario' },
                { label: 'Estúdio de conteúdo', modulo: 'estudio' },
                { label: 'Treinador de vendas', modulo: 'vendas' },
                { label: 'Calculadora de preço', modulo: 'precificacao' },
                { label: 'Avaliação e protocolos', modulo: 'protocolos' },
              ].map((atalho) => (
                <button
                  key={atalho.modulo}
                  type="button"
                  onClick={() => onNavegar(atalho.modulo)}
                  className="flex w-full items-center justify-between rounded-xl border border-essencia-500/30 px-3 py-2.5 text-sm text-creme-200/85 transition-all duration-300 hover:border-champagne-500/50 hover:text-champagne-500"
                >
                  {atalho.label}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
