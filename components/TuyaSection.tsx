import React, { useState } from 'react';
import {
  Building,
  Smartphone,
  Cpu,
  Building2,
  Home,
  Zap,
  Network,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- REFIMAGINED DATA (6 Core Services) ---
const services = [
  {
    id: 'facility',
    title: "Smart Facility",
    desc: "Intelligent spaces that run themselves.",
    longDesc: "Transform traditional facilities into intelligent ecosystems. Our solutions integrate HVAC, lighting, and occupancy sensors to optimize operations in real-time, reducing overhead and improving occupant comfort effortlessly.",
    icon: Building,
  },
  {
    id: 'home',
    title: "Smart Home App",
    desc: "One elegant interface for modern living.",
    longDesc: "A white-label smart home application that puts control in your users' hands. Unified device management, scene automation, and remote access—all wrapped in a premium, intuitive user interface.",
    icon: Smartphone,
  },
  {
    id: 'ai',
    title: "AI-Powered",
    desc: "Edge intelligence that acts instantly.",
    longDesc: "Leverage edge computing and AI to process data locally. From visual recognition in security cameras to predictive maintenance in appliances, our AI solutions drive faster, smarter decisions without cloud latency.",
    icon: Cpu,
  },
  {
    id: 'building',
    title: "Building Mgmt",
    desc: "Holistic control for complex structures.",
    longDesc: "Comprehensive BMS integration that scales from single buildings to entire campuses. Monitor energy usage, automate maintenance workflows, and ensure regulatory compliance from a single dashboard.",
    icon: Building2,
  },
  {
    id: 'rental',
    title: "Rental Mgmt",
    desc: "Frictionless onboarding and billing.",
    longDesc: "Streamline the rental experience with smart access control, automated billing based on usage, and remote property management. Perfect for co-living spaces, short-term rentals, and student housing.",
    icon: Home,
  },
  {
    id: 'energy',
    title: "Energy Efficiency",
    desc: "Predict consumption and cut costs.",
    longDesc: "Advanced energy analytics that don't just track usage but predict it. Implement load balancing, peak shaving, and renewable integration to dramatically lower your carbon footprint and energy bills.",
    icon: Zap,
  },
];

// --- MODAL COMPONENT ---
const ServiceModal: React.FC<{
  service: typeof services[0] | null;
  onClose: () => void;
}> = ({ service, onClose }) => {
  if (!service) return null;
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#FF4211]/30 rounded-2xl p-8 overflow-hidden shadow-[0_0_50px_rgba(255,66,17,0.15)]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-[#FF4211]/10 flex items-center justify-center border border-[#FF4211]/20 shadow-[0_0_20px_rgba(255,66,17,0.2)]">
            <Icon size={32} className="text-[#FF4211]" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white uppercase">{service.title}</h3>
        </div>

        {/* Content */}
        <p className="text-gray-300 font-mono text-sm leading-relaxed mb-8 border-l-2 border-[#FF4211]/50 pl-4">
          {service.longDesc}
        </p>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-[#FF4211] text-white font-bold uppercase tracking-widest hover:bg-[#ff5e33] transition-colors rounded-lg flex items-center justify-center gap-2 group"
        >
          Close Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Background Decor */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FF4211]/5 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

const TuyaSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  // Orbit Configuration
  const radius = 380; // Distance from center
  const total = services.length;

  return (
    <section className="relative w-full min-h-screen bg-[#050510] overflow-hidden py-24 flex flex-col items-center justify-center">

      {/* 1. KINETIC PARTICLE BACKGROUND (No Grid) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,66,17,0.08)_0%,_transparent_70%)]" />

        {/* Deep Space Particles */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
          {/* Orange Accent Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`orange-${i}`}
              className="absolute w-1 h-1 bg-[#FF4211]/40 rounded-full"
              initial={{
                x: Math.random() * 1000 - 500,
                y: Math.random() * 1000 - 500
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center">

        {/* HEADER */}
        <div className="text-center mb-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="h-[1px] w-12 bg-[#FF4211]/50" />
            <span className="text-[#FF4211] font-mono text-xs uppercase tracking-[0.3em]">tuya ecosystem dev partner</span>
            <div className="h-[1px] w-12 bg-[#FF4211]/50" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-rajdhani font-bold text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight relative group">
            <span className="relative z-10">We provide end-to-end IoT solutions built on the Tuya ecosystem</span>
            <span className="absolute top-0 left-0 -z-10 text-[#FF4211] opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100" aria-hidden="true">We provide end-to-end IoT solutions built on the Tuya ecosystem</span>
            <span className="absolute top-0 left-0 -z-10 text-neo-cyan opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100" aria-hidden="true">We provide end-to-end IoT solutions built on the Tuya ecosystem</span>
          </h2>
        </div>

        {/* ORBITAL LAYOUT CONTAINER (Desktop) */}
        <div className="hidden lg:flex relative w-[800px] h-[800px] items-center justify-center">

          {/* ORBIT RINGS */}
          <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-[100px] rounded-full border border-white/5 border-dashed animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute inset-[250px] rounded-full border border-[#FF4211]/10 animate-[pulse_4s_ease-in-out_infinite]" />

          {/* CENTRAL TUYA CORE */}
          <div className="absolute flex items-center justify-center z-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Glows */}
              <div className="absolute inset-0 bg-[#FF4211]/30 blur-[40px] rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-[#FF4211] rounded-full opacity-10" />
              <div className="absolute inset-2 bg-[#FF4211] rounded-full border border-[#FF4211]/50 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(255,66,17,0.4)]">
                <img
                  src="/assets/screenshots/TUYA_BIG.svg"
                  alt="Tuya"
                  className="w-20 h-20 object-contain brightness-[100] drop-shadow-md"
                />
              </div>
              {/* Connecting Lines to Orbit */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 h-[1px] w-[380px] bg-gradient-to-r from-[#FF4211]/30 to-transparent origin-left -z-10"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                />
              ))}
            </div>
          </div>

          {/* ORBITING CARDS */}
          {services.map((service, index) => {
            // Rotate starting angle by 30 degrees (Math.PI / 6) to move "Smart Facility" from top-center to top-right/lower
            const angle = (index / total) * 2 * Math.PI - (Math.PI / 2) + (Math.PI / 6);
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <motion.div
                key={service.id}
                className="absolute w-64"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: -128, // Half width
                  marginTop: -70, // Half height approx
                  x,
                  y
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div
                  className="group relative bg-[#0a0a12]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#FF4211]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,66,17,0.2)] cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="absolute inset-0 bg-[#FF4211] opacity-0 group-hover:opacity-5 rounded-xl transition-opacity" />

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#FF4211]/10 border border-[#FF4211]/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,66,17,0.15)] shrink-0 group-hover:shadow-[0_0_20px_rgba(255,66,17,0.4)] transition-all duration-300">
                      <service.icon size={20} className="text-[#FF4211] drop-shadow-[0_0_8px_rgba(255,66,17,0.8)]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase mb-1">{service.title}</h3>
                      <p className="text-gray-400 text-xs leading-tight group-hover:text-gray-300 transition-colors">{service.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MOBILE LAYOUT (Stack) */}
        <div className="lg:hidden flex flex-col gap-4 w-full max-w-md">
          {/* Mobile Central Node */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 flex items-center justify-center bg-[#FF4211] rounded-full border border-[#FF4211]/30 shadow-[0_0_40px_rgba(255,66,17,0.4)]">
              <img src="/assets/screenshots/TUYA_BIG.svg" alt="Tuya" className="w-12 h-12 object-contain brightness-[100]" />
            </div>
          </div>

          {services.map((service, index) => (
            <div key={service.id} className="relative pl-8 border-l border-white/10 ml-4 py-2">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-[#FF4211] shadow-[0_0_10px_rgba(255,66,17,0.8)]" />

              <div
                onClick={() => setSelectedService(service)}
                className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF4211]/10 border border-[#FF4211]/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,66,17,0.15)] shrink-0">
                  <service.icon size={20} className="text-[#FF4211]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase">{service.title}</h3>
                  <p className="text-gray-400 text-xs">{service.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedService && (
          <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default TuyaSection;
