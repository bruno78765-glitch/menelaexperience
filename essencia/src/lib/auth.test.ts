import { test } from 'node:test';
import { equal } from 'node:assert/strict';
import { limparEmail, limparSenha, paraUsuarioPublico, traduzirErroAuth } from './auth.ts';

test('e-mail e senha seguem os limites da conta', () => {
  equal(limparEmail('  Ana@Exemplo.com '), 'ana@exemplo.com');
  equal(limparEmail('invalido'), null);
  equal(limparSenha('1234567'), null);
  equal(limparSenha('12345678')?.length, 8);
});

test('erro de credencial sai em português', () => {
  equal(traduzirErroAuth({ code: 'invalid_credentials', message: 'Invalid login credentials' }, 'falhou'), 'E-mail ou senha incorretos.');
});

test('o nome público vem dos metadados da conta', () => {
  equal(paraUsuarioPublico({ id: '1', email: 'ana@exemplo.com', user_metadata: { name: 'Ana' } })?.name, 'Ana');
});
