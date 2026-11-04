import { expect, test } from '@playwright/test';

test.describe('Asterion MVP · Testes de Fumaça e Aceite E2E', () => {
  test('abre a vila 3D com 800 moradores fora do React, clica numa casa, reivindica e sincroniza Obra em tempo real entre 2 abas', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const aba1 = await context.newPage();
    await aba1.goto('/');

    // 1. Verifica que o canvas do Three.js está fora do #hud-root do React
    const canvasForaDoReact = await aba1.evaluate(() => {
      const canvas = document.getElementById('asterion-canvas');
      const hudRoot = document.getElementById('hud-root');
      return Boolean(canvas && hudRoot && !hudRoot.contains(canvas));
    });
    expect(canvasForaDoReact).toBe(true);

    // 2. Verifica cabeçalho DIA N · 800 MORADORES e medidor de FPS
    await expect(aba1.getByTestId('hud-topo-contador')).toContainText('800 MORADORES');
    await expect(aba1.getByTestId('medidor-fps')).toContainText('FPS');

    await aba1.waitForTimeout(1400);
    await aba1.screenshot({
      path: '/opt/cursor/artifacts/asterion_fase1_vila_dia.png',
    });

    // 3. Clica numa casa da vila (via canvas 3D / motor) e confere o painel da casa
    await aba1.evaluate(() => {
      const motor = (
        window as unknown as {
          __asterionMotor?: { selecionarCasa: (idx: number, voar: boolean) => void };
        }
      ).__asterionMotor;
      motor?.selecionarCasa(2, true);
    });
    await expect(aba1.getByTestId('painel-casa-selecionada')).toContainText('CASA #3');

    // 4. Reivindica casa com @mundoasterion e aprova para ver placa "SUA CASA" e brilho
    await aba1.getByTestId('nav-minha-casa').click();
    await aba1.getByTestId('input-arroba-reivindicar').fill('@mundoasterion');
    await aba1.getByTestId('botao-gerar-codigo').click();
    await expect(aba1.getByTestId('caixa-codigo-reivindicacao')).toContainText('AST-');
    await aba1.getByTestId('botao-simular-aprovacao-imediata').click();

    await expect(aba1.getByTestId('placa-3d-minha_casa')).toContainText('BRUNO FUNDADOR');

    // Alterna para Noite do Cucu para capturar vagalumes, olhos na mata e brilho da casa
    await aba1.getByTestId('botao-ciclo-dia-noite').click();
    await aba1.waitForTimeout(700);
    await aba1.screenshot({
      path: '/opt/cursor/artifacts/asterion_fase2_noite_cucu_800_casas.png',
    });

    // 5. Abre segunda aba e verifica que a contribuição na Obra da Semana aparece em tempo real nas duas abas
    const aba2 = await context.newPage();
    await aba2.goto('/');
    await aba1.getByTestId('nav-obra-semana').click();
    await aba2.getByTestId('nav-obra-semana').click();

    await expect(aba1.getByTestId('progresso-obra-madeira')).toContainText('9 / 12');
    await expect(aba2.getByTestId('progresso-obra-madeira')).toContainText('9 / 12');

    await aba1.getByTestId('contribuir-madeira').click();

    await expect(aba1.getByTestId('progresso-obra-madeira')).toContainText('10 / 12');
    await expect(aba2.getByTestId('progresso-obra-madeira')).toContainText('10 / 12');

    await aba1.screenshot({
      path: '/opt/cursor/artifacts/asterion_obra_tempo_real.png',
    });

    await context.close();
  });

  test('funciona em tela de celular (390x844) com botões para o polegar e gera card 1080x1920 para Story', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.getByTestId('hud-topo-contador')).toContainText('800 MORADORES');
    await page.getByTestId('botao-compartilhar-story').click();
    await expect(page.locator('img[alt*="1080x1920"]')).toBeVisible();

    await page.screenshot({
      path: '/opt/cursor/artifacts/asterion_mobile_story.png',
    });

    await context.close();
  });
});
