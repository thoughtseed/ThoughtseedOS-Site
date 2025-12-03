import React, { useState, useEffect, useRef } from 'react';
import { 
  Building, 
  Smartphone, 
  Cpu, 
  Shield, 
  Building2, 
  Home, 
  Zap, 
  ChevronDown
} from 'lucide-react';

// --- Data with updated copy ---
const services = [
  { 
    id: 'facility',
    title: "Smart Facility Management", 
    desc: "Intelligent spaces that run themselves. HVAC, lighting, occupancy – all optimized in real time.", 
    icon: Building 
  },
  { 
    id: 'home',
    title: "Smart Home App", 
    desc: "One elegant interface to rule every connected device in the home.", 
    icon: Smartphone 
  },
  { 
    id: 'ai',
    title: "AI-Powered Devices", 
    desc: "Edge AI cameras, toys, and appliances that think locally and act instantly.", 
    icon: Cpu 
  },
  { 
    id: 'security',
    title: "Smart Access & Security", 
    desc: "Biometric entry, proactive monitoring, zero-trust architecture – enterprise-grade, consumer-simple.", 
    icon: Shield 
  },
  { 
    id: 'building',
    title: "Smart Building Management", 
    desc: "Buildings that think ahead. Automated HVAC, lighting, and occupancy for peak efficiency and comfort.", 
    icon: Building2 
  },
  { 
    id: 'rental',
    title: "Smart Rental Management", 
    desc: "Frictionless onboarding, remote locks, automated billing – all in one seamless platform.", 
    icon: Home 
  },
  { 
    id: 'energy',
    title: "Smart Energy Management", 
    desc: "Predict consumption, optimize in real time, cut costs dramatically.", 
    icon: Zap 
  },
  {
    id: 'city',
    title: "Smart City Solutions",
    desc: "Integrated urban management for sustainable and efficient cities.",
    icon: Building2
  },
  {
    id: 'agriculture',
    title: "Smart Agriculture",
    desc: "Precision farming and automated systems for optimal crop yield and resource management.",
    icon: Home
  },
];

// --- Service Card Component ---
const ServiceCard: React.FC<{
  service: typeof services[0];
}> = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll card into view when expanded on mobile
  useEffect(() => {
    if (isExpanded && isMobile && cardRef.current) {
      const card = cardRef.current;
      const cardRect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if expanded card would go below viewport
      if (cardRect.bottom > viewportHeight - 100) {
        // Scroll to bring the card into view with some padding
        card.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [isExpanded, isMobile]);

  return (
    <div
      ref={cardRef}
      className={`
        group relative cursor-pointer
        bg-[#0c0c18] border border-white/10 rounded-2xl
        transition-all duration-300 ease-out
        hover:border-orange-500/50
        ${isExpanded ? 'border-orange-500/60' : ''}
      `}
      style={{
        boxShadow: isExpanded 
          ? '0 0 30px rgba(255,90,0,0.15), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
      onClick={() => isMobile && setIsExpanded(!isExpanded)}
    >
      {/* Orange glow on hover */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
        bg-[radial-gradient(ellipse_at_center,_rgba(255,90,0,0.08)_0%,_transparent_70%)]
      `} />

      {/* Main Content */}
      <div className="relative z-10 p-5 flex items-center gap-4">
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
          transition-all duration-300
          ${isExpanded 
            ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white' 
            : 'bg-white/5 text-orange-500 lg:group-hover:bg-orange-500/10'
          }
        `}>
          <Icon size={22} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-display font-bold text-sm sm:text-base uppercase tracking-wide">
            {service.title}
          </h3>
          {!isExpanded && (
            <div className="mt-1.5 h-0.5 w-8 bg-gradient-to-r from-orange-500/50 to-transparent rounded-full 
                          lg:group-hover:w-16 transition-all duration-300" />
          )}
        </div>

        {/* Chevron */}
        <ChevronDown 
          size={18} 
          className={`
            text-gray-500 transition-transform duration-300 flex-shrink-0
            ${isExpanded ? 'rotate-180 text-orange-500' : 'lg:group-hover:text-orange-400'}
          `}
        />
      </div>

      {/* Expandable Description */}
      <div className={`
        overflow-hidden transition-all duration-300
        ${isExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-5 pb-5">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-3" />
          <p className="text-gray-400 font-mono text-xs sm:text-sm leading-relaxed">
            {service.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const TuyaSection: React.FC = () => {
  // Each card now manages its own expanded state

  return (
    <section className="relative w-full bg-[#030014] overflow-hidden py-16 sm:py-20 lg:py-28">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#080518] to-[#030014]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,90,0,0.05)_0%,_transparent_50%)]" />
        
        {/* Subtle particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 100}%`,
                animation: `pulse ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">
              Official Development Partner
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-white leading-tight max-w-4xl mx-auto mb-4">
            Powered by the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Tuya IoT
            </span>{' '}
            ecosystem + our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              AI expertise
            </span>
            , we deliver enterprise-grade smart solutions.
          </h2>
          
          <p className="text-gray-400 font-mono text-sm lg:text-base max-w-2xl mx-auto">
            From single homes to entire buildings—scaling effortlessly.
          </p>
        </div>

        {/* Desktop Layout: 3x3 Grid with Hub in Center */}
        <div className="hidden lg:block">
          {/* Hub positioned above the grid */}
          <div className="flex items-center justify-center mb-12">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 w-40 h-40 -m-4 rounded-full bg-orange-500/20 blur-3xl" />
              
              {/* Rings */}
              <div className="absolute inset-0 w-36 h-36 -m-2 rounded-full border border-dashed border-orange-500/30 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 w-44 h-44 -m-6 rounded-full border border-orange-500/15 animate-[spin_30s_linear_infinite_reverse]" />
              
              {/* Core */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 
                             flex items-center justify-center shadow-[0_0_60px_rgba(255,90,0,0.5)]">
                <img 
                  src="https://s3-symbol-logo.tradingview.com/tuya--600.png" 
                  alt="Tuya - Official Partner" 
                  className="w-16 h-16 object-contain brightness-150 drop-shadow-lg"
                />
                <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent to-white/10" />
              </div>
            </div>
          </div>

          {/* 3x3 Grid of Cards */}
          <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Mobile Hub */}
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 w-28 h-28 -m-4 rounded-full bg-orange-500/20 blur-2xl" />
              <div className="absolute inset-0 w-24 h-24 -m-2 rounded-full border border-dashed border-orange-500/30 animate-[spin_20s_linear_infinite]" />
              
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 
                             flex items-center justify-center shadow-[0_0_40px_rgba(255,90,0,0.5)]">
                <img 
                  src="https://s3-symbol-logo.tradingview.com/tuya--600.png" 
                  alt="Tuya" 
                  className="w-10 h-10 object-contain brightness-150"
                />
              </div>
            </div>
          </div>

          {/* Mobile Services */}
          <div className="flex flex-col gap-3 max-w-lg mx-auto">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TuyaSection;
