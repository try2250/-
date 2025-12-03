// Native Web Audio API implementation - No external files required
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

export const playTick = () => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Short high blip
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playFanfare = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    
    // Major triad arpeggio (C Major)
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const start = now + i * 0.08;
        const duration = 0.4;
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.start(start);
        osc.stop(start + duration + 0.1);
    });
  } catch (e) {}
};

export const playSuccess = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    
    // High cheerful ding
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.1);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    osc.start();
    osc.stop(now + 0.8);
  } catch (e) {}
};

export const playFailure = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    
    // Low buzzer
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    
    osc.start();
    osc.stop(now + 0.3);
  } catch (e) {}
};