# Decisões de Arquitetura e Produto (`DECISOES.md`)

Este documento registra as decisões tomadas para resolver pontos abertos do escopo mantendo a solução mais simples que cumpre todos os critérios de aceite do MVP de **Asterion (`@mundoasterion`)**.

## 1. Canvas do Three.js fora do React
- O elemento `<canvas id="asterion-canvas">` é declarado diretamente no `index.html`, fora do `<div id="hud-root">`.
- O motor 3D (`src/cena/motorCena.ts`) gerencia o `WebGLRenderer`, a cena, o `Raycaster` e o loop de animação sem passar pelo ciclo de reconciliação do React.
- A árvore React recebe apenas eventos de seleção e projeções de coordenadas 2D para desenhar as placas flutuantes e os modais de HUD.

## 2. Instanciação 3D e Orçamento de Draw Calls para 800 Casas
- Para atingir 60 FPS em notebooks e >30 FPS em celulares médios com 800 casas visíveis, todas as geometrias repetidas usam `THREE.InstancedMesh` combinadas com `mergeGeometries` e cores por vértice (`vertexColors: true`):
  - `paredeInstanced`: 1 draw call para as 800 paredes (com cor individual por instância via `setColorAt`).
  - `telhadoInstanced`: 1 draw call para os 800 telhados escalonados em estilo voxel/low-poly.
  - `detalhesInstanced`: 1 draw call para fundações, portas, janelas iluminadas e chaminés.
  - `sombraCasasInstanced`: 1 draw call para discos escuros sob as casas (sombras falsas leves).
  - 7 `InstancedMesh` para os objetos de profissão na porta (bigorna, horta, machado, alaúde, cajado, varal e baú de moedas).
  - `arvoresInstanced` e `aldeoesInstanced`: 1 draw call para toda a floresta e 1 draw call para todos os moradores caminhando.
- O medidor de FPS monitora a taxa de quadros a cada segundo; se o FPS cair abaixo de 32 por 2 segundos seguidos, reduz automaticamente `pixelRatio` para `1` e desativa o mapa de sombra direcional, mantendo as sombras em disco.

## 3. Modo Offline/Demo com Sincronia entre Abas em Tempo Real
- Quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` não estão preenchidos no `.env`, o jogo carrega automaticamente `seed/moradores.json` (800 moradores gerados deterministicamente) e persiste alterações em `localStorage`.
- Para cumprir o critério de aceite da **Obra da Semana em tempo real entre duas abas** mesmo sem servidor externo configurado, o `RepositorioJogo` combina o canal `postgres_changes` do Supabase Realtime com `BroadcastChannel` e o evento `storage` do navegador.

## 4. Ciclo deDependências Econômicas (`regras/economia.ts`)
- Nenhuma profissão produz o recurso exigido em seu próprio dever semanal:
  - `fazendeiro` produz `comida` e precisa de `ferramentas` (`ferreiro`);
  - `ferreiro` produz `ferramentas` e precisa de `comida` (`fazendeiro`);
  - `lenhador` produz `madeira` e precisa de `ferramentas` (`ferreiro`);
  - `costureira` produz `tecido` e precisa de `madeira` (`lenhador`);
  - `bardo` produz `alegria` e precisa de `tecido` (`costureira`);
  - `mago` produz `protecao` e precisa de `alegria` (`bardo`);
  - `mercador` produz `moedas` e precisa de `protecao` (`mago`).

## 5. Áudio CC0 Sintetizado sem Peso de Download
- Os efeitos sonoros ("plim" de conclusão de obra e reivindicação, clique tátil e som noturno do Cucu) são sintetizados via Web Audio API (`src/audio/sons.ts`), garantindo zero bytes extras no bundle inicial e mantendo o carregamento total abaixo de 300 KB gzip.
