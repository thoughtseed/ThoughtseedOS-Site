import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Zap, Code, Terminal, MousePointer2 } from 'lucide-react';

// --- VELOCITY PARTICLE ENGINE (CANVAS) ---
const VelocityField: React.FC<{ scrollY: any }> = ({ scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Particles configuration
    const particleCount = 400;
    const particles: { x: number; y: number; z: number; size: number; color: string; speedMod: number }[] = [];
    const center = { x: width / 2, y: height / 2 };

    const colors = ['#ccff00', '#00ffff', '#ffffff', '#b026ff'];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width - center.x,
        y: Math.random() * height - center.y,
        z: Math.random() * width,
        size: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedMod: Math.random() * 0.5 + 0.5
      });
    }

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let scrollVelocity = 0;

    const onMouseMove = (e: MouseEvent) => {
      // Mouse affects particle direction slightly
      mouseX = (e.clientX - center.x) * 0.1;
      mouseY = (e.clientY - center.y) * 0.1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      // Clear with trail effect for "warp speed" feel
      ctx.fillStyle = 'rgba(3, 0, 20, 0.2)'; // Low opacity for trails
      ctx.fillRect(0, 0, width, height);

      // Calculate scroll velocity impact (simulated)
      const targetScrollVelocity = 2 + (window.scrollY * 0.1);
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.1; // Smooth ease

      particles.forEach(p => {
        // Move particles towards viewer (Z decreases)
        p.z -= scrollVelocity * p.speedMod;

        // Mouse parallax influence
        p.x += (mouseX - p.x) * 0.002;
        p.y += (mouseY - p.y) * 0.002;

        // Reset if passed viewer
        if (p.z <= 0) {
          p.z = width;
          p.x = Math.random() * width - center.x;
          p.y = Math.random() * height - center.y;
        }

        const scale = 500 / p.z;
        const x2d = p.x * scale + center.x;
        const y2d = p.y * scale + center.y;

        // Draw only if on screen
        if (x2d > 0 && x2d < width && y2d > 0 && y2d < height) {
          const alpha = 1 - (p.z / width);

          // Draw Star/Particle
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
          ctx.fill();

          // Velocity Streak (Warp Effect)
          if (scrollVelocity > 5) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * scale;
            ctx.lineCap = 'round';
            ctx.moveTo(x2d, y2d);
            // Streak direction radiates from center
            const angle = Math.atan2(y2d - center.y, x2d - center.x);
            const length = scrollVelocity * 2 * scale;
            ctx.lineTo(x2d - Math.cos(angle) * length, y2d - Math.sin(angle) * length);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      center.x = width / 2;
      center.y = height / 2;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen" />;
};


// --- HERO COMPONENT ---

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax Transforms
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoother springs for tilt
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mouseX = e.clientX - width / 2;
    const mouseY = e.clientY - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic-dark perspective-1000"
    >
      {/* 1. Dynamic Background Layers */}
      <VelocityField scrollY={scrollY} />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-cosmic-dark/50 to-cosmic-dark opacity-90 pointer-events-none" />

      {/* 2. Main 3D Container */}
      <motion.div
        style={{ rotateX, rotateY, y: yText, opacity: opacityText, transformStyle: "preserve-3d" }}
        className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center select-none"
      >

        {/* Floating Badge (Top Center) */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12 inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1 rounded-full backdrop-blur-md"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="w-2 h-2 bg-neo-lime rounded-full animate-pulse shadow-[0_0_10px_#ccff00]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">Digital Architects • Est. 2020</span>
        </motion.div>

        {/* Holographic Slogan */}
        <div className="relative mb-8 group">
          {/* Shadow/Clone for Depth */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase leading-[0.9] text-transparent text-stroke-white opacity-10 absolute inset-0 blur-sm pointer-events-none"
            style={{ transform: "translateZ(-30px)" }}
          >
            We Don't Just<br />Build Software
          </motion.h1>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase leading-[0.9] text-white relative z-10 drop-shadow-2xl mix-blend-lighten">
            <motion.span
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="block"
            >
              We Don't Just
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="block"
            >
              Build Software
            </motion.span>
          </h1>
        </div>

        {/* KINETIC VELOCITY TEXT */}
        <div className="relative mt-4 mb-16 group">
          {/* Ambient Glow behind Velocity */}
          <div className="absolute inset-0 bg-neo-lime/20 blur-[80px] rounded-full mix-blend-screen opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150" />

          <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-display font-black uppercase leading-none text-white italic transform skew-x-[-10deg] relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <span className="text-4xl md:text-6xl lg:text-7xl opacity-80 tracking-tighter">
                WE ENGINEER
              </span>

              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-neo-lime via-white to-neo-lime bg-[length:200%_auto] animate-text drop-shadow-[0_0_20px_rgba(204,255,0,0.6)]">
                  VELOCITY
                </span>
                {/* Glitch Layer */}
                <span className="absolute inset-0 text-neo-pink opacity-0 group-hover:opacity-100 group-hover:animate-glitch -z-10" aria-hidden="true">VELOCITY</span>
                <span className="absolute inset-0 text-neo-cyan opacity-0 group-hover:opacity-100 group-hover:animate-glitch -z-10 delay-75" aria-hidden="true">VELOCITY</span>

                {/* Core Icon */}
                <motion.div
                  className="absolute -right-8 -top-8 text-neo-lime"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Zap size={48} fill="#ccff00" className="drop-shadow-[0_0_20px_#ccff00]" />
                </motion.div>
              </motion.div>
            </div>
          </h2>
        </div>

        {/* Terminal Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="max-w-3xl w-full bg-black/40 border border-white/10 p-6 backdrop-blur-md text-left font-mono text-sm md:text-base text-gray-300 relative overflow-hidden group rounded-lg"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Scanline */}
          <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-neo-lime/50 shadow-[0_0_10px_#ccff00] animate-scan opacity-50" />

          <div className="flex items-start gap-3 relative z-10">
            <Terminal size={20} className="text-neo-lime mt-1 shrink-0" />
            <div className="typing-effect">
              <p className="font-mono text-lg md:text-xl text-gray-300 leading-relaxed text-left">
                <span className="text-neo-lime font-bold mr-2">&gt;</span>
                Thoughtseed is a creative studio merging <span className="text-black bg-neo-lime px-1 font-bold">raw aesthetics</span> with precise engineering. We build digital experiences that refuse to be ignored.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Neumorphic Thruster CTAs */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 mt-16"
          style={{ transform: "translateZ(60px)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8 }}
        >
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-[#1a1a1a] text-white font-bold uppercase tracking-wider rounded-sm overflow-hidden shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.05)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),inset_-4px_-4px_10px_rgba(255,255,255,0.05)] transition-all active:scale-95"
          >
            {/* Thruster Glow */}
            <div className="absolute inset-0 bg-neo-lime/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2 group-hover:text-neo-lime transition-colors">
              View Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-transparent border border-white/10 text-white font-bold uppercase tracking-wider rounded-sm hover:border-neo-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
          >
            <span className="relative flex items-center gap-2 group-hover:text-neo-cyan transition-colors">
              <Code size={18} /> Our Services
            </span>
          </button>
        </motion.div>

      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2 pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Initiate Descent</span>
        <MousePointer2 size={16} />
      </motion.div>

    </section>
  );
};

export default HeroSection;