'use client';

import React, { useEffect, useRef } from 'react';

export function InteractiveMeshBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 180,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Grid config
    const gridSize = 48;

    // Ambient floating particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      char: Math.random() > 0.5 ? (Math.random() > 0.5 ? '1' : '0') : (Math.random() > 0.5 ? '+' : '>'),
      size: Math.random() * 10 + 9,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const render = () => {
      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Dark Base Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Cyber Grid Lines
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < width; x += gridSize) {
        const distToMouse = Math.abs(x - mouse.x);
        const intensity = Math.max(0, 1 - distToMouse / (mouse.radius * 1.8));

        ctx.strokeStyle = intensity > 0.1 
          ? `rgba(99, 102, 241, ${0.08 + intensity * 0.25})` 
          : 'rgba(30, 41, 59, 0.25)';
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < height; y += gridSize) {
        const distToMouse = Math.abs(y - mouse.y);
        const intensity = Math.max(0, 1 - distToMouse / (mouse.radius * 1.8));

        ctx.strokeStyle = intensity > 0.1 
          ? `rgba(56, 189, 248, ${0.08 + intensity * 0.25})` 
          : 'rgba(30, 41, 59, 0.25)';
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Intersection Crosshairs
      ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius * 1.2) {
            const glow = 1 - dist / (mouse.radius * 1.2);
            ctx.fillStyle = `rgba(56, 189, 248, ${glow * 0.8})`;
            ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
          }
        }
      }

      // 4. Mouse Radial Light Beam Spotlight
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.5);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      gradient.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 5. Floating Code/Matrix Particles
      ctx.font = '10px monospace';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNear = dist < mouse.radius;

        ctx.fillStyle = isNear ? 'rgba(56, 189, 248, 0.8)' : `rgba(148, 163, 184, ${p.alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
