# Repositório

Há dois aplicativos aqui.

## Calculadora de Precificação (Método Essence)

Pasta [`calculadora`](calculadora/README.md). React + Vite e uma API Node com SQLite. Cada pessoa entra com e-mail e senha; os cenários salvos são só dela.

```bash
cd calculadora
npm install
npm run dev
```

Abra `http://localhost:5173`. Detalhes de produção, testes e autenticação estão no README da pasta.

## Menela Experience

A raiz continua sendo o site do evento (deploy estático na Netlify, `netlify.toml`). Ele não foi substituído pela calculadora.

```bash
npm install
npm run dev
```

A calculadora não entra nesse build: ela precisa do processo Node por causa do login e do banco.
