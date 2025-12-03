import React, { useState, useRef, useEffect } from 'react';
import { Service } from '../types';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, Target, BarChart, Smartphone, Globe, Cpu } from 'lucide-react';

// --- VISUALIZATIONS ---

const CodeRings = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute border border-neo-cyan/50 rounded-full"
        style={{ width: i * 60, height: i * 60 }}
        animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
      />
    ))}
    <div className="text-neo-cyan font-mono text-[10px] absolute animate-pulse">
        &lt;CODE /&gt;
    </div>
  </div>
);

const NeuralNodes = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-neo-purple rounded-full shadow-[0_0_10px_#b026ff]"
        animate={{ 
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            scale: [0.5, 1.5, 0.5]
        }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: 'reverse' }}
      />
    ))}
    <svg className="absolute inset-0 w-full h-full stroke-neo-purple/30 stroke-1" style={{ overflow: 'visible' }}>
        <line x1="50%" y1="50%" x2="30%" y2="30%" />
        <line x1="50%" y1="50%" x2="70%" y2="70%" />
        <line x1="50%" y1="50%" x2="70%" y2="30%" />
    </svg>
  </div>
);

const BrandShapes = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none perspective-500">
    <motion.div 
      className="w-16 h-16 border-2 border-neo-pink"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.div 
      className="absolute w-12 h-12 bg-neo-lime/20"
      animate={{ rotate: -360, scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const GrowthChart = () => (
    <div className="absolute inset-0 flex items-end justify-center pb-12 gap-2 opacity-30 pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
            <motion.div 
                key={i}
                className="w-2 bg-gradient-to-t from-neo-cyan to-transparent"
                animate={{ height: [20 + i*10, 40 + i*15, 20 + i*10] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
        ))}
    </div>
);

const MobileWireframe = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div 
            className="w-16 h-28 border-2 border-white/50 rounded-lg flex flex-col p-1 gap-1"
            animate={{ rotateY: [0, 20, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            <div className="h-2 w-full bg-white/20 rounded-sm" />
            <div className="h-8 w-full bg-white/10 rounded-sm" />
            <div className="flex gap-1">
                <div className="h-8 w-1/2 bg-white/10 rounded-sm" />
                <div className="h-8 w-1/2 bg-white/10 rounded-sm" />
            </div>
        </motion.div>
    </div>
);

const DesignPalette = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-neo-pink to-transparent mix-blend-screen" animate={{ x: [-10, 10], y: [-10, 10] }} transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }} />
        <motion.div className="absolute w-20 h-20 rounded-full bg-gradient-to-bl from-neo-cyan to-transparent mix-blend-screen" animate={{ x: [10, -10], y: [10, -10] }} transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }} />
    </div>
);


// --- GLITCH TEXT COMPONENT ---

const GlitchText: React.FC<{ text: string; trigger: boolean }> = ({ text, trigger }) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    useEffect(() => {
        if (!trigger) {
            setDisplayText(text);
            return;
        }

        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayText(prev => 
                text.split("").map((char, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            
            if (iterations >= text.length) {
                clearInterval(interval);
            }
            iterations += 1 / 3; 
        }, 30);

        return () => clearInterval(interval);
    }, [trigger, text]);

    return <span>{displayText}</span>;
};


