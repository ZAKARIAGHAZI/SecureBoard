import { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const shapes = [];

    // Créer 30 formes aléatoires
    for (let i = 0; i < 30; i++) {
      shapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 20 + 10,
        dx: (Math.random() - 0.5) * 1.5,
        dy: (Math.random() - 0.5) * 1.5,
        color: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.3)`
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      shapes.forEach(shape => {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fillStyle = shape.color;
        ctx.fill();

        shape.x += shape.dx;
        shape.y += shape.dy;

        // Rebondir sur les bords
        if (shape.x < 0 || shape.x > width) shape.dx *= -1;
        if (shape.y < 0 || shape.y > height) shape.dy *= -1;
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,  // derrière le formulaire
        width: "100vw",
        height: "100vh",
        backgroundColor: "#747bff"
      }}
    />
  );
}
