import React, { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    const numStars = 150; // Reduced star count for subtlety

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.3, // Smaller stars
        vx: Math.random() * 0.1 - 0.05, // Slower velocity
        vy: Math.random() * 0.1 - 0.05,
        alpha: Math.random() * 0.4 + 0.3, // More transparent
        color: `rgba(100, 255, 150, ${Math.random() * 0.3 + 0.2})` // Faint green stars
      });
    }
    
    const drawNebula = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radiusX = canvas.width * 0.7; // Wider, more diffuse
      const radiusY = canvas.height * 0.5;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY));
      gradient.addColorStop(0, 'rgba(10, 50, 20, 0.05)'); // Very subtle dark green center
      gradient.addColorStop(0.4, 'rgba(0, 30, 10, 0.08)'); 
      gradient.addColorStop(0.7, 'rgba(0, 15, 5, 0.05)');   
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); 

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.fill();
    };


    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Optional: Fill with a very dark base color if not using CSS background
      // ctx.fillStyle = '#191414'; // Spotify-like black
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawNebula();

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;
        
        if (star.x < -50) star.x = canvas.width + 50;
        if (star.x > canvas.width + 50) star.x = -50;
        if (star.y < -50) star.y = canvas.height + 50;
        if (star.y > canvas.height + 50) star.y = -50;
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.length = 0; 
      for (let i = 0; i < numStars; i++) { 
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          vx: Math.random() * 0.1 - 0.05,
          vy: Math.random() * 0.1 - 0.05,
          alpha: Math.random() * 0.4 + 0.3,
          color: `rgba(100, 255, 150, ${Math.random() * 0.3 + 0.2})`
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-spotify-black" />;
};

export default GalaxyBackground;