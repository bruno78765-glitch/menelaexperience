import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const INTERVALO_4H_MS = 4 * 60 * 60 * 1000;

const RECURSO_POR_PROFISSAO: Record<string, string> = {
  ferreiro: 'ferramentas',
  fazendeiro: 'comida',
  lenhador: 'madeira',
  bardo: 'alegria',
  mago: 'protecao',
  costureira: 'tecido',
  mercador: 'moedas',
};

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ erro: 'Não autenticado' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { morador_id } = await req.json();
    const { data: morador, error: errMorador } = await supabaseAdmin
      .from('moradores')
      .select('*')
      .eq('id', morador_id)
      .single();

    if (errMorador || !morador) {
      return Response.json({ erro: 'Morador não encontrado' }, { status: 404 });
    }

    const agora = Date.now();
    if (morador.ultima_coleta_em) {
      const ultima = new Date(morador.ultima_coleta_em).getTime();
      if (agora - ultima < INTERVALO_4H_MS) {
        return Response.json(
          { erro: 'Aguarde o intervalo de 4 horas entre coletas.' },
          { status: 429 }
        );
      }
    }

    const tipoRecurso = RECURSO_POR_PROFISSAO[morador.profissao] ?? 'madeira';
    const { data: recAtual } = await supabaseAdmin
      .from('recursos')
      .select('qtd')
      .eq('morador_id', morador_id)
      .eq('tipo', tipoRecurso)
      .maybeSingle();

    const novaQtd = (recAtual?.qtd ?? 0) + 1;
    await supabaseAdmin
      .from('recursos')
      .upsert({ morador_id, tipo: tipoRecurso, qtd: novaQtd });

    const { data: cartAtual } = await supabaseAdmin
      .from('carteira')
      .select('astros')
      .eq('morador_id', morador_id)
      .maybeSingle();

    await supabaseAdmin
      .from('carteira')
      .upsert({ morador_id, astros: (cartAtual?.astros ?? 0) + 5 });

    await supabaseAdmin
      .from('moradores')
      .update({ ultima_coleta_em: new Date(agora).toISOString() })
      .eq('id', morador_id);

    return Response.json({
      sucesso: true,
      recurso: tipoRecurso,
      qtd: novaQtd,
      astros_ganhos: 5,
    });
  } catch (err) {
    return Response.json(
      { erro: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    );
  }
});
