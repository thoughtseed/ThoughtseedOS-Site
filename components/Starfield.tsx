import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
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

    const stars: { x: number; y: number; z: number }[] = [];
    const numStars = 800; // Dense starfield
    const centerX = width / 2;
    const centerY = height / 2;
    const speed = 8; // High speed for "velocity" effect

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - centerX,
        y: Math.random() * height - centerY,
        z: Math.random() * width,
      });
    }

    const animate = () => {
      // Clear with slight transparency for trail effect
      ctx.fillStyle = 'rgba(2, 0, 10, 0.4)'; 
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        
        // Move star towards viewer
        star.z -= speed;

        // Reset if it passes the viewer
        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - centerX;
          star.y = Math.random() * height - centerY;
        }

        const x = (star.x / star.z) * width + centerX;
        const y = (star.y / star.z) * height + centerY;
        
        // Calculate previous position for streak effect
        const prevZ = star.z + speed * 1.5;
        const prevX = (star.x / prevZ) * width + centerX;
        const prevY = (star.y / prevZ) * height + centerY;

        const size = (1 - star.z / width) * 2.5;
        const opacity = (1 - star.z / width);

        if (x >= 0 && x < width && y >= 0 && y < height) {
          // Draw streak
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          // Color shift based on position/speed for "hyperspace" feel
          const hue = (star.z / width) * 50 + 200; // Blue/Cyan/Purple range
          ctx.strokeStyle = `hsla(${hue}, 80%, 80%, ${opacity * 0.8})`;
          ctx.lineWidth = size * 0.8;
          ctx.stroke();

          // Draw star head
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none mix-blend-screen"
    />
  );
};

export default Starfield;