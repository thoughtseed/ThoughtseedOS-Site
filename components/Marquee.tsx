import React from 'react';

interface MarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  className?: string;
  speed?: 'fast' | 'slow';
}

const Marquee: React.FC<MarqueeProps> = ({ items, direction = 'left', className = '', speed = 'slow' }) => {
  const animationClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';
  // Slowed down animation durations
  const duration = speed === 'fast' ? '30s' : '60s';

  // Ensure we have enough items to fill screen seamlessly
  const content = (
    <div className="flex items-center gap-12 shrink-0 px-6">
      {items.map((item, index) => (
        <span key={index} className="text-3xl md:text-5xl font-black uppercase tracking-widest font-display flex items-center text-white" style={{ textShadow: '0 0 20px rgba(204,255,0,0.8)' }}>
          {item} 
          <span className="text-neo-lime mx-6 text-xl" style={{ textShadow: '0 0 15px rgba(204,255,0,1)' }}>•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`relative flex overflow-hidden py-6 select-none bg-black ${className}`}>
      {/* Wrapper for the moving track */}
      <div 
        className={`flex whitespace-nowrap ${animationClass}`} 
        style={{ animationDuration: duration }}
      >
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};

export default Marquee;