import React from "react";
import { motion } from "framer-motion";

const shapes = [
  { w: 680, h: 155, rotate: 12,  color: "rgba(99,102,241,0.18)",  border: "rgba(99,102,241,0.25)",  top: "18%",  left: "-10%", delay: 0.2, floatY: 16 },
  { w: 560, h: 130, rotate: -15, color: "rgba(244,63,94,0.18)",   border: "rgba(244,63,94,0.25)",   top: "72%",  right: "-5%", delay: 0.4, floatY: 13 },
  { w: 340, h:  88, rotate:  -8, color: "rgba(139,92,246,0.18)",  border: "rgba(139,92,246,0.25)",  bottom:"8%", left: "6%",   delay: 0.3, floatY: 14 },
  { w: 220, h:  60, rotate:  20, color: "rgba(245,158,11,0.18)",  border: "rgba(245,158,11,0.25)",  top: "12%",  right:"17%",  delay: 0.5, floatY: 10 },
  { w: 165, h:  44, rotate: -25, color: "rgba(6,182,212,0.18)",   border: "rgba(6,182,212,0.25)",   top:  "7%",  left: "22%",  delay: 0.6, floatY: 12 },
  { w: 290, h:  75, rotate:  30, color: "rgba(16,185,129,0.18)",  border: "rgba(16,185,129,0.25)",  top: "42%",  right:"4%",   delay: 0.35,floatY: 18 },
  { w: 190, h:  50, rotate: -12, color: "rgba(59,130,246,0.18)",  border: "rgba(59,130,246,0.25)",  bottom:"22%",right:"28%",  delay: 0.55,floatY: 11 },
];

function ElegantShape({ w, h, rotate, color, border, top, left, right, bottom, delay, floatY }) {
  const pos = {};
  if (top    !== undefined) pos.top    = top;
  if (left   !== undefined) pos.left   = left;
  if (right  !== undefined) pos.right  = right;
  if (bottom !== undefined) pos.bottom = bottom;

  return (
    <motion.div
      initial={{ opacity: 0, y: -160, rotate: rotate - 15 }}
      animate={{ opacity: 1,  y: 0,    rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      style={{ position: "absolute", ...pos }}
    >
      <motion.div
        animate={{ y: [0, floatY, 0] }}
        transition={{ duration: 10 + delay * 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: w, height: h, position: "relative" }}
      >
        {/* glow blur behind */}
        <div style={{
          position: "absolute", inset: -4, borderRadius: 9999,
          background: color, filter: "blur(12px)",
        }} />
        {/* main pill */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 9999,
          background: `linear-gradient(105deg, ${color}, transparent 65%)`,
          border: `1.5px solid ${border}`,
          backdropFilter: "blur(3px)",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08)`,
        }} />
        {/* inner shine */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 9999,
          background: "radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.12), transparent 60%)",
        }} />
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
      style={{ overflow: "hidden", background: "#030303" }}
    >
      {/* deep ambient glow */}
      <div style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(99,102,241,0.07) 0%, transparent 60%)," +
          "radial-gradient(ellipse 45% 45% at 25% 65%, rgba(244,63,94,0.05) 0%, transparent 55%)",
        filter: "blur(30px)",
      }} />

      {shapes.map((s, i) => <ElegantShape key={i} {...s} />)}

      {/* top + bottom fade to match #030303 bg */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, #030303 0%, transparent 18%, transparent 80%, #030303 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
};

export default GeometricHero;
