/**
 * ====================================================================
 * CONFETTI MODULE
 * ====================================================================
 * A minimal, dependency-free confetti burst rendered on a full-screen
 * <canvas id="confetti-canvas">. No external library required.
 * ====================================================================
 */

const COLORS = ["#a855f7", "#22d3ee", "#22c55e", "#f5f3ff", "#c084fc"];

let canvas, ctx, particles, animationFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.3,
    size: 6 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speedY: 2 + Math.random() * 3,
    speedX: (Math.random() - 0.5) * 2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

function drawParticle(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.fillStyle = p.color;

  if (p.shape === "rect") {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let stillActive = false;

  for (const p of particles) {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;

    if (p.y < canvas.height + 20) stillActive = true;
    drawParticle(p);
  }

  if (stillActive) {
    animationFrameId = requestAnimationFrame(tick);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Launches a confetti burst.
 * @param {number} count - number of confetti pieces
 */
export function launchConfetti(count = 140) {
  canvas = document.getElementById("confetti-canvas");
  ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  particles = Array.from({ length: count }, createParticle);

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  tick();
}
