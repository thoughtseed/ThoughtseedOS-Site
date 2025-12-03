import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence, useInView } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight, X, Calendar, Code, User, Zap, Globe, Cpu, Layers } from 'lucide-react';

interface ProjectShowcaseProps {
  projects: Project[];
}

// --- MOBILE DETECTION (SSR-safe with initial check) ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || 'ontouchstart' in window;
  });
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    const debouncedCheck = debounce(checkMobile, 150);
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);
  
  return isMobile;
};

// Simple debounce helper
const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

// --- LAZY IMAGE COMPONENT ---
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}> = ({ src, alt, className, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
        />
      )}
    </div>
  );
};

// --- MATH HELPERS ---

// Calculate spherical position
const getPosition = (index: number, total: number, radius: number) => {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  
  return {
    x: radius * Math.cos(theta) * Math.sin(phi),
    y: radius * Math.sin(theta) * Math.sin(phi),
    z: radius * Math.cos(phi)
  };
};

// --- HOLOGRAPHIC NODE COMPONENT ---

const ProjectNode: React.FC<{
  project: Project;
  position: { x: number; y: number; z: number };
  rotationX: any;
  rotationY: any;
  onClick: () => void;
  isMobile: boolean;
}> = ({ project, position, rotationX, rotationY, onClick, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Inverse rotation to billboard the card (keep it facing screen)
  const invertX = useTransform(rotationX, (v: number) => -v);
  const invertY = useTransform(rotationY, (v: number) => -v);

  return (
    <div
      className="absolute flex items-center justify-center [transform-style:preserve-3d]"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
        zIndex: Math.round(position.z + 1000) // Simple z-sorting visual hack
      }}
    >
      <motion.div
        style={{ rotateX: invertX, rotateY: invertY }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer"
        whileHover={!isMobile ? { scale: 1.1, zIndex: 9999 } : {}}
        whileTap={isMobile ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: isMobile ? 0.3 : 0.8, delay: isMobile ? 0 : Math.random() * 0.5 }}
      >
        {/* Connection Line Visual (pointing to center) - Only visible on hover or if featured */}
        <div className={`absolute top-1/2 left-1/2 w-[2px] bg-gradient-to-t from-transparent via-neo-lime/50 to-transparent origin-bottom -z-10 transition-all duration-500 ${isHovered || project.featured ? 'h-[150px] opacity-100' : 'h-0 opacity-0'}`} style={{ transform: 'translateX(-50%) rotate(180deg)' }} />

        {/* The Node Card */}
        <div className={`
            relative w-40 h-56 md:w-56 md:h-72 rounded-xl border transition-all duration-500 overflow-hidden flex flex-col
            ${isHovered 
                ? 'bg-black/90 border-neo-lime shadow-[0_0_40px_rgba(204,255,0,0.3)]' 
                : project.featured 
                    ? 'bg-white/10 border-neo-cyan/50 shadow-[0_0_20px_rgba(0,255,255,0.1)]' 
                    : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100 backdrop-blur-sm'}
        `}>
            {/* Holographic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

            {/* Image Area */}
            <div className="h-1/2 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                <LazyImage 
                    src={project.screenshots && project.screenshots.length > 0 
                        ? project.screenshots[0] 
                        : `https://picsum.photos/seed/${project.id}/${isMobile ? '280/200' : '400/300'}`}
                    alt={project.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                />
                
                {project.featured && (
                    <div className="absolute top-2 right-2 z-20">
                        <div className="w-2 h-2 bg-neo-lime rounded-full shadow-[0_0_5px_#ccff00] animate-pulse" />
                    </div>
                )}
                
                {/* Icon Emblem */}
                <div className="absolute bottom-2 left-2 z-20 p-2 bg-black/50 border border-white/20 rounded-lg backdrop-blur-md">
                   <Globe size={14} className="text-white" />
                </div>
            </div>

            {/* Info Area */}
            <div className="p-3 md:p-4 flex flex-col justify-between flex-grow relative z-10">
                <div>
                    <h3 className="text-white font-display font-bold text-sm md:text-base uppercase leading-tight mb-2 group-hover:text-neo-lime transition-colors line-clamp-2">
                        {project.name}
                    </h3>
                    <div className="w-8 h-[1px] bg-white/20 mb-2 group-hover:w-full group-hover:bg-neo-lime transition-all duration-500" />
                    <p className="text-[10px] md:text-xs text-gray-400 line-clamp-2 font-mono">
                        {project.description}
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.slice(0, 2).map((t, i) => (
                        <span key={i} className="text-[8px] md:text-[10px] border border-white/10 bg-white/5 text-gray-300 px-1.5 py-0.5 rounded font-mono">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tech Badge orbiting (Visual effect) */}
            {isHovered && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 bg-neo-purple text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-lg z-30"
                >
                    {project.tech[0]}
                </motion.div>
            )}

            {/* Scanline Effect */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-neo-lime/5 to-transparent z-30 pointer-events-none w-full h-[20%] -translate-y-full ${isHovered ? 'animate-scan' : ''}`} />
        </div>

        {/* Hover Label */}
        <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-neo-lime text-black font-bold text-xs uppercase tracking-wider rounded-sm opacity-0 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'translate-y-4 pointer-events-none'}`}>
            Initialize Project
        </div>

      </motion.div>
    </div>
  );
};

