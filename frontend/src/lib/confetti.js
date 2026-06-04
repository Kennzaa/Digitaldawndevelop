import confetti from "canvas-confetti";

export const burstConfetti = () => {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  const colors = ["#2563EB", "#0EA5E9", "#67E8F9", "#16A34A", "#ffffff"];
  const base = { particleCount: 45, spread: 70, startVelocity: 38, colors };
  confetti({ ...base, angle: 60, origin: { x: 0.1, y: 0.7 } });
  confetti({ ...base, angle: 120, origin: { x: 0.9, y: 0.7 } });
  confetti({ particleCount: 70, spread: 110, decay: 0.92, scalar: 0.95, colors, origin: { x: 0.5, y: 0.6 } });
  setTimeout(() => {
    confetti({ particleCount: 50, spread: 90, startVelocity: 30, colors, origin: { x: 0.5, y: 0.55 } });
  }, 250);
};
