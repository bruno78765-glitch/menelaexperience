import type { CompletePricingInput } from './pricing.ts';

export type PublicUser = {
  id: string;
  email: string;
  name: string;
};

export type ScenarioDTO = {
  id: string;
  nomeProcedimento: string;
  inputs: CompletePricingInput;
  createdAt: string;
  precoSugerido: number;
  custoTotal: number;
};
