import type { Config } from "tailwindcss";

/**
 * Fair Value — Tailwind CSS Configuration
 * 
 * NOTE: With Tailwind CSS v4, the primary configuration is done via
 * CSS @theme directives in src/app/globals.css. This file serves as
 * documentation and tooling reference for the design system tokens.
 * 
 * Color Palette:
 * - Navy (#00335E): Primary — headers, navigation, primary backgrounds
 * - White (#FFFFFF): Cards, text on dark, clean backgrounds
 * - Forest (#3E442B): Dark olive green — accents, secondary panels
 * - Sage (#6A7062): Gray-green — muted text, borders, subtle backgrounds
 * - Amber (#ECA72C): CTA buttons, highlights, active states, premium accents
 * 
 * Typography:
 * - Headings: Montserrat (bold, tight tracking)
 * - Body: Inter (clean, modern, highly legible)
 * - Mono: JetBrains Mono (countdown timers, code)
 * 
 * Spacing: 4px base grid
 * Border Radius: 8-16px for components, 20-24px for cards/panels
 * 
 * Glassmorphism Utilities (defined in globals.css):
 * - .glass: backdrop-blur-md + bg-white/10 + border-white/20 + shadow-xl
 * - .glass-dark: navy-tinted glass for dark panels
 * - .glass-card: larger blur, subtle border, rounded-2xl
 * - .glass-nav: navigation-specific glass effect
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#00335E",
          light: "#004B8D",
          dark: "#001F3A",
        },
        forest: {
          DEFAULT: "#3E442B",
          light: "#4E5638",
          dark: "#2E3320",
        },
        sage: {
          DEFAULT: "#6A7062",
          light: "#7D8473",
          dark: "#575C4F",
        },
        amber: {
          DEFAULT: "#ECA72C",
          light: "#F0BA54",
          dark: "#D4911E",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Montserrat", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "2.5": "10px",
        "3": "12px",
        "3.5": "14px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "11": "44px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "28": "112px",
        "32": "128px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 51, 94, 0.05)",
        md: "0 4px 6px -1px rgba(0, 51, 94, 0.08), 0 2px 4px -2px rgba(0, 51, 94, 0.05)",
        lg: "0 10px 15px -3px rgba(0, 51, 94, 0.08), 0 4px 6px -4px rgba(0, 51, 94, 0.04)",
        xl: "0 20px 25px -5px rgba(0, 51, 94, 0.1), 0 8px 10px -6px rgba(0, 51, 94, 0.05)",
        "2xl": "0 25px 50px -12px rgba(0, 51, 94, 0.2)",
        glow: "0 0 20px rgba(236, 167, 44, 0.3)",
        "glow-lg": "0 0 40px rgba(236, 167, 44, 0.4)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
