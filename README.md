# Repositório

A calculadora e o hub Essência compartilham um projeto Supabase, `rbgpdetmnnspgcesneva`. A mesma conta entra nos dois. No hub, a calculadora abre direto no menu, no mesmo visual da área, e a ficha de avaliação e protocolos também fica nesse menu. Diagnóstico e cenários gravam em tabelas separadas (`essencia_diagnosticos` e `cenarios`), com RLS separado. A ficha de protocolos não grava atendimento. O site do evento continua na raiz e não usa esse banco.

## Calculadora de Precificação (Método Essence)

Pasta [`calculadora`](calculadora/README.md). React + Vite, site estático. Login e cenários salvos ficam no Supabase (Auth + Postgres com RLS): cada pessoa entra com e-mail e senha e só vê os próprios cenários.

```bash
cd calculadora
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173`. O README da pasta tem o SQL da tabela, as variáveis de ambiente e o passo a passo para publicar no Bolt ou na Netlify.

## Hub Método Essência

Pasta [`essencia`](essencia/README.md). Diagnóstico, calendário, estúdio, vendas, calculadora, ficha de avaliação e suporte. A conta é a mesma da calculadora. O SQL de `essencia_diagnosticos` está em `essencia/supabase/migrations` e precisa ser rodado no SQL Editor do projeto `rbgpdetmnnspgcesneva`.

## Menela Experience

A raiz continua sendo o site do evento (deploy estático na Netlify, `netlify.toml` da raiz). Ele não foi substituído pela calculadora.

```bash
npm install
npm run dev
```

Para publicar a calculadora na Netlify, crie um segundo site apontando para este repositório com **Base directory** `calculadora`.
