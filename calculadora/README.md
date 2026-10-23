# Calculadora de Precificação — Método Essence

Ferramenta de mentoria (Edna Mari) para formar o preço de um atendimento. O pró-labore entra no custo; a margem de lucro é aplicada por cima. Cada pessoa cria a própria conta e só vê os próprios cenários.

O site da Menela Experience continua na raiz deste repositório. Esta pasta é a calculadora.

## Requisitos

- Node.js 22.5 ou mais recente (a API usa o SQLite embutido do Node, `node:sqlite`)
- npm

Não há chave de Supabase nem de outro serviço.

## Desenvolvimento

Na pasta `calculadora`:

```bash
npm install
npm run dev
```

Isso sobe a API em `http://127.0.0.1:8787` e o Vite em `http://localhost:5173`. Abra o endereço do Vite. O Vite encaminha `/api` para a API.

Conta de teste: use **Criar conta** com e-mail, nome e senha (8 a 72 caracteres).

Os valores de exemplo (material R$ 20, fixo R$ 25, taxas 8%, margem 20%, remuneração R$ 4.000, 100 horas, 1 hora) produzem preço sugerido de **R$ 118,06**.

## Produção

```bash
npm run build
npm start
```

O comando `npm start` serve a pasta `dist` e a API na mesma porta (`http://localhost:8787` por padrão). Não publique só o `dist`: sem a API não há login nem histórico.

## Testes e checagens

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Autenticação

- Cadastro e entrada com e-mail e senha. O e-mail é guardado em minúsculas.
- A senha é hash bcrypt (custo 12). O banco não guarda a senha em texto puro.
- A sessão é um token aleatório. Só o SHA-256 dele fica no SQLite. O navegador recebe o token num cookie `essence_session` (`HttpOnly`, `SameSite=Lax`, 14 dias). Em HTTPS (cabeçalho `X-Forwarded-Proto: https`) o cookie também vai com `Secure`.
- Cada cenário é gravado com o `user_id` da sessão. Listar, salvar e excluir filtram por essa pessoa. Outra conta não vê nem apaga o registro.

O arquivo padrão é `data/app.db` (não versionado).

## Variáveis opcionais

Veja `.env.example`.

| Variável | Padrão | Uso |
| --- | --- | --- |
| `PORT` | `8787` | Porta da API |
| `DATABASE_PATH` | `data/app.db` | Arquivo SQLite |
| `BCRYPT_ROUNDS` | `12` | Custo do hash. Use `4` só em teste |

## Fórmula

1. Hora técnica = remuneração mensal / horas produtivas. Horas vazias ou zero interrompem o cálculo — o sistema não troca isso por 1.
2. Pró-labore do atendimento = hora técnica × tempo do procedimento.
3. Custo = produtos + rateio de despesas fixas + pró-labore.
4. Preço sugerido = custo / (1 − taxas − margem), com taxas e margem em fração.
5. Se taxas + margem forem 100% ou mais, a tela mostra erro. O custo bruto não aparece como preço sugerido.
6. Preço com desconto = preço sugerido × (1 − desconto). Se ficar abaixo do custo, ou se a margem efetiva depois das taxas ficar negativa, o alerta deixa claro que o preço não é saudável.

A conta é feita em centavos para o relatório fechar.

## O que a interface faz

- Explica, em português, que o pró-labore está dentro do custo e a margem vem depois.
- Mostra a composição (materiais, fixos, pró-labore, taxas, lucro).
- Salva cenários com o nome do procedimento, compara dois preços e exporta CSV.
- Imprimir / salvar PDF esconde o formulário e deixa o relatório.
