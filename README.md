# Repositório

Há dois aplicativos aqui.

## Calculadora de Precificação (Método Essence)

Pasta [`calculadora`](calculadora/README.md). React + Vite, site estático. Login e cenários salvos ficam no Supabase (Auth + Postgres com RLS): cada pessoa entra com e-mail e senha e só vê os próprios cenários.

```bash
cd calculadora
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173`. O README da pasta tem o SQL da tabela, as variáveis de ambiente e o passo a passo para publicar no Bolt ou na Netlify.

## Menela Experience

A raiz continua sendo o site do evento (deploy estático na Netlify, `netlify.toml` da raiz). Ele não foi substituído pela calculadora.

```bash
npm install
npm run dev
```

Para publicar a calculadora na Netlify, crie um segundo site apontando para este repositório com **Base directory** `calculadora`.
