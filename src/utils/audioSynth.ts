// Meditative Tanpura / Flute Harmonics synthesizer using Web Audio API for offline-ready spiritual listening
class SpiritualAudioEngine {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playPasayadanTone(onStop?: () => void) {
    this.initContext();
    if (!this.ctx) return;
    this.stop();

    this.isPlaying = true;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.5);
    this.gainNode.connect(this.ctx.destination);

    // Fundamental notes in C# (Sa - Pa harmonic drone traditional in Maharashtra Bhakti kirtans)
    const baseFreq = 138.59; // C#3
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 3, baseFreq * 4.02];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle LFO for breathing drone effect
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.05, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.2 / (idx + 1), this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();
      this.oscillators.push(osc, lfo);
    });

    if (onStop) {
      setTimeout(() => {
        if (this.isPlaying) {
          this.stop();
          onStop();
        }
      }, 150000); // 2.5 minutes Pasayadan
    }
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    }
    setTimeout(() => {
      this.oscillators.forEach(o => {
        try {
          o.stop();
          o.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 600);
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const spiritualAudio = new SpiritualAudioEngine();
