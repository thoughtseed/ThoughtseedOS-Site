import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Sparkles, Fingerprint, Activity } from 'lucide-react';

// --- NEBULA PARTICLE ENGINE (CANVAS) ---
const NebulaField: React.FC = () => {
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

        // Configuration
        const particleCount = 60; // Limited for mobile performance
        const particles: { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number }[] = [];

        // Colors: Navy to Black gradients, faint organic wisps
        const colors = ['rgba(100, 255, 218, 0.3)', 'rgba(204, 255, 0, 0.1)', 'rgba(255, 255, 255, 0.1)'];

        const initParticle = (p?: any) => {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2, // Slow, organic movement
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2 + 0.5,
                life: Math.random() * 100,
                maxLife: 100 + Math.random() * 100,
                ...p
            };
        };

        for (let i = 0; i < particleCount; i++) {
            particles.push(initParticle());
        }

        let animationId: number;

        const render = () => {
            // Soft trail effect for "nebula" feel
            ctx.fillStyle = 'rgba(2, 0, 16, 0.1)'; // Navy/Black fade
            ctx.fillRect(0, 0, width, height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life++;

                // Organic "Wisp" movement (Sine wave influence)
                p.vx += Math.sin(p.y * 0.01) * 0.002;
                p.vy += Math.cos(p.x * 0.01) * 0.002;

                // Reset if out of bounds or dead
                if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life > p.maxLife) {
                    particles[i] = initParticle({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        life: 0
                    });
                }

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();

                // Draw Connections (Neural/Vine pathways)
                particles.forEach((p2, j) => {
                    if (i === j) return;
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 255, 218, ${0.05 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            animationId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

const PhilosophySection: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    // Scroll Progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax & Reveal Transforms
    const yOrb = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const scaleOrb = useTransform(scrollYProgress, [0.2, 0.8], [0.9, 1.05]);
    const opacityText = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 50, damping: 20 });
    const springY = useSpring(y, { stiffness: 50, damping: 20 });
    const rotateX = useTransform(springY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            x.set((mouseX / width) - 0.5);
            y.set((mouseY / height) - 0.5);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section
            id="philosophy"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020010] perspective-1000 py-20"
        >
            {/* 1. Nebula Background */}
            <NebulaField />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#020010]/80 to-[#020010] pointer-events-none" />

            {/* 2. Main Holographic Orb Container */}
            <motion.div
                style={{ rotateX, rotateY, y: yOrb, scale: scaleOrb, transformStyle: "preserve-3d" }}
                className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center"
            >
                {/* The Orb */}
                <motion.div
                    className={`
                        relative w-full max-w-4xl aspect-square md:aspect-[16/9] lg:aspect-[2/1] 
                        rounded-3xl md:rounded-full 
                        bg-gradient-to-b from-[#1a1a2e] to-[#050505]
                        border border-white/5
                        shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.5)]
                        backdrop-blur-xl
                        flex flex-col items-center justify-center text-center p-8 md:p-16
                        transition-all duration-1000
                        group
                    `}
                    onClick={() => setIsRevealed(true)}
                >
                    {/* Inner Neumorphic Glow */}
                    <div className="absolute inset-0 rounded-3xl md:rounded-full shadow-[inset_2px_2px_20px_rgba(255,255,255,0.05),inset_-2px_-2px_20px_rgba(0,0,0,0.8)] pointer-events-none" />

                    {/* Divine Spark (Top) */}
                    <motion.div
                        className="mb-8 relative"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="w-3 h-3 bg-neo-lime rounded-full shadow-[0_0_20px_#ccff00]" />
                        <div className="absolute inset-0 bg-neo-lime blur-xl opacity-40 animate-pulse" />
                    </motion.div>

                    {/* Main Copy */}
                    <div className="relative z-20 max-w-3xl">
                        {/* Line 1 - Glitch & Glow */}
                        <div className="relative group mb-6">
                            <motion.h2
                                style={{ opacity: opacityText }}
                                className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight relative z-10"
                            >
                                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    God created the universe in seven days.
                                </span>
                            </motion.h2>

                            {/* Glitch Layers */}
                            <motion.h2
                                className="absolute inset-0 text-3xl md:text-5xl lg:text-6xl font-display font-bold text-neo-cyan opacity-0 group-hover:opacity-70 z-0 pointer-events-none"
                                animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.5, 0] }}
                                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                God created the universe in seven days.
                            </motion.h2>
                            <motion.h2
                                className="absolute inset-0 text-3xl md:text-5xl lg:text-6xl font-display font-bold text-neo-pink opacity-0 group-hover:opacity-70 z-0 pointer-events-none"
                                animate={{ x: [2, -2, 1, 0], opacity: [0, 0.5, 0] }}
                                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2.5 }}
                            >
                                God created the universe in seven days.
                            </motion.h2>
                        </div>

                        {/* Line 2 (The Engineering) */}
                        <motion.p
                            className={`
                                text-lg md:text-2xl font-mono text-neo-lime/90 mb-8 leading-relaxed
                                transition-all duration-700
                                ${isRevealed ? 'blur-0 translate-y-0' : 'blur-[2px] translate-y-2 opacity-70 group-hover:blur-0 group-hover:opacity-100'}
                            `}
                        >
                            We don’t rush miracles—we engineer them, <span className="text-white bg-white/10 px-2 rounded shadow-[0_0_10px_rgba(255,255,255,0.2)]">one pixel at a time.</span>
                        </motion.p>

                        {/* Line 3 (Client Success) - Enhanced Glow */}
                        <motion.div
                            className="flex items-center justify-center gap-3 text-sm md:text-base uppercase tracking-widest relative group"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Activity size={16} className="text-neo-cyan drop-shadow-[0_0_8px_#00ffff]" />
                            <span className="text-gray-300 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                                Your success is the only metric that matters
                            </span>

                            {/* Subtle Pulse Underline */}
                            <motion.div
                                className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neo-lime to-transparent opacity-0 group-hover:opacity-100"
                                animate={{ scaleX: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </div>

                    {/* Orbiting Elements (Decorative) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl md:rounded-full">
                        {/* Ring 1 */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Ring 2 */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-dashed border-white/5 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Interaction Hint */}
                    {!isRevealed && (
                        <motion.div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs uppercase tracking-[0.3em]"
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Tap to Reveal
                        </motion.div>
                    )}
                </motion.div>

                {/* Floating "Petals" / Code Fragments */}
                <motion.div
                    className="absolute -right-4 md:-right-20 top-1/4 bg-black/40 backdrop-blur-md border border-neo-lime/20 p-4 rounded-lg shadow-xl hidden md:block"
                    style={{ transform: "translateZ(40px)" }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="flex items-center gap-2 text-neo-lime text-xs font-mono mb-1">
                        <Fingerprint size={12} />
                        <span>Identity.Verified</span>
                    </div>
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-neo-lime/50" />
                    </div>
                </motion.div>

                <motion.div
                    className="absolute -left-4 md:-left-20 bottom-1/4 bg-black/40 backdrop-blur-md border border-neo-cyan/20 p-4 rounded-lg shadow-xl hidden md:block"
                    style={{ transform: "translateZ(30px)" }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <div className="flex items-center gap-2 text-neo-cyan text-xs font-mono mb-1">
                        <Sparkles size={12} />
                        <span>Magic.Init()</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                        &lt;System&gt;Ready&lt;/System&gt;
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default PhilosophySection;