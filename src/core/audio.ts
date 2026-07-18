export class UIAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted = true;

  public init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = false;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) this.init();
    return this.isMuted;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors during rapid rendering
    }
  }

  public playTick() {
    // Very subtle, high-pitched data blip
    this.playTone(2000, 'sine', 0.02, 0.01);
  }

  public playAlert() {
    // Two-tone warning chime for breaking news
    this.playTone(880, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(1100, 'square', 0.3, 0.05), 100);
  }

  public playOpen() {
    // Harmonic chord for opening windows/modals
    this.playTone(440, 'triangle', 0.2, 0.03);
    this.playTone(554, 'triangle', 0.3, 0.03); // C#
    this.playTone(659, 'triangle', 0.4, 0.03); // E
  }

  public playSeismic() {
    // Deep low rumble for earthquake events
    this.playTone(50, 'sawtooth', 0.5, 0.1);
    setTimeout(() => this.playTone(40, 'sine', 0.8, 0.1), 100);
  }
}

export const uiAudio = new UIAudioEngine();
