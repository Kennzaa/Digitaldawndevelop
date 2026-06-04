{
  "brand": {
    "name": "Digital Dawn Develop",
    "attributes": [
      "futuristic",
      "premium",
      "trustworthy",
      "conversion-focused",
      "3D designer aesthetic",
      "mobile-first for Indonesian SMEs"
    ],
    "visual_personality": {
      "keywords": [
        "ice-blue glow",
        "liquid glass panels",
        "soft bloom highlights",
        "scan-line sci-fi overlay",
        "depth + parallax",
        "clean Swiss-like grid with expressive hero"
      ],
      "do": [
        "Use white/light surfaces for readability; reserve gradients for hero/section backdrops only",
        "Use glassmorphism cards with subtle blur + thin borders",
        "Use 3D icons (R3F) with slow float + hover tilt + bloom",
        "Use generous spacing and strong typographic hierarchy",
        "Use micro-interactions everywhere (hover, press, scroll reveal)"
      ],
      "dont": [
        "Do not use purple/pink gradients",
        "Do not cover more than 20% viewport with gradients",
        "Do not use transition: all",
        "Do not center-align entire app container",
        "Do not use HTML-native dropdown/calendar/toast; use shadcn components"
      ]
    }
  },
  "design_tokens": {
    "css_custom_properties": {
      "notes": "Implement by editing /app/frontend/src/index.css :root and .dark. Keep shadcn HSL variables but set them to match this palette. Add extra tokens under :root for gradients/noise/shadows.",
      "colors_hex": {
        "ink": "#071225",
        "ink_2": "#0B1B33",
        "paper": "#F7FAFF",
        "paper_2": "#FFFFFF",
        "blue_600": "#1D4ED8",
        "blue_500": "#2563EB",
        "sky_500": "#0EA5E9",
        "cyan_300": "#67E8F9",
        "ice_200": "#DCEBFF",
        "line": "#D6E3FF",
        "success": "#16A34A",
        "warning": "#F59E0B",
        "danger": "#DC2626"
      },
      "semantic": {
        "bg": "var(--paper)",
        "bg_elevated": "var(--paper_2)",
        "fg": "var(--ink)",
        "fg_muted": "#4B5563",
        "border": "var(--line)",
        "primary": "var(--blue_600)",
        "primary_hover": "#1E40AF",
        "ring": "rgba(37, 99, 235, 0.35)",
        "glass_bg": "rgba(255,255,255,0.62)",
        "glass_border": "rgba(29,78,216,0.18)",
        "glass_shadow": "0 18px 60px rgba(7,18,37,0.10)",
        "glow_blue": "0 0 0 1px rgba(37,99,235,0.18), 0 18px 60px rgba(37,99,235,0.18)",
        "scanline": "rgba(29,78,216,0.10)"
      },
      "gradients": {
        "hero_bg": "radial-gradient(1200px 600px at 20% 10%, rgba(103,232,249,0.55), transparent 55%), radial-gradient(900px 500px at 80% 20%, rgba(37,99,235,0.35), transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 55%, #FFFFFF 100%)",
        "section_accent": "radial-gradient(700px 420px at 50% 0%, rgba(14,165,233,0.22), transparent 60%), linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 100%)",
        "cta_button": "linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(14,165,233,1) 100%)"
      },
      "texture": {
        "noise_overlay_css": "background-image: url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"160\" height=\"160\" filter=\"url(%23n)\" opacity=\"0.18\"/%3E%3C/svg%3E'); mix-blend-mode: overlay; opacity: 0.22; pointer-events: none;"
      },
      "radius": {
        "card": "18px",
        "input": "999px",
        "button": "12px"
      },
      "shadow": {
        "sm": "0 6px 18px rgba(7,18,37,0.08)",
        "md": "0 18px 60px rgba(7,18,37,0.10)",
        "glass": "0 18px 60px rgba(7,18,37,0.10), inset 0 1px 0 rgba(255,255,255,0.55)"
      },
      "spacing": {
        "section_py": "py-16 sm:py-20 lg:py-24",
        "container": "max-w-6xl",
        "gutter": "px-4 sm:px-6 lg:px-8"
      }
    }
  },
  "typography": {
    "font_pairing": {
      "headings": {
        "family": "Space Grotesk",
        "google_fonts_import": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
        "usage": "Hero titles, section headings, pricing/service names"
      },
      "body": {
        "family": "Figtree",
        "google_fonts_import": "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&display=swap",
        "usage": "Body copy, forms, tables, dashboard"
      },
      "mono_optional": {
        "family": "IBM Plex Mono",
        "google_fonts_import": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap",
        "usage": "Order IDs, status chips, small technical labels"
      }
    },
    "tailwind_text_hierarchy": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
      "h2": "text-base md:text-lg text-slate-600",
      "section_title": "text-2xl sm:text-3xl font-semibold tracking-tight",
      "card_title": "text-lg font-semibold",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs text-slate-500"
    },
    "uppercase_hero_style": {
      "className": "uppercase tracking-[0.18em]",
      "notes": "Use for the animated hero title words (word-by-word fade-in). Keep letter spacing high but not too wide on mobile."
    }
  },
  "layout": {
    "grid": {
      "container": "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
      "home_sections": [
        "Hero (full viewport)",
        "Services (bento grid)",
        "Process (timeline)",
        "Testimonials (carousel)",
        "FAQ (accordion)",
        "Contact (glass card + quick links)",
        "Footer"
      ],
      "dashboard": {
        "shell": "grid grid-cols-1 lg:grid-cols-[260px_1fr]",
        "sidebar": "sticky top-0 h-dvh",
        "content": "min-w-0"
      }
    },
    "responsive_rules": [
      "Mobile-first: stack everything; bento grid becomes 1 column",
      "Service cards: 1 col (mobile) → 2 col (sm) → 3 col (lg)",
      "Order summary drawer on mobile (shadcn Drawer), side panel on desktop",
      "Admin tables: horizontal ScrollArea on mobile"
    ]
  },
  "components": {
    "component_path": {
      "shadcn": {
        "button": "/app/frontend/src/components/ui/button.jsx",
        "card": "/app/frontend/src/components/ui/card.jsx",
        "input": "/app/frontend/src/components/ui/input.jsx",
        "label": "/app/frontend/src/components/ui/label.jsx",
        "textarea": "/app/frontend/src/components/ui/textarea.jsx",
        "checkbox": "/app/frontend/src/components/ui/checkbox.jsx",
        "badge": "/app/frontend/src/components/ui/badge.jsx",
        "tabs": "/app/frontend/src/components/ui/tabs.jsx",
        "table": "/app/frontend/src/components/ui/table.jsx",
        "dialog": "/app/frontend/src/components/ui/dialog.jsx",
        "drawer": "/app/frontend/src/components/ui/drawer.jsx",
        "sheet": "/app/frontend/src/components/ui/sheet.jsx",
        "select": "/app/frontend/src/components/ui/select.jsx",
        "dropdown_menu": "/app/frontend/src/components/ui/dropdown-menu.jsx",
        "navigation_menu": "/app/frontend/src/components/ui/navigation-menu.jsx",
        "accordion": "/app/frontend/src/components/ui/accordion.jsx",
        "carousel": "/app/frontend/src/components/ui/carousel.jsx",
        "tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
        "sonner": "/app/frontend/src/components/ui/sonner.jsx",
        "calendar": "/app/frontend/src/components/ui/calendar.jsx",
        "pagination": "/app/frontend/src/components/ui/pagination.jsx",
        "skeleton": "/app/frontend/src/components/ui/skeleton.jsx",
        "separator": "/app/frontend/src/components/ui/separator.jsx",
        "scroll_area": "/app/frontend/src/components/ui/scroll-area.jsx"
      },
      "new_components_to_create": [
        "/app/frontend/src/components/hero/ThreeHero.jsx",
        "/app/frontend/src/components/hero/ScanlineOverlay.jsx",
        "/app/frontend/src/components/services/ServiceCard3D.jsx",
        "/app/frontend/src/components/services/ServicePicker.jsx",
        "/app/frontend/src/components/orders/OrderRequestForm.jsx",
        "/app/frontend/src/components/orders/SuccessConfetti.jsx",
        "/app/frontend/src/components/dashboard/AdminStatsCards.jsx",
        "/app/frontend/src/components/dashboard/OrdersTable.jsx",
        "/app/frontend/src/components/layout/AppShell.jsx",
        "/app/frontend/src/components/layout/GlassPanel.jsx"
      ]
    },
    "styling_recipes": {
      "glass_panel": {
        "className": "rounded-[18px] border border-[rgba(29,78,216,0.18)] bg-[rgba(255,255,255,0.62)] backdrop-blur-xl shadow-[0_18px_60px_rgba(7,18,37,0.10),inset_0_1px_0_rgba(255,255,255,0.55)]",
        "notes": "Use for cards, nav, forms. Keep text areas solid white if readability suffers."
      },
      "primary_button": {
        "className": "rounded-[12px] bg-[linear-gradient(135deg,rgba(37,99,235,1)_0%,rgba(14,165,233,1)_100%)] text-white shadow-[0_14px_40px_rgba(37,99,235,0.22)] hover:shadow-[0_18px_60px_rgba(37,99,235,0.28)] focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.35)]",
        "interaction": "hover: translateY(-1px) via framer-motion; active: scale(0.98)"
      },
      "secondary_button": {
        "className": "rounded-[12px] border border-[rgba(29,78,216,0.22)] bg-white/70 text-slate-900 hover:bg-white focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.28)]",
        "interaction": "hover: subtle glow outline"
      },
      "pill_input": {
        "className": "h-12 rounded-full bg-white/80 backdrop-blur border border-[rgba(29,78,216,0.18)] focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.28)]",
        "notes": "Use for waitlist-like email input and login fields."
      },
      "status_badge": {
        "notes": "Use shadcn Badge with variants mapped to status: new, in_progress, delivered, cancelled.",
        "mapping": {
          "new": "bg-[rgba(37,99,235,0.10)] text-[#1D4ED8] border border-[rgba(37,99,235,0.18)]",
          "in_progress": "bg-[rgba(245,158,11,0.12)] text-[#92400E] border border-[rgba(245,158,11,0.22)]",
          "delivered": "bg-[rgba(22,163,74,0.12)] text-[#166534] border border-[rgba(22,163,74,0.22)]",
          "cancelled": "bg-[rgba(220,38,38,0.10)] text-[#991B1B] border border-[rgba(220,38,38,0.18)]"
        }
      }
    }
  },
  "pages": {
    "home": {
      "hero": {
        "structure": [
          "Left: animated uppercase title word-by-word (framer-motion)",
          "Subtitle + 2 CTAs (Pick Services, Contact WhatsApp)",
          "Right/Background: R3F Canvas with floating orb + depth planes + bloom",
          "Bottom: 'Scroll to explore' button with down arrow"
        ],
        "scanline_overlay": {
          "notes": "Use a subtle animated scanline overlay (blue, low opacity).",
          "css": "background: repeating-linear-gradient(180deg, rgba(29,78,216,0.10) 0px, rgba(29,78,216,0.10) 1px, transparent 2px, transparent 8px); animation: scan 6s linear infinite;",
          "keyframes": "@keyframes scan { from { background-position: 0 0; } to { background-position: 0 120px; } }"
        },
        "r3f_scene_brief": {
          "objects": [
            "Central glass orb (MeshPhysicalMaterial) with subtle refraction-like look",
            "3-5 floating 'service chips' planes around it",
            "Soft point lights + environment",
            "Bloom postprocessing"
          ],
          "mobile_degrade": [
            "adaptive dpr: dpr={[1, 1.5]}",
            "disable heavy effects when prefers-reduced-motion or low-end: reduce bloom intensity, fewer meshes",
            "fallback static hero image if WebGL fails"
          ]
        }
      },
      "services": {
        "layout": "Bento grid with 5 cards; each card contains a small R3F icon canvas (or CSS 3D fallback) + short description + select toggle.",
        "service_list": [
          "Landing Page Website",
          "Content Creator",
          "Designer Reels & Banner",
          "WhatsApp Perusahaan",
          "Jasa Ads (Instagram/TikTok/Facebook)"
        ]
      },
      "process": {
        "component": "Accordion or vertical timeline",
        "steps": [
          "Pilih layanan",
          "Isi brief",
          "Konfirmasi via WhatsApp/email",
          "Produksi",
          "Revisi",
          "Delivery"
        ]
      },
      "contact": {
        "quick_actions": [
          "mailto: Admin@digitaldawndevelop.xyz (prefilled subject/body)",
          "WhatsApp deep link to 085768409658"
        ]
      }
    },
    "auth": {
      "login_register": {
        "layout": "Split layout on desktop: left glass panel form, right decorative gradient + subtle 3D orb. On mobile: stacked.",
        "fields": [
          "email",
          "password"
        ],
        "components": [
          "shadcn Form",
          "Input",
          "Button",
          "Sonner toast for errors"
        ]
      }
    },
    "service_selection_order_flow": {
      "picker": {
        "pattern": "Cart-like multi-select with quantity optional (default 1).",
        "mobile": "Summary in Drawer",
        "desktop": "Summary sticky side panel"
      },
      "order_form": {
        "fields": [
          "brand_name",
          "business_type",
          "goals",
          "budget_range (Select)",
          "deadline (Calendar)",
          "notes (Textarea)",
          "contact_email",
          "contact_whatsapp"
        ],
        "post_submit": {
          "success_state": "Confetti burst + green glow pulse + animated checkmark + CTA buttons",
          "cta_buttons": [
            "Open WhatsApp (prefilled message)",
            "Send Email (prefilled mailto)",
            "View My Orders"
          ]
        }
      }
    },
    "my_orders": {
      "layout": "Cards on mobile, Table on desktop",
      "filters": [
        "status",
        "date range (Calendar in Popover)"
      ]
    },
    "admin_dashboard": {
      "stats": [
        "Total orders",
        "New",
        "In progress",
        "Delivered"
      ],
      "orders_table": {
        "features": [
          "Search",
          "Status filter",
          "Update status (Select)",
          "Open details (Dialog)"
        ]
      }
    }
  },
  "3d_and_motion": {
    "libraries": {
      "install": [
        "npm i three @react-three/fiber @react-three/drei @react-three/postprocessing",
        "npm i framer-motion",
        "npm i canvas-confetti"
      ],
      "notes": "Use R3F (WebGL) not WebGPU. Keep effects light on mobile."
    },
    "r3f_patterns": {
      "hero_canvas": {
        "canvas_props": "<Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 6], fov: 45 }} />",
        "postprocessing": "<EffectComposer><Bloom mipmapBlur intensity={1.0} luminanceThreshold={1} luminanceSmoothing={0.03} /></EffectComposer>",
        "glow_material_rule": "For glowing meshes: set emissiveIntensity > 1 and toneMapped={false} so bloom triggers only on highlights."
      },
      "service_icon_canvas": {
        "notes": "Each service card has a tiny Canvas (120–160px) rendering a simple 3D icon (extruded shape) with float + hover tilt.",
        "hover": "Use pointer events to rotate icon slightly; also increase bloom intensity on hover.",
        "fallback": "If WebGL not available, show a static SVG icon with CSS drop-shadow."
      }
    },
    "framer_motion": {
      "principles": [
        "Entrance: fade + slight y translate (8–12px) with stagger",
        "Hover: subtle lift (y:-2) + glow shadow",
        "Press: scale 0.98",
        "Scroll cue: bouncing arrow (low amplitude)"
      ],
      "avoid": [
        "No constant jitter",
        "No heavy parallax on text blocks"
      ]
    },
    "confetti_success": {
      "implementation": {
        "library": "canvas-confetti",
        "trigger": "On successful order submit, fire 2-3 bursts with different angles/origins.",
        "reduced_motion": "If prefers-reduced-motion, skip confetti and only show checkmark + toast."
      },
      "sample_js": "import confetti from 'canvas-confetti';\n\nexport const burstConfetti = () => {\n  const base = { particleCount: 40, spread: 70, startVelocity: 35, origin: { y: 0.7 } };\n  confetti({ ...base, angle: 60, origin: { x: 0.1, y: 0.7 } });\n  confetti({ ...base, angle: 120, origin: { x: 0.9, y: 0.7 } });\n  confetti({ particleCount: 60, spread: 100, decay: 0.92, scalar: 0.9, origin: { x: 0.5, y: 0.65 } });\n};"
    }
  },
  "content_and_copy": {
    "tone": "Clear, confident, Indonesian-friendly. Short sentences. Benefit-first.",
    "cta_labels": [
      "Pilih Layanan",
      "Konsultasi via WhatsApp",
      "Kirim Brief",
      "Lihat Pesanan Saya"
    ],
    "whatsapp_prefill_template": "Halo Digital Dawn Develop, saya ingin order: {services}. Nama brand: {brand}. Target: {goals}. Budget: {budget}. Deadline: {deadline}."
  },
  "accessibility": {
    "rules": [
      "WCAG AA contrast: body text on white must be ink (#071225) or slate-700+",
      "Focus states: always visible (ring with blue alpha)",
      "Reduced motion: respect prefers-reduced-motion (disable scanline animation, reduce R3F motion, skip confetti)",
      "Touch targets: min 44px height for primary actions",
      "Forms: labels always present; errors announced via Sonner + inline text"
    ]
  },
  "testing": {
    "data_testid_rules": {
      "notes": "All interactive and key informational elements MUST include data-testid in kebab-case describing role.",
      "examples": [
        "data-testid=\"navbar-login-link\"",
        "data-testid=\"hero-scroll-to-explore-button\"",
        "data-testid=\"service-card-landing-page-select-toggle\"",
        "data-testid=\"order-form-submit-button\"",
        "data-testid=\"admin-orders-status-select\"",
        "data-testid=\"my-orders-empty-state\""
      ]
    }
  },
  "image_urls": {
    "hero_background": [
      {
        "url": "https://images.unsplash.com/photo-1557683316-973673baf926?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Blue gradient backdrop for hero (use as fallback image behind Canvas)."
      },
      {
        "url": "https://images.unsplash.com/photo-1557683304-673a23048d34?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Alternate blue gradient for section accents (max 20% viewport)."
      }
    ],
    "about_process": [
      {
        "url": "https://images.pexels.com/photos/7710180/pexels-photo-7710180.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Team collaboration photo for About/Process section (crop to wide)."
      }
    ],
    "decorative_3d": [
      {
        "url": "https://images.pexels.com/photos/29506601/pexels-photo-29506601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Abstract 3D shapes for subtle decorative cards (use sparingly, low opacity)."
      }
    ]
  },
  "instructions_to_main_agent": {
    "global_css_updates": [
      "Remove/ignore default CRA App.css centering patterns; do not use .App { text-align:center }.",
      "Update /app/frontend/src/index.css :root tokens to match the palette; keep shadcn variable structure.",
      "Add a .noise-overlay utility class using the provided SVG noise data URI.",
      "Add scanline keyframes and a .scanline-overlay class (low opacity).",
      "Set body font-family to Figtree; headings use Space Grotesk via Tailwind class on headings or a .font-heading utility."
    ],
    "navigation": [
      "Navbar: left logo (Dawn mark), center links (Services, Process, Contact), right auth buttons.",
      "On mobile: use shadcn Sheet for menu.",
      "Footer: include mailto and WhatsApp links with data-testid."
    ],
    "order_flow": [
      "Service selection must be multi-select with clear summary and estimated timeline.",
      "After submit: show success panel with confetti + two outbound actions (WhatsApp + Email) and a third internal action (My Orders).",
      "Prefill WhatsApp message using encodeURIComponent and wa.me/62... format."
    ],
    "admin": [
      "Admin dashboard uses stats cards + orders table.",
      "Status update uses shadcn Select; details open in Dialog.",
      "Tables must be responsive with ScrollArea on mobile."
    ],
    "performance": [
      "Hero Canvas: keep draw calls low; use simple geometries and 1 composer.",
      "Disable heavy effects on reduced motion; reduce bloom intensity on mobile.",
      "Lazy-load 3D components with React.lazy + Suspense."
    ]
  },
  "general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
