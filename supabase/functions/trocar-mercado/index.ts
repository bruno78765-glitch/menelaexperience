import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { oferta_id, comprador_id } = await req.json();

    const { data: oferta } = await supabaseAdmin
      .from('ofertas')
      .select('*')
      .eq('id', oferta_id)
      .single();

    if (!oferta || oferta.status !== 'aberta') {
      return Response.json(
        { erro: 'Esta oferta já foi concluída ou cancelada (venda duplicada recusada).' },
        { status: 409 }
      );
    }

    const { data: carteiraComp } = await supabaseAdmin
      .from('carteira')
      .select('astros')
      .eq('morador_id', comprador_id)
      .single();

    if (!carteiraComp || carteiraComp.astros < oferta.preco) {
      return Response.json({ erro: 'Saldo de Astros insuficiente.' }, { status: 400 });
    }

    const { data: recVend } = await supabaseAdmin
      .from('recursos')
      .select('qtd')
      .eq('morador_id', oferta.vendedor_id)
      .eq('tipo', oferta.tipo)
      .single();

    if (!recVend || recVend.qtd < oferta.qtd) {
      return Response.json({ erro: 'Vendedor sem estoque suficiente.' }, { status: 400 });
    }

    // Marca oferta como concluída somente se ainda estiver 'aberta' (trava otimista contra corrida)
    const { data: atualizada, error: errTrava } = await supabaseAdmin
      .from('ofertas')
      .update({ status: 'concluida', comprador_id })
      .eq('id', oferta_id)
      .eq('status', 'aberta')
      .select()
      .single();

    if (errTrava || !atualizada) {
      return Response.json({ erro: 'Venda duplicada recusada.' }, { status: 409 });
    }

    // Transfere Astros e recursos
    const { data: carteiraVend } = await supabaseAdmin
      .from('carteira')
      .select('astros')
      .eq('morador_id', oferta.vendedor_id)
      .maybeSingle();

    await supabaseAdmin
      .from('carteira')
      .upsert({ morador_id: comprador_id, astros: carteiraComp.astros - oferta.preco });

    await supabaseAdmin
      .from('carteira')
      .upsert({
        morador_id: oferta.vendedor_id,
        astros: (carteiraVend?.astros ?? 0) + oferta.preco,
      });

    await supabaseAdmin
      .from('recursos')
      .update({ qtd: recVend.qtd - oferta.qtd })
      .eq('morador_id', oferta.vendedor_id)
      .eq('tipo', oferta.tipo);

    const { data: recComp } = await supabaseAdmin
      .from('recursos')
      .select('qtd')
      .eq('morador_id', comprador_id)
      .eq('tipo', oferta.tipo)
      .maybeSingle();

    await supabaseAdmin.from('recursos').upsert({
      morador_id: comprador_id,
      tipo: oferta.tipo,
      qtd: (recComp?.qtd ?? 0) + oferta.qtd,
    });

    return Response.json({ sucesso: true, oferta: atualizada });
  } catch (err) {
    return Response.json(
      { erro: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    );
  }
});
