import React, { useEffect, useRef } from 'react';

interface SoundControllerProps {
  isMuted: boolean;
}

const SoundController: React.FC<SoundControllerProps> = ({ isMuted }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Background Music (MP3)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicGainRef = useRef<GainNode | null>(null);
  const bgMusicSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Scroll/Warp Nodes
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const scrollFilterRef = useRef<BiquadFilterNode | null>(null);
  const scrollGainRef = useRef<GainNode | null>(null);
  const scrollLfoRef = useRef<OscillatorNode | null>(null);

  // Click FX
  const clickGainRef = useRef<GainNode | null>(null);

  // Generative music
  const musicGainRef = useRef<GainNode | null>(null);
  const musicFilterRef = useRef<BiquadFilterNode | null>(null);
  const musicIntervalRef = useRef<number | null>(null);
  const musicStartedRef = useRef(false);
  const musicChordIndexRef = useRef(0);

  // State for scroll physics
  const scrollState = useRef({
    lastY: 0,
    velocity: 0,
    targetVelocity: 0
  });

  const requestRef = useRef<number>(0);

  // Initialize Audio Engine
  useEffect(() => {
    const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

    const triggerMusicNote = (frequency: number) => {
      if (!audioContextRef.current || !musicGainRef.current) return;
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(0.1, now + 0.18);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      osc.connect(env);
      env.connect(musicGainRef.current);
      osc.start(now);
      osc.stop(now + 3.2);
    };

    const startMusicLoop = () => {
      if (musicStartedRef.current || !audioContextRef.current || !musicGainRef.current) return;
      musicStartedRef.current = true;
      const baseMidi = 45; // A2 base
      const chords: number[][] = [
        [0, 7, 12, 16],      // i add11
        [3, 10, 15],         // III add9
        [8, 12, 17],         // VI add11
        [5, 10, 14]          // iv add9
      ];

      const launchChord = () => {
        const idx = musicChordIndexRef.current % chords.length;
        musicChordIndexRef.current += 1;
        const chord = chords[idx];
        chord.forEach(step => {
          const drift = (Math.random() * 0.2) - 0.1;
          const freq = midiToFreq(baseMidi + step + drift);
          triggerMusicNote(freq);
        });
      };

      launchChord();
      musicIntervalRef.current = window.setInterval(() => {
        launchChord();
      }, 12000 + Math.random() * 6000);
    };

    const initAudio = async () => {
      if (audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Master Gain (Volume Control)
      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : 0.7;
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // --- 1. Background Music (MP3) ---
      const bgMusic = new Audio('/dark-ambient-soundscape-music-409350.mp3');
      bgMusic.loop = true;
      bgMusic.volume = 1; // Full volume, control via Web Audio API
      bgMusicRef.current = bgMusic;

      // Connect audio element to Web Audio API for better control
      const bgMusicSource = ctx.createMediaElementSource(bgMusic);
      const bgMusicGain = ctx.createGain();
      bgMusicGain.gain.value = isMuted ? 0 : 0.3; // Subtle volume
      bgMusicSource.connect(bgMusicGain);
      bgMusicGain.connect(masterGain);

      bgMusicGainRef.current = bgMusicGain;
      bgMusicSourceRef.current = bgMusicSource;

      // Start playing (will need user interaction)
      bgMusic.play().catch(() => {
        // Will be triggered by user interaction later
      });

      // --- 2. Scroll Warp Effect (Whoosh) ---
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 1.5;
      filter.frequency.value = 220; // Base freq

      const scrollGain = ctx.createGain();
      scrollGain.gain.value = 0; // Silent when not scrolling

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.25;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 120;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      noiseNode.connect(filter);
      filter.connect(scrollGain);
      scrollGain.connect(masterGain);

      noiseNode.start();

      noiseNodeRef.current = noiseNode;
      scrollFilterRef.current = filter;
      scrollGainRef.current = scrollGain;
      scrollLfoRef.current = lfo;

      // --- 3. Click FX (50% volume reduction) ---
      const clickGain = ctx.createGain();
      clickGain.gain.value = 0.4; // Reduced from 0.8
      clickGain.connect(masterGain);
      clickGainRef.current = clickGain;

      // --- 4. Generative Music Bus ---
      const musicGain = ctx.createGain();
      musicGain.gain.value = 0.18;
      const musicFilter = ctx.createBiquadFilter();
      musicFilter.type = 'lowpass';
      musicFilter.frequency.value = 2200;
      musicGain.connect(musicFilter);
      musicFilter.connect(masterGain);
      musicGainRef.current = musicGain;
      musicFilterRef.current = musicFilter;

      startMusicLoop();
    };

    const handleUserGesture = () => {
      if (!audioContextRef.current) {
        initAudio();
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Try to play background music on user interaction
      if (bgMusicRef.current && bgMusicRef.current.paused && !isMuted) {
        bgMusicRef.current.play().catch((err) => {
          console.log('Background music autoplay prevented:', err);
        });
      }
    };

    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('scroll', handleUserGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('scroll', handleUserGesture);
    };
  }, [isMuted]);

  // Update Mute State
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      // Smooth fade
      const now = audioContextRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
      masterGainRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : 0.7, now + 0.5);

      // Silence sub-buses quickly on mute
      if (musicGainRef.current) {
        musicGainRef.current.gain.setTargetAtTime(isMuted ? 0 : 0.18, now, 0.05);
      }
      if (scrollGainRef.current) {
        scrollGainRef.current.gain.setTargetAtTime(isMuted ? 0 : scrollGainRef.current.gain.value, now, 0.05);
      }

      // Control background music (MP3)
      if (bgMusicGainRef.current) {
        bgMusicGainRef.current.gain.setTargetAtTime(isMuted ? 0 : 0.3, now, 0.5);
      }

      if (!isMuted && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Control background music playback
      if (bgMusicRef.current) {
        if (isMuted) {
          bgMusicRef.current.pause();
        } else {
          bgMusicRef.current.play().catch(() => {
            // Autoplay prevented
          });
        }
      }
    }
  }, [isMuted]);

  // Scroll Animation Loop
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - scrollState.current.lastY);

      // Cap max velocity to avoid ear-piercing sounds
      const maxDelta = 180;
      scrollState.current.targetVelocity = Math.min(delta, maxDelta) / maxDelta; // 0 to 1
      scrollState.current.lastY = currentY;
    };

    const onClick = (e: MouseEvent) => {
      if (!audioContextRef.current || !clickGainRef.current || isMuted) return;
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Velocity response: tie intensity to scroll velocity
      const velocity = scrollState.current.velocity;
      const intensity = 0.7 + Math.min(1, velocity * 2.0) * 0.5; // 0.7 - 1.2

      // Randomized timing micro-delay (0-12ms) - mimics physical hammer travel
      const hitDelay = Math.random() * 0.012;
      const startTime = now + hitDelay;

      // Random pitch variation ±8-15% - prevents machine-gun effect
      const pitchVariation = 1 + (Math.random() * 0.26 - 0.13); // ±13% (~8-15% range)

      // --- CORE SOUND: Short, sharp impulse (typewriter strike) ---
      const coreEnv = ctx.createGain();
      coreEnv.gain.setValueAtTime(0.0001, startTime);
      coreEnv.gain.exponentialRampToValueAtTime(0.35 * intensity, startTime + 0.001); // Attack: 0.001s
      coreEnv.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.06); // Decay: 0.06s
      coreEnv.connect(clickGainRef.current);

      // High-pitched membrane/metal hit (2.5-3.5 kHz base)
      const baseFreq = 3000 * pitchVariation;
      const coreOsc = ctx.createOscillator();
      coreOsc.type = 'square'; // Sharp, percussive
      coreOsc.frequency.setValueAtTime(baseFreq, startTime);
      coreOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, startTime + 0.04); // Quick pitch drop
      coreOsc.connect(coreEnv);

      // White noise impulse for "snap"
      const noiseBuf = ctx.createBuffer(1, 512, ctx.sampleRate);
      const noiseData = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuf;

      const noiseEnv = ctx.createGain();
      noiseEnv.gain.setValueAtTime(0.0001, startTime);
      noiseEnv.gain.exponentialRampToValueAtTime(0.15 * intensity, startTime + 0.001);
      noiseEnv.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);
      noiseSource.connect(noiseEnv);
      noiseEnv.connect(coreEnv);

      // --- METALLIC RING: FM bell / plucked sine (2-4 kHz) ---
      const ringFreq = (2500 + Math.random() * 1500) * pitchVariation; // 2-4 kHz randomized
      const ringOsc = ctx.createOscillator();
      ringOsc.type = 'sine';
      ringOsc.frequency.setValueAtTime(ringFreq, startTime);

      const ringEnv = ctx.createGain();
      ringEnv.gain.setValueAtTime(0.0001, startTime);
      ringEnv.gain.exponentialRampToValueAtTime(0.12 * intensity, startTime + 0.002);
      ringEnv.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.06); // Decay: 0.06s
      ringOsc.connect(ringEnv);
      ringEnv.connect(clickGainRef.current);

      // --- SPRING "BOING" TAIL: Ultra-quiet, heavily damped ---
      const springFreq = (280 + Math.random() * 120) * pitchVariation; // 280-400 Hz
      const springOsc = ctx.createOscillator();
      springOsc.type = 'triangle';
      springOsc.frequency.setValueAtTime(springFreq, startTime);
      springOsc.frequency.exponentialRampToValueAtTime(springFreq * 0.5, startTime + 0.08); // Pitch drops

      const springEnv = ctx.createGain();
      springEnv.gain.setValueAtTime(0.0001, startTime + 0.01); // Slightly delayed
      springEnv.gain.exponentialRampToValueAtTime(0.03 * intensity, startTime + 0.015); // Very quiet
      springEnv.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.1); // Quick decay
      springOsc.connect(springEnv);
      springEnv.connect(clickGainRef.current);

      // --- OPTIONAL: Detect "spacebar" (bigger elements) for deeper "thock" ---
      const target = e.target as HTMLElement;
      const isSpacebar = target.tagName === 'BUTTON' ||
                         target.classList.contains('cta') ||
                         target.closest('button') !== null;

      if (isSpacebar) {
        const thockFreq = 180 * pitchVariation; // Lower frequency
        const thockOsc = ctx.createOscillator();
        thockOsc.type = 'sine';
        thockOsc.frequency.setValueAtTime(thockFreq, startTime);

        const thockEnv = ctx.createGain();
        thockEnv.gain.setValueAtTime(0.0001, startTime);
        thockEnv.gain.exponentialRampToValueAtTime(0.18 * intensity, startTime + 0.003);
        thockEnv.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12); // Longer decay
        thockOsc.connect(thockEnv);
        thockEnv.connect(clickGainRef.current);

        thockOsc.start(startTime);
        thockOsc.stop(startTime + 0.13);
      }

      // Start all oscillators
      coreOsc.start(startTime);
      noiseSource.start(startTime);
      ringOsc.start(startTime);
      springOsc.start(startTime);

      // Stop all oscillators
      coreOsc.stop(startTime + 0.08);
      noiseSource.stop(startTime + 0.05);
      ringOsc.stop(startTime + 0.08);
      springOsc.stop(startTime + 0.12);
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('click', onClick);

    const animateAudio = () => {
      const { velocity, targetVelocity } = scrollState.current;

      // Smooth decay for velocity (easing)
      const newVelocity = velocity + (targetVelocity - velocity) * 0.08;
      scrollState.current.velocity = newVelocity;
      scrollState.current.targetVelocity = 0;

      if (scrollGainRef.current && scrollFilterRef.current && audioContextRef.current) {
        // Modulate Gain: 0 to 0.25 (more subtle, reduced from 0.6)
        const gainVal = newVelocity * 0.25;
        scrollGainRef.current.gain.setTargetAtTime(gainVal, audioContextRef.current.currentTime, 0.12);

        // Modulate Filter Frequency: 300Hz to ~1.5kHz (gentler sweep)
        const freqVal = 300 + (newVelocity * 1200);
        scrollFilterRef.current.frequency.setTargetAtTime(freqVal, audioContextRef.current.currentTime, 0.12);
      }

      requestRef.current = requestAnimationFrame(animateAudio);
    };

    requestRef.current = requestAnimationFrame(animateAudio);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(requestRef.current);
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
        musicIntervalRef.current = null;
      }
    };
  }, [isMuted]);

  return null; // Logic only component
};

export default SoundController;
