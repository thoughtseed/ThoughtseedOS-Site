import React, { useEffect, useRef } from 'react';

interface AuroraBackgroundProps {
  isDark: boolean;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Track animation frame to cancel on cleanup/prop change
    let animationFrameId: number;

    let mouseX = 0;
    let mouseY = 0;
    
    // Eased mouse coordinates for smooth interaction
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
        // Normalize mouse input -0.5 to 0.5
        mouseX = (e.clientX / width) - 0.5;
        mouseY = (e.clientY / height) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let t = 0;

    const render = () => {
      // Ease targets
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      ctx.clearRect(0, 0, width, height);
      
      if (isDark) {
          // "lighter" creates a glowing light effect when colors overlap on dark bg
          ctx.globalCompositeOperation = 'lighter'; 
      } else {
          // "source-over" layers colors naturally for light bg
          ctx.globalCompositeOperation = 'source-over';
      }

      // Define aurora bands based on theme
      const bands = isDark 
        ? [
            { color: '#00ffaa', opacity: 0.2, yInfo: { base: height * 0.4, amp: 80, freq: 0.002, speed: 0.002 } }, // Green/Teal
            { color: '#bd00ff', opacity: 0.15, yInfo: { base: height * 0.5, amp: 100, freq: 0.003, speed: 0.003 } }, // Purple
            { color: '#00ccff', opacity: 0.15, yInfo: { base: height * 0.6, amp: 60, freq: 0.004, speed: 0.0015 } }  // Blue
          ]
        : [
            // Darker/More saturated colors with higher opacity for light mode to show up against white
            { color: '#059669', opacity: 0.4, yInfo: { base: height * 0.4, amp: 80, freq: 0.002, speed: 0.002 } }, // Emerald Green
            { color: '#7c3aed', opacity: 0.4, yInfo: { base: height * 0.5, amp: 100, freq: 0.003, speed: 0.003 } }, // Violet
            { color: '#0891b2', opacity: 0.4, yInfo: { base: height * 0.6, amp: 60, freq: 0.004, speed: 0.0015 } }  // Cyan Blue
        ];

      bands.forEach((band) => {
          ctx.beginPath();
          ctx.strokeStyle = band.color;
          ctx.lineWidth = 350; // Very thick line for gaseous look
          ctx.lineCap = 'round';
          ctx.globalAlpha = band.opacity;

          // Mouse Y affects vertical position subtly
          const yBase = band.yInfo.base + (targetY * 150); 
          
          ctx.moveTo(-300, yBase);
          
          for (let x = -300; x <= width + 300; x += 50) {
              // Combine sine waves for organic look
              const noise = Math.sin(x * band.yInfo.freq + t * band.yInfo.speed) * band.yInfo.amp
                          + Math.sin(x * band.yInfo.freq * 2.0 + t * band.yInfo.speed * 1.5) * (band.yInfo.amp / 2);
              
              // Mouse X affects distortion/wave frequency
              const distortion = x * targetX * 0.05;

              ctx.lineTo(x, yBase + noise + distortion);
          }
          
          ctx.stroke();
      });

      t += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    }
  }, [isDark]); // Re-run effect when theme changes

  return (
    <canvas 
        ref={canvasRef}
        className={`fixed inset-0 z-0 pointer-events-none transition-all duration-1000 ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
        style={{ filter: 'blur(80px)', background: 'transparent' }} 
    />
  );
};

export default AuroraBackground;