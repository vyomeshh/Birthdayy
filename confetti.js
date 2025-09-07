import React, { useEffect, useRef } from 'react';

const maxParticleCount = 150;
const particleSpeed = 2;
const colors = [
  "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue",
  "LightBlue", "Violet", "PaleGreen", "SteelBlue",
  "SandyBrown", "Chocolate", "Crimson"
];

function resetParticle(particle, width, height) {
  particle.color = colors[Math.floor(Math.random() * colors.length)];
  particle.x = Math.random() * width;
  particle.y = Math.random() * height - height;
  particle.diameter = Math.random() * 10 + 5;
  particle.tilt = Math.random() * 10 - 10;
  particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
  particle.tiltAngle = 0;
  return particle;
}

const Confetti = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationTimer = useRef(null);
  const waveAngle = useRef(0);
  const streamingConfetti = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();

    window.addEventListener('resize', resize);

    // Initialize particles
    while (particles.current.length < maxParticleCount) {
      particles.current.push(resetParticle({}, canvas.width, canvas.height));
    }

    streamingConfetti.current = true;

    function drawParticles(ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(particle => {
        ctx.beginPath();
        ctx.lineWidth = particle.diameter;
        ctx.strokeStyle = particle.color;
        const x = particle.x + particle.tilt;
        ctx.moveTo(x + particle.diameter / 2, particle.y);
        ctx.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
        ctx.stroke();
      });
    }

    function updateParticles() {
      waveAngle.current += 0.01;
      const width = canvas.width;
      const height = canvas.height;
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (!streamingConfetti.current && p.y < -15) {
          p.y = height + 100;
        } else {
          p.tiltAngle += p.tiltAngleIncrement;
          p.x += Math.sin(waveAngle.current);
          p.y += (Math.cos(waveAngle.current) + p.diameter + particleSpeed) * 0.5;
          p.tilt = Math.sin(p.tiltAngle) * 15;
        }
        if (p.x > width + 20 || p.x < -20 || p.y > height) {
          if (streamingConfetti.current && particles.current.length <= maxParticleCount) {
            resetParticle(p, width, height);
          } else {
            particles.current.splice(i, 1);
            i--;
          }
        }
      }
    }

    function runAnimation() {
      if (particles.current.length === 0) {
        animationTimer.current = null;
        return;
      }
      updateParticles();
      drawParticles(context);
      animationTimer.current = requestAnimationFrame(runAnimation);
    }

    runAnimation();

    return () => {
      streamingConfetti.current = false;
      window.removeEventListener('resize', resize);
      if (animationTimer.current) {
        cancelAnimationFrame(animationTimer.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default Confetti;
