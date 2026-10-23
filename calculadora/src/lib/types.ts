import type { CompletePricingInput } from './pricing.ts';

export type PublicUser = {
  id: number;
  email: string;
  name: string;
};

export type ScenarioDTO = {
  id: number;
  nomeProcedimento: string;
  inputs: CompletePricingInput;
  createdAt: string;
  precoSugerido: number;
  custoTotal: number;
};
