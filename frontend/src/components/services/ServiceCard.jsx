import React, { useRef, useState } from "react";
import { ICON_MAP } from "@/data/services";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// A glassy service card with a genuine 3D tilt + floating glowing icon.
export const ServiceCard = ({ service, selected, onToggle, index = 0 }) => {
  const Icon = ICON_MAP[service.icon] || ICON_MAP.Globe;
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 16; // rotateY
    const rx = (0.5 - py) * 16; // rotateX
    setTilt({ rx, ry });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div className="icon3d-wrap" style={{ animationDelay: `${index * 0.08}s` }}>
      <button
        ref={cardRef}
        type="button"
        data-testid={`service-card-${service.id}`}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={() => onToggle && onToggle(service)}
        className={cn(
          "icon3d group relative w-full text-left rounded-[18px] p-6 glass overflow-hidden",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
          selected ? "ring-2 ring-blue-500/70 shadow-[0_0_0_1px_rgba(37,99,235,0.25),0_18px_60px_rgba(37,99,235,0.22)]" : ""
        )}
        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      >
        {/* glow blob */}
        <div
          className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-80"
          style={{ background: `radial-gradient(circle, ${service.color}, transparent 70%)` }}
          aria-hidden="true"
        />

        {/* Selected check */}
        {selected && (
          <div className="absolute top-4 right-4 h-7 w-7 rounded-full cta-gradient flex items-center justify-center shadow-md animate-pop-in" data-testid={`service-card-${service.id}-selected`}>
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
        )}

        {/* 3D icon plate */}
        <div className="relative mb-5" style={{ transform: "translateZ(40px)" }}>
          <div
            className="animate-float inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${service.color} 0%, #67E8F9 120%)`,
              boxShadow: `0 12px 30px ${service.color}55, inset 0 1px 0 rgba(255,255,255,0.4)`,
            }}
          >
            <Icon className="h-8 w-8 text-white" strokeWidth={1.8} />
          </div>
        </div>

        <h3 className="font-heading text-lg font-semibold text-slate-900" style={{ transform: "translateZ(24px)" }}>
          {service.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed" style={{ transform: "translateZ(14px)" }}>
          {service.tagline}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium" style={{ transform: "translateZ(14px)" }}>
          <span className={cn("rounded-full px-3 py-1 transition-colors", selected ? "cta-gradient text-white" : "bg-blue-50 text-blue-700")}>
            {selected ? "Dipilih" : "Pilih layanan"}
          </span>
        </div>
      </button>
    </div>
  );
};

export default ServiceCard;
