import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * GeometricHero
 * Drop-in replacement for ThreeHero.jsx
 * Sama: `className="absolute inset-0"` + aria-hidden + data-testid
 * Beda: floating pill shapes (framer-motion) menggantikan Three.js blob 3D
 *
 * Usage — tidak perlu ubah apapun di parent, cukup ganti import:
 *   import GeometricHero from "@/components/hero/GeometricHero";
 */

const shapes = [
  // { width, height, rotate, gradient, top, left/right, delay, floatY }
  { w: 620, h: 145, rotate: 12,  gradient: ["#6366f1", "#818cf8"], top: "18%",  left: "-8%",  delay: 0.2, floatY: 16 },
  { w: 520, h: 125, rotate: -15, gradient: ["#f43f5e", "#fb7185"], top: "72%",  right: "-4%", delay: 0.4, floatY: 13 },
  { w: 320, h:  82, rotate:  -8, gradient: ["#8b5cf6", "#a78bfa"], bottom:"8%", left: "6%",   delay: 0.3, floatY: 14 },
  { w: 210, h:  58, rotate:  20, gradient: ["#f59e0b", "#fcd34d"], top: "12%",  right:"17%",  delay: 0.5, floatY: 10 },
  { w: 155, h:  42, rotate: -25, gradient: ["#06b6d4", "#67e8f9"], top:  "7%",  left: "22%",  delay: 0.6, floatY: 12 },
  { w: 270, h:  70, rotate:  30, gradient: ["#10b981", "#6ee7b7"], top: "42%",  right:"5%",   delay: 0.35,floatY: 18 },
  { w: 180, h:  48, rotate: -12, gradient: ["#3b82f6", "#93c5fd"], bottom:"22%",right:"28%",  delay: 0.55,floatY: 11 },
];

function ElegantShape({ w, h, rotate, gradient, top, left, right, bottom, delay, floatY }) {
  const posStyle = {};
  if (top    !== undefined) posStyle.top    = top;
  if (left   !== undefined) posStyle.left   = left;
  if (right  !== undefined) posStyle.right  = right;
  if (bottom !== undefined) posStyle.bottom = bottom;

  return (
    <motion.div
      initial={{ opacity: 0, y: -160, rotate: rotate - 15 }}
      animate={{ opacity: 1,  y: 0,    rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      style={{ position: "absolute", ...posStyle }}
    >
      <motion.div
        animate={{ y: [0, floatY, 0] }}
        transition={{ duration: 10 + delay * 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: w, height: h, position: "relative" }}
      >
        {/* outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 9999,
            background: `radial-gradient(ellipse at 30% 40%, ${gradient[0]}22, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
        {/* pill body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9999,
            background: `linear-gradient(100deg, ${gradient[0]}28, transparent 70%)`,
            border: `1.5px solid ${gradient[0]}30`,
            backdropFilter: "blur(2px)",
            boxShadow: `0 8px 32px 0 ${gradient[0]}18`,
          }}
        />
        {/* inner radial shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9999,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.13), transparent 70%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

const GeometricHero = () => {
  return (
    <div
      className="absolute inset-0"
      data-testid="three-hero-canvas"
      aria-hidden="true"
      style={{ overflow: "hidden" }}
    >
      {/* ambient mesh gradient — mirip glow blob tapi lebih subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(99,102,241,0.13) 0%, transparent 65%)," +
            "radial-gradient(ellipse 50% 50% at 30% 60%, rgba(244,63,94,0.08) 0%, transparent 60%)," +
            "radial-gradient(ellipse 40% 40% at 75% 25%, rgba(6,182,212,0.07) 0%, transparent 55%)",
          filter: "blur(40px)",
        }}
      />

      {/* floating pills */}
      {shapes.map((s, i) => (
        <ElegantShape key={i} {...s} />
      ))}

      {/* vignette edges — same as original */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(3,3,3,0.75) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default GeometricHero;
