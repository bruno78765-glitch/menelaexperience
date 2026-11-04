class GerenciadorSons {
  private ctx: AudioContext | null = null;
  public mutado = false;

  private obterContexto(): AudioContext | null {
    if (this.mutado || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public tocarPlim() {
    const ctx = this.obterContexto();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const notas = [523.25, 659.25, 783.99, 1046.5];
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, agora + i * 0.07);

      gain.gain.setValueAtTime(0.001, agora + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.18, agora + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, agora + i * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(agora + i * 0.07);
      osc.stop(agora + i * 0.07 + 0.36);
    });
  }

  public tocarClique() {
    const ctx = this.obterContexto();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, agora);
    osc.frequency.exponentialRampToValueAtTime(640, agora + 0.06);

    gain.gain.setValueAtTime(0.12, agora);
    gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(agora);
    osc.stop(agora + 0.08);
  }

  public tocarSustoCucu() {
    const ctx = this.obterContexto();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, agora);
    osc.frequency.linearRampToValueAtTime(110, agora + 0.45);

    gain.gain.setValueAtTime(0.12, agora);
    gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.48);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(agora);
    osc.stop(agora + 0.5);
  }
}

export const sons = new GerenciadorSons();
