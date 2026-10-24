import { useCallback, useEffect, useRef, useState } from 'react';
import { limparNome } from '@/lib/auth';
import {
  DIAGNOSTICO_PADRAO,
  daLinha,
  interpretarDiagnostico,
  normalizarDiagnostico,
  traduzirErroBanco,
  validarDiagnostico,
  type DiagnosticoNegocio,
  type DiagnosticoPersistido,
  type LinhaDiagnostico,
} from '@/lib/diagnostico';
import { SUPABASE_CONFIG_ERROR, supabase } from '@/lib/supabase';

const CHAVE_LEGADA = 'essencia:diagnostico';
const TABELA = 'essencia_diagnosticos';
const COLUNAS = 'nome,nicho,meta_faturamento,ticket_medio,taxa_conversao,updated_at';

export type ResultadoSalvar = { ok: true } | { ok: false; mensagem: string };

function chaveDaConta(userId: string): string {
  return `essencia:diagnostico:${userId}`;
}

function lerChave(chave: string): DiagnosticoPersistido | null {
  try {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return null;
    return interpretarDiagnostico(JSON.parse(bruto));
  } catch {
    return null;
  }
}

function gravarChave(chave: string, dados: DiagnosticoPersistido): void {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch {
    // Navegador sem espaço ou com storage bloqueado: a conta no Supabase segue sendo a fonte.
  }
}

function apagarChave(chave: string): void {
  try {
    localStorage.removeItem(chave);
  } catch {
    // Ignora storage bloqueado.
  }
}

function instante(valor: string): number {
  const lido = Date.parse(valor);
  return Number.isFinite(lido) ? lido : 0;
}

function soNegocio(dados: DiagnosticoPersistido): DiagnosticoNegocio {
  return {
    nome: dados.nome,
    nicho: dados.nicho,
    metaFaturamento: dados.metaFaturamento,
    ticketMedio: dados.ticketMedio,
    taxaConversao: dados.taxaConversao,
  };
}

export function useDiagnostico(userId: string | null, nomeConta: string) {
  const [rascunho, setRascunho] = useState<DiagnosticoNegocio>(DIAGNOSTICO_PADRAO);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const editado = useRef(false);
  const cargaId = useRef(0);
  const saveId = useRef(0);

  const aplicar = useCallback((dados: DiagnosticoPersistido) => {
    if (!editado.current) setRascunho(soNegocio(dados));
  }, []);

  useEffect(() => {
    if (!userId || SUPABASE_CONFIG_ERROR) {
      editado.current = false;
      setRascunho(DIAGNOSTICO_PADRAO);
      setErro(null);
      setAviso(null);
      setSalvando(false);
      return;
    }

    const id = ++cargaId.current;
    let cancelado = false;
    setErro(null);

    supabase
      .from(TABELA)
      .select(COLUNAS)
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelado || id !== cargaId.current) return;
        if (error) {
          setErro(traduzirErroBanco(error.message, error.code));
          return;
        }

        const remoto = data ? daLinha(data as LinhaDiagnostico) : null;
        const local = lerChave(chaveDaConta(userId));
        if (remoto && local && instante(local.updatedAt) > instante(remoto.updatedAt)) {
          aplicar(local);
          setAviso('Este navegador tem uma versão mais recente do que a conta. Salve de novo para sincronizar.');
          return;
        }
        if (remoto) {
          aplicar(remoto);
          gravarChave(chaveDaConta(userId), remoto);
          return;
        }
        if (local) {
          aplicar(local);
          return;
        }

        const legado = lerChave(CHAVE_LEGADA);
        if (legado) {
          gravarChave(chaveDaConta(userId), legado);
          apagarChave(CHAVE_LEGADA);
          aplicar(legado);
          setAviso('Encontrei um diagnóstico antigo neste navegador. Salve para gravá-lo na sua conta.');
          return;
        }

        const nome = limparNome(nomeConta);
        if (nome) aplicar({ ...DIAGNOSTICO_PADRAO, nome, updatedAt: '' });
      });

    return () => {
      cancelado = true;
    };
  }, [aplicar, nomeConta, userId]);

  function editar(proximo: DiagnosticoNegocio) {
    editado.current = true;
    setRascunho(proximo);
    setAviso(null);
  }

  async function salvar(entrada: DiagnosticoNegocio): Promise<ResultadoSalvar> {
    if (!userId) return { ok: false, mensagem: 'Entre na sua conta para salvar.' };
    const mensagem = validarDiagnostico(entrada);
    if (mensagem) return { ok: false, mensagem };
    const limpo = normalizarDiagnostico(entrada);
    const id = ++saveId.current;
    cargaId.current += 1;
    setSalvando(true);
    setErro(null);

    try {
      const { data, error } = await supabase
        .from(TABELA)
        .upsert(
          {
            user_id: userId,
            nome: limpo.nome,
            nicho: limpo.nicho,
            meta_faturamento: limpo.metaFaturamento,
            ticket_medio: limpo.ticketMedio,
            taxa_conversao: limpo.taxaConversao,
          },
          { onConflict: 'user_id' },
        )
        .select(COLUNAS)
        .single();

      if (id !== saveId.current) return { ok: true };
      if (error) {
        const texto = traduzirErroBanco(error.message, error.code);
        setErro(texto);
        return { ok: false, mensagem: texto };
      }

      const persistido = daLinha(data as LinhaDiagnostico);
      if (!persistido) {
        const texto = 'O Supabase devolveu um diagnóstico incompleto.';
        setErro(texto);
        return { ok: false, mensagem: texto };
      }

      gravarChave(chaveDaConta(userId), persistido);
      apagarChave(CHAVE_LEGADA);
      editado.current = false;
      setRascunho(soNegocio(persistido));
      setAviso(null);
      return { ok: true };
    } catch {
      if (id !== saveId.current) return { ok: true };
      const texto = 'Sem conexão com o Supabase. O diagnóstico não foi gravado na conta.';
      setErro(texto);
      return { ok: false, mensagem: texto };
    } finally {
      if (id === saveId.current) setSalvando(false);
    }
  }

  return { rascunho, editar, salvar, salvando, erro, aviso };
}

export type ControleDiagnostico = ReturnType<typeof useDiagnostico>;
