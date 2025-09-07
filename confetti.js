const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const confetti = [];
for (let i = 0; i < 150; i++) {
  confetti.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 2,
    dx: Math.random() - 0.5,
    dy: Math.random() * 2 + 1,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.y > canvas.height) p.y = -10;
    if (p.x > canvas.width) p.x = 0;
    if (p.x < 0) p.x = canvas.width;
  });
  requestAnimationFrame(draw);
}
draw();
