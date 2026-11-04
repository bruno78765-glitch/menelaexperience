import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import {
  MotorCenaAsterion,
  type MetricasDesempenho,
  type Placa3DProjetada,
} from './cena/motorCena';
import { repositorioJogo } from './dados/repositorioJogo';

const canvasEl = document.getElementById('asterion-canvas') as HTMLCanvasElement | null;
if (!canvasEl) {
  throw new Error('Elemento #asterion-canvas não encontrado fora do React.');
}

let despacharPlacas: ((p: Placa3DProjetada[]) => void) | null = null;
let despacharMetricas: ((m: MetricasDesempenho) => void) | null = null;

const estadoInicial = repositorioJogo.obterEstado();

const motorCena = new MotorCenaAsterion({
  canvas: canvasEl,
  aoSelecionarCasa: (casaIdx) => {
    repositorioJogo.selecionarCasa(casaIdx);
  },
  aoClicarMarco: (tipo) => {
    if (tipo === 'urna') {
      const botaoUrna = document.querySelector(
        '[data-testid="nav-votacao"]'
      ) as HTMLButtonElement | null;
      botaoUrna?.click();
    }
  },
  aoAtualizarPlacas: (placas) => {
    despacharPlacas?.(placas);
  },
  aoAtualizarMetricas: (metricas) => {
    despacharMetricas?.(metricas);
  },
  aoEntrarNaNoite: () => {
    repositorioJogo.dispararNoiteDoCucu(false);
  },
});

motorCena.atualizarVila(estadoInicial.moradores, {
  minhaCasaIdx: estadoInicial.minhaCasaIdx,
  casaAssustadaIdx: estadoInicial.casaAssustadaIdx,
});

// Expõe referência para inspeção e testes E2E (Playwright)
(window as unknown as { __asterionMotor?: MotorCenaAsterion }).__asterionMotor = motorCena;

export function RaizHud() {
  const [placas, setPlacas] = useState<Placa3DProjetada[]>([]);
  const [metricas, setMetricas] = useState<MetricasDesempenho>({
    fps: 60,
    drawCalls: 12,
    casasVisiveis: estadoInicial.moradores.length,
    qualidade: 'alta',
    pixelRatio: 1,
    progressoCicloDia: 0.15,
    ehNoite: false,
  });

  useEffect(() => {
    despacharPlacas = setPlacas;
    despacharMetricas = setMetricas;
    return () => {
      despacharPlacas = null;
      despacharMetricas = null;
    };
  }, []);

  return <App motorCena={motorCena} placas={placas} metricas={metricas} />;
}

const hudRoot = document.getElementById('hud-root');
if (hudRoot) {
  createRoot(hudRoot).render(
    <StrictMode>
      <RaizHud />
    </StrictMode>
  );
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
