/**
 * AudioSystem — synthesized WebAudio (per Constitution VIII sketch pattern,
 * upgraded to real clip loading in a later polish pass).
 * Ported from `sketches/hole-1-first-playable.html`.
 */

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private muted = false;
  private rollNode: AudioBufferSourceNode | null = null;
  private rollGain: GainNode | null = null;
  private rollFilter: BiquadFilterNode | null = null;
  private musicGain: GainNode | null = null;

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.rollGain && this.ctx) this.rollGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    if (this.musicGain && this.ctx)
      this.musicGain.gain.setTargetAtTime(m ? 0 : 0.02, this.ctx.currentTime, 0.2);
  }

  private ensure(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      const Ctx =
        (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
    }
    return this.ctx;
  }

  putt(): void {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    // High-freq snap (noise burst)
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2000;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.35, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    noise.connect(hp);
    hp.connect(ng);
    ng.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.06);
    // Low tock
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.08);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.35, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(og);
    og.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  cupRattle(): void {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const notes = [
      { f: 280, at: 0 },
      { f: 220, at: 0.09 },
      { f: 180, at: 0.2 },
    ];
    notes.forEach((n) => {
      const t = t0 + n.at;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t);
      osc.frequency.exponentialRampToValueAtTime(n.f * 0.6, t + 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 600;
      osc.connect(lp);
      lp.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  splash(): void {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const env = Math.exp(-i / (ctx.sampleRate * 0.15));
      d[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1200, t);
    bp.frequency.exponentialRampToValueAtTime(300, t + 0.4);
    bp.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start(t);
  }

  bounce(speed: number): void {
    if (speed < 1.5) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);
    const g = ctx.createGain();
    const vol = Math.min(0.2, speed / 30);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  medalJingle(tier: 'bronze' | 'silver' | 'gold'): void {
    const notes =
      tier === 'gold'
        ? [523, 659, 784, 1047, 1319]
        : tier === 'silver'
          ? [523, 659, 784, 988]
          : [440, 554, 659];
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    notes.forEach((f, i) => {
      const t = t0 + i * 0.11;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.14, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  startRoll(): void {
    if (this.muted) return;
    if (this.rollNode) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    this.rollNode = ctx.createBufferSource();
    this.rollNode.buffer = buf;
    this.rollNode.loop = true;
    this.rollFilter = ctx.createBiquadFilter();
    this.rollFilter.type = 'lowpass';
    this.rollFilter.frequency.value = 500;
    this.rollFilter.Q.value = 1.5;
    this.rollGain = ctx.createGain();
    this.rollGain.gain.value = 0;
    this.rollNode.connect(this.rollFilter);
    this.rollFilter.connect(this.rollGain);
    this.rollGain.connect(ctx.destination);
    this.rollNode.start();
  }

  updateRoll(speed: number): void {
    if (this.muted) return;
    if (!this.rollGain) this.startRoll();
    if (!this.rollGain || !this.rollFilter || !this.ctx) return;
    const target = Math.min(0.06, speed / 60);
    this.rollGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    this.rollFilter.frequency.setTargetAtTime(400 + speed * 30, this.ctx.currentTime, 0.05);
  }

  stopRoll(): void {
    if (!this.rollGain || !this.ctx) return;
    this.rollGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
  }
}
