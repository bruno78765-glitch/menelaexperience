import React, { useState } from 'react';
import { CheckCircle2, Download, Upload, Moon, Hammer, Vote, ShieldAlert } from 'lucide-react';
import type { EstadoJogo } from '../dados/repositorioJogo';
import { repositorioJogo } from '../dados/repositorioJogo';

interface PainelAdminProps {
  estado: EstadoJogo;
  aoFechar: () => void;
  aoNotificar: (msg: string) => void;
  aoAlternarNoiteCena: (forcarNoite: boolean) => void;
}

export const PainelAdmin: React.FC<PainelAdminProps> = ({
  estado,
  aoFechar,
  aoNotificar,
  aoAlternarNoiteCena,
}) => {
  const [nomeObra, setNomeObra] = useState('Farol da Ilha Norte');
  const [tipoObra, setTipoObra] = useState('torre');
  const [metaMadeira, setMetaMadeira] = useState(10);
  const [metaFerramentas, setMetaFerramentas] = useState(8);

  const [perguntaVotacao, setPerguntaVotacao] = useState(
    'Qual evento especial devemos fazer no próximo vídeo?'
  );
  const [opcoesTexto, setOpcoesTexto] = useState(
    'Festival da Colheita, Expedição à Ilha Norte, Grande Torneio de Bardos'
  );

  const [jsonImportacao, setJsonImportacao] = useState('');
  const [jsonExportado, setJsonExportado] = useState('');

  const handleAprovar = (id: string) => {
    try {
      const morador = repositorioJogo.aprovarReivindicacao(id, true);
      aoNotificar(
        `Reivindicação aprovada! Câmera voando para a Casa #${morador.casa_idx + 1} (${morador.nome}).`
      );
      aoFechar();
    } catch (e) {
      aoNotificar(e instanceof Error ? e.message : 'Erro ao aprovar.');
    }
  };

  const handleCriarObra = (e: React.FormEvent) => {
    e.preventDefault();
    repositorioJogo.adminCriarObra(nomeObra, tipoObra, metaMadeira, metaFerramentas);
    aoNotificar(`Nova obra "${nomeObra}" iniciada para a comunidade!`);
  };

  const handleCriarVotacao = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const opcoes = opcoesTexto.split(',').map((s) => s.trim());
      repositorioJogo.adminCriarVotacao(perguntaVotacao, opcoes);
      aoNotificar('Nova votação aberta na Urna do Salão!');
    } catch (err) {
      aoNotificar(err instanceof Error ? err.message : 'Erro ao criar votação');
    }
  };

  const handleExportarEstado = () => {
    const json = repositorioJogo.exportarEstadoParaAppVideos();
    setJsonExportado(json);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asterion-estado-dia-${estado.diaVila}.json`;
    a.click();
    URL.revokeObjectURL(url);
    aoNotificar('JSON do estado exportado para o app dos vídeos!');
  };

  const handleImportarMoradores = () => {
    try {
      const qtd = repositorioJogo.importarMoradoresDeJson(jsonImportacao);
      aoNotificar(`${qtd} moradores/seguidores importados com sucesso!`);
      setJsonImportacao('');
    } catch (err) {
      aoNotificar(err instanceof Error ? err.message : 'JSON inválido para importação.');
    }
  };

  const handleDispararNoiteCucu = () => {
    aoAlternarNoiteCena(true);
    const ev = repositorioJogo.dispararNoiteDoCucu(true);
    aoNotificar(String(ev.dados.resumo ?? 'Noite do Cucu registrada na tabela de eventos!'));
  };

  return (
    <div className="space-y-5 text-sm text-[#f2ead8]">
      <div className="flex items-center justify-between border-b border-[#f8d040]/40 pb-3">
        <div>
          <h2 className="font-pixel text-base text-[#f8d040]">PAINEL DO CRIADOR (/ADMIN)</h2>
          <p className="text-xs text-[#f2ead8]/75">
            Gerencie reivindicações da @mundoasterion, obras, votações e sincronização com os
            vídeos.
          </p>
        </div>
        <button
          type="button"
          onClick={aoFechar}
          className="rounded-lg bg-white/10 px-3 py-1.5 font-bold hover:bg-white/20"
        >
          Voltar à Vila
        </button>
      </div>

      {/* 1. Reivindicações de Casas */}
      <section className="rounded-xl border border-white/15 bg-black/30 p-3.5 space-y-2.5">
        <h3 className="flex items-center gap-2 font-bold text-[#f8d040]">
          <CheckCircle2 className="h-4 w-4" /> Reivindicações Pendentes (@mundoasterion)
        </h3>
        {estado.reivindicacoes.length === 0 ? (
          <p className="text-xs text-[#f2ead8]/70">Nenhuma reivindicação registrada ainda.</p>
        ) : (
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {estado.reivindicacoes.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0c1030]/90 px-3 py-2"
              >
                <div>
                  <span className="font-bold text-[#f8d040]">@{r.arroba}</span>
                  <span className="ml-2 rounded bg-white/10 px-2 py-0.5 font-mono text-xs">
                    Código: {r.codigo}
                  </span>
                  <span className="ml-2 text-xs text-[#f2ead8]/70">({r.status})</span>
                </div>
                {r.status === 'pendente' ? (
                  <button
                    type="button"
                    data-testid={`aprovar-${r.arroba}`}
                    onClick={() => handleAprovar(r.id)}
                    className="rounded-lg bg-[#5f9e46] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#4e8538]"
                  >
                    Aprovar & Voar até a Casa
                  </button>
                ) : (
                  <span className="text-xs font-bold text-[#5f9e46]">
                    Aprovada (Casa #{(r.casa_idx_atribuida ?? 0) + 1})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Evento Noite do Cucu & Registro de Eventos */}
      <section className="rounded-xl border border-white/15 bg-black/30 p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-[#f8d040]">
              <Moon className="h-4 w-4" /> Evento: Noite do Cucu
            </h3>
            <p className="text-xs text-[#f2ead8]/75">
              Avalia proteção da vila vs. ameaça e grava o resultado em <code>eventos</code> para o
              vídeo do dia seguinte.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDispararNoiteCucu}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#e2552e] px-3 py-2 text-xs font-bold text-white hover:bg-[#c94523]"
          >
            <ShieldAlert className="h-4 w-4" /> Disparar Noite do Cucu Agora
          </button>
        </div>

        <div className="max-h-28 overflow-y-auto space-y-1 text-xs">
          {estado.eventos.slice(0, 5).map((ev) => (
            <div key={ev.id} className="rounded bg-white/5 px-2.5 py-1.5">
              <span className="font-bold text-[#f8d040]">[{ev.tipo}]</span>{' '}
              <span>{String(ev.dados.resumo ?? JSON.stringify(ev.dados))}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Criar Obra e Criar Votação */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <form
          onSubmit={handleCriarObra}
          className="rounded-xl border border-white/15 bg-black/30 p-3.5 space-y-2"
        >
          <h3 className="flex items-center gap-2 font-bold text-[#f8d040]">
            <Hammer className="h-4 w-4" /> Nova Obra da Semana
          </h3>
          <input
            type="text"
            value={nomeObra}
            onChange={(e) => setNomeObra(e.target.value)}
            placeholder="Nome da obra"
            className="w-full rounded bg-[#0c1030] border border-white/20 px-2.5 py-1.5 text-xs"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={tipoObra}
              onChange={(e) => setTipoObra(e.target.value)}
              className="rounded bg-[#0c1030] border border-white/20 px-2 py-1.5 text-xs"
            >
              <option value="muralha">Muralha</option>
              <option value="torre">Torre</option>
              <option value="castelo">Castelo</option>
              <option value="templo">Templo</option>
            </select>
            <input
              type="number"
              min={1}
              value={metaMadeira}
              onChange={(e) => setMetaMadeira(Number(e.target.value))}
              className="rounded bg-[#0c1030] border border-white/20 px-2 py-1.5 text-xs"
              title="Meta de Madeira"
            />
            <input
              type="number"
              min={1}
              value={metaFerramentas}
              onChange={(e) => setMetaFerramentas(Number(e.target.value))}
              className="rounded bg-[#0c1030] border border-white/20 px-2 py-1.5 text-xs"
              title="Meta de Ferramentas"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#f8d040] py-1.5 text-xs font-bold text-[#0c1030]"
          >
            Publicar Obra da Semana
          </button>
        </form>

        <form
          onSubmit={handleCriarVotacao}
          className="rounded-xl border border-white/15 bg-black/30 p-3.5 space-y-2"
        >
          <h3 className="flex items-center gap-2 font-bold text-[#f8d040]">
            <Vote className="h-4 w-4" /> Criar / Encerrar Votação
          </h3>
          <input
            type="text"
            value={perguntaVotacao}
            onChange={(e) => setPerguntaVotacao(e.target.value)}
            placeholder="Pergunta da votação"
            className="w-full rounded bg-[#0c1030] border border-white/20 px-2.5 py-1.5 text-xs"
          />
          <input
            type="text"
            value={opcoesTexto}
            onChange={(e) => setOpcoesTexto(e.target.value)}
            placeholder="Opções separadas por vírgula"
            className="w-full rounded bg-[#0c1030] border border-white/20 px-2.5 py-1.5 text-xs"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#f8d040] py-1.5 text-xs font-bold text-[#0c1030]"
            >
              Nova Votação
            </button>
            <button
              type="button"
              onClick={() => {
                repositorioJogo.adminEncerrarVotacaoAtual();
                aoNotificar('Votação atual encerrada e vencedora apurada!');
              }}
              className="rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-bold hover:bg-white/25"
            >
              Encerrar Atual
            </button>
          </div>
        </form>
      </div>

      {/* 4. Exportar e Importar JSON para o App dos Vídeos */}
      <section className="rounded-xl border border-white/15 bg-black/30 p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-[#f8d040]">
            Sincronização com o App dos Vídeos (estado.json)
          </h3>
          <button
            type="button"
            onClick={handleExportarEstado}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#3a7ac8] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2f66ab]"
          >
            <Download className="h-4 w-4" /> Exportar JSON do Estado
          </button>
        </div>

        {jsonExportado && (
          <textarea
            readOnly
            value={jsonExportado}
            rows={3}
            className="w-full rounded bg-[#0c1030] border border-[#f8d040]/40 p-2 font-mono text-[11px]"
          />
        )}

        <div className="space-y-1.5 pt-1">
          <label className="block text-xs text-[#f2ead8]/80">
            Importar novos seguidores/moradores (cole um array JSON ou objeto{' '}
            <code>{`{"moradores": [...]}`}</code>):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={jsonImportacao}
              onChange={(e) => setJsonImportacao(e.target.value)}
              placeholder='Ex: [{"nome":"Novo Seguidor","arroba":"novo_seg","profissao":"mago","casa_idx":800}]'
              className="flex-1 rounded bg-[#0c1030] border border-white/20 px-2.5 py-1.5 font-mono text-xs"
            />
            <button
              type="button"
              onClick={handleImportarMoradores}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#5f9e46] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#4e8538]"
            >
              <Upload className="h-4 w-4" /> Importar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
