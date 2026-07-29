import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        accent: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
          950: "#4a044e",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "worm-crawl": "wormCrawl 2.4s ease-in-out infinite",
        "worm-wiggle": "wormWiggle 0.8s ease-in-out infinite",
        "worm-segment": "wormSegment 0.8s ease-in-out infinite",
        "inch-nudge": "inchNudge 1.4s ease-in-out infinite",
        "inch-head": "inchHead 1.4s ease-in-out infinite",
        "wave-head": "waveHead 1.2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(14, 165, 233, 0.6)" },
        },
        wormCrawl: {
          "0%, 100%": { transform: "translateX(-12px)" },
          "50%": { transform: "translateX(12px)" },
        },
        wormWiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        wormSegment: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        inchNudge: {
          "0%, 38%": { transform: "translateX(-8px)" },
          "72%, 100%": { transform: "translateX(8px)" },
        },
        inchHead: {
          "0%": { transform: "translate(0px, 0px)" },
          "38%": { transform: "translate(-12px, -4px)" },
          "72%": { transform: "translate(18px, 0px)" },
          "100%": { transform: "translate(0px, 0px)" },
        },
        // Head rides the wave tip: 36 → 52 → 36 → 20 → 36
        waveHead: {
          "0%, 100%": { transform: "translateY(0px)" },
          "25%": { transform: "translateY(16px)" },
          "75%": { transform: "translateY(-16px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "aurora-gradient":
          "linear-gradient(45deg, #0ea5e9, #d946ef, #f59e0b, #10b981)",
      },
    },
  },
  plugins: [],
};
export default config;