// --- MAIN CONSTELLATION COMPONENT ---

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const isMobile = useIsMobile();
  const sceneReady = useInView(sectionRef, { margin: '-10% 0px', once: true });

  // Rotation State
  const rotateX = useMotionValue(-10);
  const rotateY = useMotionValue(0);
  
  // Smooth rotation physics
  const springConfig = { damping: 40, stiffness: 200, mass: 1 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Auto-rotation idle loop - disabled when not in view or reduced motion
  useEffect(() => {
    if (!sceneReady || isReducedMotion) return;
    
    let animationFrame: number;
    const autoRotate = () => {
      if (!isDragging && !selectedProject) {
        rotateY.set(rotateY.get() + (isMobile ? 0.05 : 0.08));
      }
      animationFrame = requestAnimationFrame(autoRotate);
    };
    autoRotate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging, selectedProject, isMobile, isReducedMotion, sceneReady]);

  // Drag Handlers
  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      rotateY.set(rotateY.get() + e.movementX * 0.3);
      rotateX.set(Math.max(-45, Math.min(45, rotateX.get() - e.movementY * 0.3)));
    }
  };

  const displayedProjects = projects;

  // Node Calculation - simplified for mobile
  const projectNodes = useMemo(() => {
    if (!sceneReady) return [];
    
    const featured = displayedProjects.filter(p => p.featured);
    const regular = displayedProjects.filter(p => !p.featured);
    
    // Core nodes (Featured) - Inner Sphere
    const coreNodes = featured.map((p, i) => ({
      project: p,
      // Radius scaled for device
      pos: getPosition(i, featured.length, isMobile ? 360 : 520) 
    }));

    // Cloud nodes (Regular) - Outer Sphere
    const cloudNodes = regular.map((p, i) => ({
        project: p,
        // Radius scaled for device
        pos: getPosition(i, regular.length, isMobile ? 600 : 900) 
    }));

    // Combine and add randomization
    return [...coreNodes, ...cloudNodes].map(node => ({
        ...node,
        pos: {
            x: node.pos.x + (Math.random() * 120 - 60),
            y: node.pos.y + (Math.random() * 120 - 60),
            z: node.pos.z + (Math.random() * 120 - 60)
        }
    }));
  }, [projects, isMobile, sceneReady]);


  return (
    <section ref={sectionRef} className={`relative ${isMobile ? 'min-h-[120vh]' : 'min-h-[160vh]'} bg-transparent overflow-hidden flex flex-col items-center justify-center py-16`}>
      
      {/* Intro Text / HUD */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none mix-blend-difference">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-neo-lime font-mono text-xs uppercase tracking-[0.5em] mb-2">
              System.Works_Log
            </h2>
            <div className="w-[1px] h-12 bg-gradient-to-b from-neo-lime to-transparent mb-4" />
          </motion.div>
      </div>

      <div className="absolute bottom-10 left-10 z-20 pointer-events-none hidden md:block">
        <div className="text-white/30 font-mono text-[10px] space-y-1">
            <p>ROTATION: {Math.round(rotateY.get())}°</p>
            <p>NODES: {displayedProjects.length}</p>
            <p>STATUS: ONLINE</p>
        </div>
      </div>

      {/* 3D INTERACTIVE SCENE */}
      <div 
        ref={containerRef}
        className={`relative w-full h-full cursor-grab active:cursor-grabbing perspective-1000 flex items-center justify-center touch-pan-y`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        <motion.div
            className="relative w-0 h-0 [transform-style:preserve-3d]"
            style={{ 
                rotateX: smoothRotateX, 
                rotateY: smoothRotateY 
            }}
        >
            {/* SUPERNOVA CORE TITLE */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] pointer-events-none">
                <div className="relative group">
                    <h1 className="text-[80px] md:text-[150px] font-display font-black uppercase text-transparent text-stroke-white opacity-20 blur-[1px] whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        WORKS
                    </h1>
                    <h1 className="text-[60px] md:text-[100px] font-display font-black uppercase text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.5)] relative z-10 whitespace-nowrap text-center leading-none">
                        Selected<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Works</span>
                    </h1>
                    {/* Core Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[80px] mix-blend-screen animate-pulse" />
                </div>
            </div>

            {/* ORBIT RINGS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full [transform:rotateX(90deg)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border border-white/5 rounded-full [transform:rotateX(90deg)_rotateY(45deg)] pointer-events-none opacity-50" />

            {/* PROJECT NODES */}
            {projectNodes.map((node, i) => (
                <ProjectNode
                    key={node.project.id}
                    project={node.project}
                    position={node.pos}
                    rotationX={smoothRotateX}
                    rotationY={smoothRotateY}
                    onClick={() => setSelectedProject(node.project)}
                    isMobile={isMobile}
                />
            ))}

        </motion.div>
      </div>

      {/* IMMERSIVE MODAL */}
      <AnimatePresence>
        {selectedProject && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 md:p-8"
                onClick={() => setSelectedProject(null)}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 100, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-full md:max-w-6xl md:h-[90vh] bg-[#050505] border border-white/10 md:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
                >
                    {/* Close Button - Desktop: Top Right, Mobile: Bottom Left */}
                    <button 
                        onClick={() => setSelectedProject(null)}
                        className="hidden md:flex absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-neo-pink rounded-full text-white transition-colors border border-white/10 backdrop-blur-sm"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                        
                        {/* Top: Image Section - Horizontal */}
                        <div className="w-full h-[35vh] md:h-[45vh] relative bg-black flex-shrink-0">
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent" />
                            
                            <LazyImage 
                                src={selectedProject.screenshots && selectedProject.screenshots.length > 0 ? selectedProject.screenshots[0] : `https://picsum.photos/seed/${selectedProject.id}/1200/600`}
                                alt={selectedProject.name}
                                className="w-full h-full object-cover object-top opacity-90"
                            />

                            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20">
                                <div className="inline-block px-3 py-1 bg-neo-lime text-black font-bold text-xs uppercase mb-3 rounded-sm">
                                    Case Study
                                </div>
                                <h2 className="text-3xl md:text-5xl font-display font-black uppercase text-white leading-none">
                                    {selectedProject.name}
                                </h2>
                            </div>
                        </div>

                        {/* Bottom: Content Section */}
                        <div className="flex-1 bg-black/50 p-6 md:p-10">
                            
                            {/* Metadata Header */}
                            <div className="flex flex-wrap gap-6 mb-8 border-b border-white/10 pb-6">
                                <div>
                                    <span className="block text-gray-500 text-xs font-mono uppercase mb-1">Client</span>
                                    <span className="text-white font-bold">{selectedProject.client}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs font-mono uppercase mb-1">Year</span>
                                    <span className="text-white font-bold">{selectedProject.year}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs font-mono uppercase mb-1">Role</span>
                                    <span className="text-white font-bold">Design & Dev</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-neo-cyan font-bold uppercase tracking-widest text-sm mb-4">The Brief</h3>
                                <p className="text-gray-300 font-mono text-base leading-relaxed">
                                    {selectedProject.description}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div className="mb-8">
                                <h3 className="text-neo-purple font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                    <Layers size={16} /> Technologies
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.tech.map(t => (
                                        <div key={t} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded">
                                            <div className="w-1.5 h-1.5 bg-neo-purple rounded-full" />
                                            <span className="text-xs text-gray-300 font-mono">{t}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex flex-col md:flex-row gap-4">
                                {selectedProject.url && (
                                    <a 
                                        href={selectedProject.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase hover:bg-neo-lime transition-colors rounded-sm group"
                                    >
                                        Launch Project <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                                    </a>
                                )}
                                
                                {/* Mobile Close Button */}
                                <button 
                                    onClick={() => setSelectedProject(null)}
                                    className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-black/80 border border-white/20 text-white font-black uppercase hover:bg-neo-pink transition-colors rounded-sm backdrop-blur-sm"
                                >
                                    <X size={18} />
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectShowcase;
