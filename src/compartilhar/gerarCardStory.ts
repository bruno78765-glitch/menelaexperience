import type { Morador, NivelMorador } from '../tipos';
import { TABELA_DEPENDENCIAS_PROFISSOES } from '../../regras/economia';

/**
 * Gera uma imagem vertical 1080x1920 (formato Instagram Story) em PNG DataURL
 * com a casa do morador, nome, @arroba, profissão, título e marca @mundoasterion.
 */
export function gerarCardStoryDataUrl(params: {
  morador: Morador;
  nivel: NivelMorador;
  diaVila: number;
  totalMoradores: number;
}): string {
  const { morador, nivel, diaVila, totalMoradores } = params;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Fundo estrelado noturno de Asterion (#0c1030 -> #1a255c)
  const gradFundo = ctx.createLinearGradient(0, 0, 0, 1920);
  gradFundo.addColorStop(0, '#0c1030');
  gradFundo.addColorStop(0.65, '#192655');
  gradFundo.addColorStop(1, '#2a4a3c');
  ctx.fillStyle = gradFundo;
  ctx.fillRect(0, 0, 1080, 1920);

  // Estrelas e vagalumes dourados
  ctx.fillStyle = '#f8d040';
  for (let i = 0; i < 65; i++) {
    const x = ((i * 173) % 1020) + 30;
    const y = ((i * 257) % 1200) + 40;
    const r = (i % 4) + 2;
    ctx.globalAlpha = 0.35 + (i % 5) * 0.12;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Moldura retrô dourada
  ctx.strokeStyle = '#f8d040';
  ctx.lineWidth = 8;
  ctx.strokeRect(48, 48, 984, 1824);

  // Cabeçalho da marca
  ctx.fillStyle = '#f8d040';
  ctx.font = 'bold 46px "Pixelify Sans", "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MUNDO ASTERION', 540, 160);

  ctx.fillStyle = '#f2ead8';
  ctx.font = '32px "Pixelify Sans", sans-serif';
  ctx.fillText(`DIA ${diaVila} · ${totalMoradores} MORADORES NA VILA`, 540, 220);

  // Ilha de grama (#5f9e46) e água (#3a7ac8)
  ctx.fillStyle = '#3a7ac8';
  ctx.beginPath();
  ctx.ellipse(540, 980, 390, 130, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5f9e46';
  ctx.beginPath();
  ctx.ellipse(540, 950, 340, 105, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ilustração voxel/low-poly da casa do morador
  // Base de pedra
  ctx.fillStyle = '#7c7872';
  ctx.fillRect(350, 880, 380, 45);

  // Parede com a cor da casa do morador
  ctx.fillStyle = morador.cor_parede || '#f2ead8';
  ctx.fillRect(370, 620, 340, 265);

  // Chaminé
  ctx.fillStyle = '#8c4a38';
  ctx.fillRect(620, 430, 58, 150);

  // Telhado escalonado voxel com a cor do morador
  ctx.fillStyle = morador.cor_telhado || '#e2552e';
  ctx.fillRect(330, 570, 420, 60);
  ctx.fillRect(370, 515, 340, 60);
  ctx.fillRect(420, 465, 240, 55);
  ctx.fillRect(475, 425, 130, 45);

  // Porta de madeira e janelas acesas (#f8d040)
  ctx.fillStyle = '#6b3e26';
  ctx.fillRect(500, 745, 80, 140);

  ctx.fillStyle = '#f8d040';
  ctx.fillRect(405, 685, 65, 65);
  ctx.fillRect(610, 685, 65, 65);

  // Placa de Casa Reivindicada
  ctx.fillStyle = '#0c1030';
  ctx.fillRect(140, 1140, 800, 430);
  ctx.strokeStyle = '#f8d040';
  ctx.lineWidth = 6;
  ctx.strokeRect(140, 1140, 800, 430);

  const defProf = TABELA_DEPENDENCIAS_PROFISSOES[morador.profissao];

  ctx.fillStyle = '#f8d040';
  ctx.font = 'bold 34px "Pixelify Sans", monospace';
  ctx.fillText(
    `CASA #${morador.casa_idx + 1} · ${morador.regiao === 1 ? 'ILHA NORTE' : 'VILA CENTRAL'}`,
    540,
    1215
  );

  ctx.fillStyle = '#f2ead8';
  ctx.font = 'bold 56px "Pixelify Sans", sans-serif';
  ctx.fillText(morador.nome.toUpperCase(), 540, 1300);

  if (morador.arroba) {
    ctx.fillStyle = '#8ec5ff';
    ctx.font = '36px "Pixelify Sans", monospace';
    ctx.fillText(`@${morador.arroba}`, 540, 1360);
  }

  ctx.fillStyle = '#f8d040';
  ctx.font = 'bold 42px "Pixelify Sans", sans-serif';
  ctx.fillText(`${defProf.nome.toUpperCase()} · ${nivel.titulo.toUpperCase()}`, 540, 1440);

  ctx.fillStyle = '#d1fae5';
  ctx.font = '30px "Pixelify Sans", sans-serif';
  ctx.fillText(`Objeto na porta: ${defProf.objetoPorta} · ${nivel.xp} XP`, 540, 1510);

  // Rodapé para o Story
  ctx.fillStyle = '#f2ead8';
  ctx.font = 'bold 36px "Pixelify Sans", sans-serif';
  ctx.fillText('Minha casa dos vídeos existe de verdade!', 540, 1710);

  ctx.fillStyle = '#f8d040';
  ctx.font = 'bold 40px "Pixelify Sans", monospace';
  ctx.fillText('@mundoasterion', 540, 1780);

  return canvas.toDataURL('image/png');
}
