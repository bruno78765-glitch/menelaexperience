# Asterion · A Vila 3D da Comunidade (`@mundoasterion`)

MVP jogável em 3D low-poly/voxel no navegador, multiplayer assíncrono, em que cada seguidor da série `@mundoasterion` possui sua própria casa, nome, `@arroba` e profissão em uma vila circular que cresce com a comunidade.

## Como rodar localmente (Modo Offline / Demo)

Com **Node.js 22+**:

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Se não houver arquivo `.env`, o jogo entra automaticamente no **Modo Demo Local**, carregando os **800 moradores** de `seed/moradores.json`, salvando no `localStorage` e sincronizando abas abertas em tempo real via `BroadcastChannel`.

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento Vite.
- `npm run build` — gera o bundle de produção otimizado (`dist/`) com PWA.
- `npm test` — roda a suíte de testes unitários no **Vitest** (regras de economia, coleta de 4h, troca atômica em Astros, votação na urna, Noite do Cucu e layout determinístico).
- `npm run test:e2e` — roda o teste de fumaça ponta a ponta no **Playwright** (abre a vila 3D com 800 casas fora do React, clica numa casa, reivindica `@mundoasterion` e testa a Obra da Semana em tempo real entre duas abas).
- `npm run lint` — valida o código com ESLint (`--max-warnings=0`).
- `npm run typecheck` — valida a tipagem estrita do TypeScript (`strict: true`).
- `npm run importar-estado` — gera/atualiza `seed/moradores.json` a partir do `estado.json` do app dos vídeos.

## Como configurar o Supabase (Produção)

1. Crie um projeto no [Supabase](https://supabase.com).
2. Copie o arquivo `.env.example` para `.env` e preencha apenas a URL e a chave pública `anon` (nunca coloque a chave `service_role` no front-end):

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

3. No painel do Supabase, abra **SQL Editor → New Query**, cole o conteúdo de [`supabase/migrations/20261104000000_asterion_schema.sql`](supabase/migrations/20261104000000_asterion_schema.sql) e clique em **Run**. Isso cria todas as tabelas (`moradores`, `recursos`, `carteira`, `ofertas`, `deveres`, `niveis`, `obras`, `contribuicoes`, `votacoes`, `votos`, `reivindicacoes`, `eventos` e `itens_cosmeticos`) com **Row Level Security (RLS)** e **Supabase Realtime**.
4. Publique as Edge Functions (`supabase/functions/`):

```bash
supabase functions deploy coletar-recurso
supabase functions deploy contribuir-obra
supabase functions deploy votar-urna
supabase functions deploy trocar-mercado
```

## Como importar os moradores do app dos vídeos

1. Coloque o arquivo `estado.json` exportado pelo app dos vídeos em `seed/estado.json` (ou passe o caminho por argumento).
2. Execute:

```bash
npm run importar-estado -- caminho/para/estado.json seed/moradores.json
```

Você também pode importar e exportar o estado JSON diretamente pela interface visual no painel **`/admin`** dentro do jogo.

## Deploy na Vercel ou na Netlify

O projeto já inclui [`vercel.json`](vercel.json) e [`netlify.toml`](netlify.toml) configurados com `npm run build`, diretório `dist` e redirecionamento SPA para `/admin` e links de convite (`/?convite=N`).
