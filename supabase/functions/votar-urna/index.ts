import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { votacao_id, morador_id, opcao } = await req.json();

    const { error } = await supabaseAdmin.from('votos').insert({
      votacao_id,
      morador_id,
      opcao,
    });

    if (error) {
      return Response.json(
        { erro: 'Voto duplicado recusado pela chave primária (votacao_id, morador_id).' },
        { status: 409 }
      );
    }

    return Response.json({ sucesso: true });
  } catch (err) {
    return Response.json(
      { erro: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    );
  }
});
