let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** Plays a short burst of noise that sounds like applause/clapping */
export function playApplause(): void {
  try {
    const ctx = getAudioContext();
    const duration = 1.8;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(2, length, sampleRate);

    // Generate clapping noise: filtered bursts of noise
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        // Envelope: quick rise, gradual fade
        const envelope = Math.exp(-t * 2.5) * (1 - Math.exp(-t * 40));
        // Random noise modulated by rapid "clap" pulses
        const clapRate = 12 + Math.random() * 4;
        const clapPulse = 0.4 + 0.6 * Math.pow(Math.abs(Math.sin(Math.PI * clapRate * t)), 0.3);
        data[i] = (Math.random() * 2 - 1) * envelope * clapPulse * 0.4;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter to make it sound more like clapping
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.7;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // Audio not available — silently ignore
  }
}
