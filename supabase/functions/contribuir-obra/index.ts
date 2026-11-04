import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { obra_id, morador_id, tipo, qtd = 1 } = await req.json();

    const { data: recurso } = await supabaseAdmin
      .from('recursos')
      .select('qtd')
      .eq('morador_id', morador_id)
      .eq('tipo', tipo)
      .maybeSingle();

    if (!recurso || recurso.qtd < qtd) {
      return Response.json({ erro: 'Saldo de recurso insuficiente.' }, { status: 400 });
    }

    const { data: obra } = await supabaseAdmin
      .from('obras')
      .select('*')
      .eq('id', obra_id)
      .single();

    if (!obra || obra.status === 'concluida') {
      return Response.json({ erro: 'Obra não está em andamento.' }, { status: 400 });
    }

    await supabaseAdmin
      .from('recursos')
      .update({ qtd: recurso.qtd - qtd })
      .eq('morador_id', morador_id)
      .eq('tipo', tipo);

    const novoProgresso = {
      ...(obra.progresso ?? {}),
      [tipo]: ((obra.progresso?.[tipo] as number) ?? 0) + qtd,
    };

    const concluiu = Object.entries(obra.meta ?? {}).every(
      ([chave, meta]) => (novoProgresso[chave] ?? 0) >= Number(meta)
    );

    await supabaseAdmin
      .from('obras')
      .update({
        progresso: novoProgresso,
        status: concluiu ? 'concluida' : 'em_andamento',
      })
      .eq('id', obra_id);

    await supabaseAdmin.from('contribuicoes').insert({
      obra_id,
      morador_id,
      tipo,
      qtd,
    });

    return Response.json({ sucesso: true, progresso: novoProgresso, concluiu });
  } catch (err) {
    return Response.json(
      { erro: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    );
  }
});