// --- MAIN CARD COMPONENT ---

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Holographic sheen position
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const getVisualization = (id: string) => {
      if (id.includes('web')) return <CodeRings />;
      if (id.includes('ai')) return <NeuralNodes />;
      if (id.includes('brand')) return <BrandShapes />;
      if (id.includes('growth')) return <GrowthChart />;
      if (id.includes('mobile')) return <MobileWireframe />;
      return <DesignPalette />;
  };

  const Icon = () => {
    switch (service.icon) {
        case '🎯': return <Target className="w-full h-full text-neo-pink" />;
        case '📈': return <BarChart className="w-full h-full text-neo-lime" />;
        case '💻': return <Globe className="w-full h-full text-neo-cyan" />;
        case '🎨': return <Smartphone className="w-full h-full text-purple-400" />;
        case '📱': return <Smartphone className="w-full h-full text-orange-400" />;
        case '🤖': return <Cpu className="w-full h-full text-red-400" />;
        default: return <Zap className="w-full h-full text-white" />;
    }
  }

  return (
    <>
      <motion.div
        ref={containerRef}
        className="relative h-[400px] w-full perspective-1000 cursor-pointer group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(true)}
        layoutId={`card-container-${service.id}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="w-full h-full bg-cosmic-dark/90 border border-white/10 rounded-xl overflow-hidden relative shadow-2xl"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            boxShadow: isHovered 
                ? "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(176, 38, 255, 0.1)" 
                : "0 10px 30px rgba(0,0,0,0.3)"
          }}
        >
          {/* Holographic Sheen Layer */}
          <motion.div 
            className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"
            style={{ 
                left: sheenX, 
                top: sheenY,
                width: '150%',
                height: '150%',
                transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Visualization Layer (Behind content) */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-black to-cosmic-dark/80">
            {getVisualization(service.id)}
          </div>

          {/* Content Layer (Popping out) */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
            <div>
                <div className="w-16 h-16 bg-white/5 rounded-2xl p-4 border border-white/10 mb-6 backdrop-blur-md group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <Icon />
                </div>
                <h3 className="text-3xl font-display font-bold uppercase text-white mb-2 tracking-wide">
                    <GlitchText text={service.name} trigger={isHovered} />
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-neo-pink to-neo-cyan mb-4 rounded-full" />
                <p className="font-mono text-sm text-gray-400 line-clamp-3 group-hover:text-gray-200 transition-colors">
                    {service.description}
                </p>
            </div>
            
            <div className="flex justify-between items-end border-t border-white/10 pt-4">
                 <div className="flex gap-2">
                    {service.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono border border-white/20 px-2 py-1 rounded text-gray-400 bg-black/40">
                            {tag}
                        </span>
                    ))}
                 </div>
                 <motion.div 
                    className="p-2 rounded-full border border-white/30 text-white"
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.1)" }}
                 >
                    <ArrowRight size={16} />
                 </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* EXPANDED PORTAL VIEW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
                layoutId={`card-container-${service.id}`}
                className="relative w-full max-w-6xl h-full max-h-[90vh] bg-cosmic-dark border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="absolute top-6 right-6 z-50 p-3 bg-black/50 hover:bg-neo-pink rounded-full text-white transition-colors border border-white/10"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Visuals */}
                <div className="w-full md:w-5/12 bg-black/50 relative overflow-hidden flex items-center justify-center border-r border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-b from-neo-cyan/10 to-transparent mix-blend-screen" />
                    <div className="scale-150 opacity-100">
                        {getVisualization(service.id)}
                    </div>
                    <div className="absolute bottom-10 left-10 z-10">
                        <h2 className="text-5xl md:text-7xl font-display font-black text-transparent text-stroke-white opacity-20 uppercase writing-mode-vertical">
                            {service.name.split(' ')[0]}
                        </h2>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-7/12 p-8 md:p-16 overflow-y-auto bg-cosmic-dark/80 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                         <div className="flex gap-1">
                             {[...Array(20)].map((_, i) => (
                                 <div key={i} className="w-1 h-4 bg-neo-lime animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                             ))}
                         </div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase tracking-tight">
                        {service.name}
                    </h2>
                    
                    <p className="font-mono text-lg text-gray-300 mb-12 leading-relaxed border-l-4 border-neo-lime pl-6">
                        {service.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        <div>
                            <h4 className="text-neo-cyan font-bold uppercase mb-4 tracking-widest text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-neo-cyan rounded-full animate-ping" /> Approach
                            </h4>
                            <p className="font-mono text-sm text-gray-400 leading-7">
                                {service.approach}
                            </p>
                        </div>
                        <div>
                             <h4 className="text-neo-pink font-bold uppercase mb-4 tracking-widest text-sm">Deliverables</h4>
                             <ul className="space-y-3">
                                {service.deliverables.map((d, i) => (
                                    <li key={i} className="flex items-center text-sm font-mono text-gray-300 group hover:text-white transition-colors">
                                        <div className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-neo-pink mr-3 transition-colors rotate-45" />
                                        {d}
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-xl p-8 bg-white/5">
                        <h4 className="text-neo-purple font-bold uppercase mb-6 tracking-widest text-sm text-center">Benefits</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {service.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded hover:bg-white/5 transition-colors">
                                    <Zap className="w-4 h-4 text-neo-lime shrink-0 mt-1" />
                                    <span className="text-xs font-mono text-gray-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceCard;