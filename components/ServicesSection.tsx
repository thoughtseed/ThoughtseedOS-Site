import React from 'react';
import { Service } from '../types';
import ServiceCard from './ServiceCard';
import { motion } from 'framer-motion';

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  return (
    <section id="services" className="relative py-32 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Dynamic Background Specific to Services */}
      <div className="absolute inset-0 bg-cosmic-dark">
         <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-neo-purple/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-neo-cyan/10 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="mb-24 relative">
             <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="inline-block"
             >
                <span className="font-mono text-neo-lime text-xs uppercase tracking-[0.3em] mb-4 block">
                    // Capabilities
                </span>
                <h2 className="text-6xl md:text-8xl font-display font-black uppercase text-white leading-none relative z-10">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-neo-cyan to-neo-purple">Services</span>
                </h2>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 border-l border-t border-white/20 opacity-50" />
                <div className="absolute -bottom-4 -right-20 hidden md:block">
                     <div className="font-mono text-[10px] text-gray-500 flex flex-col gap-1 text-right">
                        <span>SYS.32.99</span>
                        <span>NODE.ACTIVE</span>
                     </div>
                </div>
             </motion.div>
        </div>

        {/* 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;