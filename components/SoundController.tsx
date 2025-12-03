import React, { useEffect, useRef } from 'react';

interface SoundControllerProps {
  isMuted: boolean;
}

const SoundController: React.FC<SoundControllerProps> = ({ isMuted }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Ambient Nodes
  const ambientOsc1Ref = useRef<OscillatorNode | null>(null);
  const ambientOsc2Ref = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Scroll/Warp Nodes
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const scrollFilterRef = useRef<BiquadFilterNode | null>(null);
  const scrollGainRef = useRef<GainNode | null>(null);

  // State for scroll physics
  const scrollState = useRef({
    lastY: 0,
    velocity: 0,
    targetVelocity: 0
  });

  const requestRef = useRef<number>(0);

  // Initialize Audio Engine
  useEffect(() => {
    const initAudio = async () => {
      if (audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Master Gain (Volume Control)
      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : 0.5;
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // --- 1. Ambient Drone (Calming) ---
      // Two sine waves slightly detuned for binaural beats/shimmer
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 110; // A2

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 112; // Slight detune

      const ambientGain = ctx.createGain();
      ambientGain.gain.value = 0.05; // Very subtle

      osc1.connect(ambientGain);
      osc2.connect(ambientGain);
      ambientGain.connect(masterGain);

      osc1.start();
      osc2.start();

      ambientOsc1Ref.current = osc1;
      ambientOsc2Ref.current = osc2;
      ambientGainRef.current = ambientGain;

      // --- 2. Scroll Warp Effect (Whoosh) ---
      // Pink Noise Generator
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        // Pink noise approximation
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; 
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Bandpass filter to shape the noise into a wind/warp sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 1;
      filter.frequency.value = 200; // Base freq

      const scrollGain = ctx.createGain();
      scrollGain.gain.value = 0; // Silent when not scrolling

      noiseNode.connect(filter);
      filter.connect(scrollGain);
      scrollGain.connect(masterGain);
      
      noiseNode.start();

      noiseNodeRef.current = noiseNode;
      scrollFilterRef.current = filter;
      scrollGainRef.current = scrollGain;
    };

    // User interaction is required to start audio context
    const handleUserGesture = () => {
      if (!audioContextRef.current) {
        initAudio();
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('scroll', handleUserGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('scroll', handleUserGesture);
    };
  }, []);

  // Update Mute State
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      // Smooth fade
      const now = audioContextRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
      masterGainRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : 0.5, now + 0.5);
      
      if (!isMuted && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    }
  }, [isMuted]);

  // Scroll Animation Loop
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - scrollState.current.lastY);
      
      // Cap max velocity to avoid ear-piercing sounds
      const maxDelta = 100; 
      scrollState.current.targetVelocity = Math.min(delta, maxDelta) / maxDelta; // 0 to 1
      scrollState.current.lastY = currentY;
    };

    window.addEventListener('scroll', onScroll);

    const animateAudio = () => {
      const { velocity, targetVelocity } = scrollState.current;
      
      // Smooth decay for velocity (easing)
      // Approach target
      const newVelocity = velocity + (targetVelocity - velocity) * 0.1;
      scrollState.current.velocity = newVelocity;
      
      // Reset target to 0 each frame (so if scroll stops, target becomes 0)
      scrollState.current.targetVelocity = 0; 

      if (scrollGainRef.current && scrollFilterRef.current && audioContextRef.current) {
        // Modulate Gain: 0 to 0.4
        const gainVal = newVelocity * 0.4;
        scrollGainRef.current.gain.setTargetAtTime(gainVal, audioContextRef.current.currentTime, 0.1);

        // Modulate Filter Frequency: 200Hz to 1200Hz (Rising pitch "Warp")
        const freqVal = 200 + (newVelocity * 1000);
        scrollFilterRef.current.frequency.setTargetAtTime(freqVal, audioContextRef.current.currentTime, 0.1);
      }

      requestRef.current = requestAnimationFrame(animateAudio);
    };

    requestRef.current = requestAnimationFrame(animateAudio);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return null; // Logic only component
};

export default SoundController;