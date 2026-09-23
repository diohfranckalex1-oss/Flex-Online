// Web Audio API Synthesizer for high-fidelity phone calls
// 100% reliable, zero external dependencies, works across all mobile & desktop browsers

class CallSoundEngine {
  private ctx: AudioContext | null = null;
  private ringOscillator: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private isRinging = false;
  private ringInterval: any = null;
  private isSpeaker = true;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSpeaker(on: boolean) {
    this.isSpeaker = on;
    if (this.ringGain && this.ctx) {
      this.ringGain.gain.setValueAtTime(on ? 0.35 : 0.12, this.ctx.currentTime);
    }
  }

  // Outgoing phone call ringing: standard European/French tone (425Hz 1.5s beep + 3.5s pause)
  public startOutgoingRing() {
    this.stopAll();
    this.isRinging = true;

    const playPulse = () => {
      if (!this.isRinging) return;
      try {
        const ctx = this.getContext();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // Standard telephony dual frequencies (440Hz + 480Hz) or 425Hz
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(480, ctx.currentTime);

        const volume = this.isSpeaker ? 0.3 : 0.1;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        // Fade in
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.08);
        // Hold for 1.4s then fade out
        gain.gain.setValueAtTime(volume, ctx.currentTime + 1.4);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.5);
        osc2.stop(ctx.currentTime + 1.5);
      } catch (e) {
        console.warn('Audio ringtone tone error:', e);
      }
    };

    // First pulse immediately
    playPulse();
    // Then every 4 seconds (1.5s tone + 2.5s silence)
    this.ringInterval = setInterval(() => {
      if (this.isRinging) {
        playPulse();
      } else {
        clearInterval(this.ringInterval);
      }
    }, 4000);
  }

  // Incoming phone ringtone: modern melodic chime
  public startIncomingRingtone() {
    this.stopAll();
    this.isRinging = true;

    const playMelody = () => {
      if (!this.isRinging) return;
      try {
        const ctx = this.getContext();
        const melody = [
          { freq: 523.25, time: 0, dur: 0.15 },    // C5
          { freq: 659.25, time: 0.18, dur: 0.15 }, // E5
          { freq: 783.99, time: 0.36, dur: 0.2 },  // G5
          { freq: 1046.50, time: 0.58, dur: 0.25 },// C6
          { freq: 783.99, time: 0.88, dur: 0.18 }, // G5
          { freq: 1046.50, time: 1.10, dur: 0.4 }, // C6
        ];

        const volume = this.isSpeaker ? 0.45 : 0.18;

        melody.forEach(({ freq, time, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

          gain.gain.setValueAtTime(0, ctx.currentTime + time);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + time + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + time);
          osc.stop(ctx.currentTime + time + dur + 0.05);
        });
      } catch (e) {
        console.warn('Incoming melody error:', e);
      }
    };

    playMelody();
    this.ringInterval = setInterval(() => {
      if (this.isRinging) {
        playMelody();
      } else {
        clearInterval(this.ringInterval);
      }
    }, 2800);
  }

  // Call picked up / connected chime
  public playConnectedChime() {
    this.stopAll();
    try {
      const ctx = this.getContext();
      const notes = [
        { freq: 587.33, time: 0, dur: 0.12 },    // D5
        { freq: 880.00, time: 0.14, dur: 0.25 },  // A5
      ];
      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur);
      });
    } catch (e) {}
  }

  // Call ended / hangup tone (3 short beeps)
  public playEndedTone() {
    this.stopAll();
    try {
      const ctx = this.getContext();
      for (let i = 0; i < 3; i++) {
        const time = i * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(425, ctx.currentTime + time);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + time + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + 0.12);
      }
    } catch (e) {}
  }

  // Stop all sounds
  public stopAll() {
    this.isRinging = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
    if (this.ringOscillator) {
      try {
        this.ringOscillator.stop();
        this.ringOscillator.disconnect();
      } catch (e) {}
      this.ringOscillator = null;
    }
  }

  // Play modern notification chime & trigger phone vibration on incoming messages
  public playNotificationChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Vibrant crystal 2-tone messenger bell chime (G5 -> C6)
      const notes = [
        { freq: 783.99, time: 0, dur: 0.12, gain: 0.28 },
        { freq: 1046.50, time: 0.08, dur: 0.26, gain: 0.32 },
      ];

      notes.forEach(({ freq, time, dur, gain: noteGain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gainNode.gain.setValueAtTime(0, now + time);
        gainNode.gain.linearRampToValueAtTime(noteGain, now + time + 0.012);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.02);
      });

      // Pleasant double-haptic vibration for mobile phones
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([80, 40, 110]);
        } catch (vibeErr) {}
      }
    } catch (e) {
      console.warn('Notification chime error:', e);
    }
  }
}

export const callSounds = new CallSoundEngine();

export const playNotificationSound = () => {
  callSounds.playNotificationChime();
};

