// ============================================================
//  Sound Engine — Web Audio API
//  ------------------------------------------------------------
//  No external audio files needed. All sounds are synthesized:
//   - Ambient music-box / gentle-strings pad (looping)
//   - Chime / sparkle on bloom and click
//   - Soft gate creak
//  A mute/unmute toggle is exposed via the exported hook.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';

type Mood = 'gate' | 'bloom' | 'click' | 'rare' | 'celebrate' | 'firefly';

class GardenAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private musicPlaying = false;
  muted = false;

  private ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.0;
    this.musicGain.connect(this.master);
  }

  resume() {
    this.ensure();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.2);
    }
  }

  // ---- One-shot chimes ----
  play(mood: Mood) {
    this.ensure();
    if (!this.ctx || !this.master) return;
    this.resume();
    const t = this.ctx.currentTime;
    switch (mood) {
      case 'gate':
        this.creak(t);
        this.chime(t + 0.15, 523.25, 0.5); // C5
        break;
      case 'bloom':
        this.chime(t, 659.25, 0.6); // E5
        this.chime(t + 0.08, 783.99, 0.5); // G5
        this.sparkle(t + 0.05);
        break;
      case 'click':
        this.chime(t, 880, 0.35); // A5
        this.sparkle(t);
        break;
      case 'rare':
        this.chime(t, 523.25, 0.7);
        this.chime(t + 0.06, 659.25, 0.6);
        this.chime(t + 0.12, 783.99, 0.6);
        this.chime(t + 0.18, 1046.5, 0.7); // C6
        this.sparkle(t + 0.1);
        this.sparkle(t + 0.25);
        break;
      case 'firefly':
        this.chime(t, 1318.51, 0.3); // E6
        this.sparkle(t);
        break;
      case 'celebrate':
        [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) =>
          this.chime(t + i * 0.12, f, 0.8),
        );
        this.sparkle(t + 0.2);
        this.sparkle(t + 0.5);
        break;
    }
  }

  private chime(start: number, freq: number, dur: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(this.master);
    osc.start(start);
    osc.stop(start + dur + 0.05);

    // gentle harmonic shimmer
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;
    gain2.gain.setValueAtTime(0, start);
    gain2.gain.linearRampToValueAtTime(0.06, start + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.7);
    osc2.connect(gain2).connect(this.master);
    osc2.start(start);
    osc2.stop(start + dur);
  }

  private sparkle(start: number) {
    if (!this.ctx || !this.master) return;
    for (let i = 0; i < 4; i++) {
      const t = start + i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1800 + Math.random() * 2400;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain).connect(this.master);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  }

  private creak(start: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, start);
    osc.frequency.exponentialRampToValueAtTime(70, start + 0.5);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.04, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
    osc.connect(gain).connect(this.master);
    osc.start(start);
    osc.stop(start + 0.6);
  }

  // ---- Ambient music-box loop ----
  startMusic() {
    this.ensure();
    if (!this.ctx || !this.musicGain) return;
    this.resume();
    if (this.musicPlaying) return;
    this.musicPlaying = true;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.setTargetAtTime(0.12, this.ctx.currentTime, 1.5);
    }
    this.scheduleMusic();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.8);
    }
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // A gentle, repeating music-box melody in C major, soft and slow.
  private scheduleMusic() {
    if (!this.ctx || !this.musicGain || !this.musicPlaying) return;

    // C E G A G E D C — soft lullaby phrase
    const melody = [
      523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25,
      587.33, 698.46, 880.0, 987.77, 880.0, 698.46, 659.25, 587.33,
    ];
    const noteDur = 0.9;
    const gap = 0.15;

    const playBar = (offset: number) => {
      if (!this.ctx || !this.musicGain || !this.musicPlaying) return;
      melody.forEach((f, i) => {
        const t = this.ctx!.currentTime + offset + i * (noteDur + gap);
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + noteDur);
        osc.connect(gain).connect(this.musicGain!);
        osc.start(t);
        osc.stop(t + noteDur + 0.05);

        // soft string pad underneath (root note)
        if (i % 4 === 0) {
          const pad = this.ctx!.createOscillator();
          const padGain = this.ctx!.createGain();
          pad.type = 'sine';
          pad.frequency.value = f / 2;
          padGain.gain.setValueAtTime(0, t);
          padGain.gain.linearRampToValueAtTime(0.08, t + 0.3);
          padGain.gain.exponentialRampToValueAtTime(0.0001, t + noteDur * 4);
          pad.connect(padGain).connect(this.musicGain!);
          pad.start(t);
          pad.stop(t + noteDur * 4 + 0.1);
        }
      });
    };

    const barLen = melody.length * (noteDur + gap);
    const loop = () => {
      if (!this.musicPlaying) return;
      playBar(0.05);
      this.musicTimer = window.setTimeout(loop, barLen * 1000);
    };
    loop();
  }
}

const audio = new GardenAudio();

export function useAudio() {
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      audio.setMuted(next);
      if (next) {
        audio.stopMusic();
        setMusicOn(false);
      }
      return next;
    });
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicOn((on) => {
      if (muted) return false;
      const next = !on;
      if (next) audio.startMusic();
      else audio.stopMusic();
      return next;
    });
  }, [muted]);

  const play = useCallback((mood: Mood) => {
    if (!audio.muted) audio.play(mood);
  }, []);

  const unlock = useCallback(() => {
    audio.resume();
  }, []);

  useEffect(() => {
    return () => audio.stopMusic();
  }, []);

  return { muted, musicOn, toggleMute, toggleMusic, play, unlock };
}
