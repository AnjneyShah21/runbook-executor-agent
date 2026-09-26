'use client';

import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

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
      radius: 200,
    };

    const ripples: Ripple[] = [];
    let lastMouseX = width / 2;
    let lastMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      // Create wave ripple when mouse moves significantly
      const distMoved = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
      if (distMoved > 40) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 10,
          maxRadius: 180 + Math.random() * 80,
          alpha: 0.6,
          speed: 3.5,
        });
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create big shockwave on click!
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 350,
        alpha: 0.9,
        speed: 5.5,
      });
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    const gridSize = 44;
    const particleCount = 50;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      char: Math.random() > 0.5 ? (Math.random() > 0.5 ? '1' : '0') : (Math.random() > 0.5 ? '+' : '>'),
      alpha: Math.random() * 0.35 + 0.1,
    }));

    let time = 0;

    const render = () => {
      time += 0.03;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Dark Cyber Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Update & render wave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha *= 0.96;

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.lineWidth = 1;

      // Draw Interactive Mesh Grid with Wave Distortion
      for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
          // Calculate wave offset
          let offsetX = 0;
          let offsetY = 0;

          // Mouse proximity wave
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distToMouse = Math.hypot(dx, dy);

          if (distToMouse < mouse.radius) {
            const factor = (1 - distToMouse / mouse.radius) * Math.sin(time * 3 + distToMouse * 0.05);
            offsetX += (dx / (distToMouse || 1)) * factor * 14;
            offsetY += (dy / (distToMouse || 1)) * factor * 14;
          }

          // Ripple wave displacement
          ripples.forEach((r) => {
            const rDx = x - r.x;
            const rDy = y - r.y;
            const rDist = Math.hypot(rDx, rDy);
            const rDiff = Math.abs(rDist - r.radius);
            if (rDiff < 40) {
              const wavePower = (1 - rDiff / 40) * r.alpha * 12;
              offsetX += (rDx / (rDist || 1)) * wavePower;
              offsetY += (rDy / (rDist || 1)) * wavePower;
            }
          });

          const px = x + offsetX;
          const py = y + offsetY;

          // Draw horizontal connection
          if (x + gridSize <= width) {
            ctx.strokeStyle = distToMouse < mouse.radius
              ? `rgba(99, 102, 241, ${0.12 + (1 - distToMouse / mouse.radius) * 0.3})`
              : 'rgba(30, 41, 59, 0.22)';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x + gridSize, y);
            ctx.stroke();
          }

          // Draw vertical connection
          if (y + gridSize <= height) {
            ctx.strokeStyle = distToMouse < mouse.radius
              ? `rgba(56, 189, 248, ${0.12 + (1 - distToMouse / mouse.radius) * 0.3})`
              : 'rgba(30, 41, 59, 0.22)';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y + gridSize);
            ctx.stroke();
          }

          // Intersection Glow Node
          if (distToMouse < mouse.radius * 0.8) {
            const glow = 1 - distToMouse / (mouse.radius * 0.8);
            ctx.fillStyle = `rgba(56, 189, 248, ${glow * 0.7})`;
            ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
          }
        }
      }

      // Mouse Spotlight Glow
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.4);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
      gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      gradient.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Matrix Data Particles
      ctx.font = '10px monospace';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const isNear = dist < mouse.radius;

        ctx.fillStyle = isNear ? 'rgba(56, 189, 248, 0.85)' : `rgba(148, 163, 184, ${p.alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
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
