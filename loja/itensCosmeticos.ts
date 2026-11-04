import type { ItemCosmetico } from '../src/tipos';

export const ITENS_COSMETICOS_CATALOGO: ItemCosmetico[] = [
  {
    id: 'cosm-telhado-solar',
    nome: 'Telhado Dourado dos Fundadores',
    categoria: 'telhado',
    preco_gemas: 120,
    exclusivo_fundador: true,
    preview_cor: '#f8d040',
  },
  {
    id: 'cosm-jardim-vagalumes',
    nome: 'Jardim de Vagalumes Azuis',
    categoria: 'jardim',
    preco_gemas: 80,
    exclusivo_fundador: false,
    preview_cor: '#3a7ac8',
  },
  {
    id: 'cosm-estandarte-cucu',
    nome: 'Estandarte do Guardião Noturno',
    categoria: 'estandarte',
    preco_gemas: 95,
    exclusivo_fundador: false,
    preview_cor: '#e2552e',
  },
  {
    id: 'cosm-mascote-ovelha',
    nome: 'Ovelhinha Voxel de Companhia',
    categoria: 'mascote',
    preco_gemas: 150,
    exclusivo_fundador: true,
    preview_cor: '#f2ead8',
  },
];
