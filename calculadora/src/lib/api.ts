import type { CompletePricingInput } from './pricing.ts';
import type { PublicUser, ScenarioDTO } from './types.ts';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'same-origin',
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'Não foi possível falar com o servidor. Confira se a API está no ar (npm run dev).');
  }

  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Não foi possível concluir a operação.');
  }
  return data as T;
}

export function getMe(signal?: AbortSignal): Promise<{ user: PublicUser | null }> {
  return request('/api/me', { signal });
}

export function register(input: { name: string; email: string; password: string }): Promise<{ user: PublicUser }> {
  return request('/api/register', { method: 'POST', body: JSON.stringify(input) });
}

export function login(input: { email: string; password: string }): Promise<{ user: PublicUser }> {
  return request('/api/login', { method: 'POST', body: JSON.stringify(input) });
}

export function logout(): Promise<{ ok: boolean }> {
  return request('/api/logout', { method: 'POST' });
}

export function listScenarios(): Promise<{ scenarios: ScenarioDTO[] }> {
  return request('/api/scenarios');
}

export function saveScenario(input: {
  nomeProcedimento: string;
  inputs: CompletePricingInput;
}): Promise<{ scenario: ScenarioDTO }> {
  return request('/api/scenarios', { method: 'POST', body: JSON.stringify(input) });
}

export function deleteScenario(id: number): Promise<{ ok: boolean }> {
  return request(`/api/scenarios/${id}`, { method: 'DELETE' });
}
