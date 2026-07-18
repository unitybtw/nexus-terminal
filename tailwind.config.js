/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ffffff",
        "on-error-container": "#ffdad6",
        "surface-bright": "#3a3939",
        "outline": "#8e9193",
        "background": "#0f172a", /* Slate */
        "on-secondary": "#213145",
        "secondary-fixed-dim": "#b7c8e1",
        "surface-dim": "#131313",
        "on-secondary-fixed": "#0b1c30",
        "secondary-container": "#3a4a5f",
        "surface": "#131313",
        "surface-variant": "#353535",
        "primary-container": "#e0e3e5",
        "on-secondary-fixed-variant": "#38485d",
        "surface-container-highest": "#353535",
        "on-surface-variant": "#c4c7c9",
        "secondary": "#b7c8e1",
        "primary-fixed": "#e0e3e5",
        "inverse-surface": "#e5e2e1",
        "on-tertiary-fixed-variant": "#494640",
        "on-error": "#690005",
        "on-primary-fixed-variant": "#444749",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-high": "#2a2a2a",
        "on-background": "#e5e2e1",
        "on-secondary-container": "#a9bad3",
        "surface-container-low": "#1c1b1b",
        "primary-fixed-dim": "#c4c7c9",
        "on-tertiary": "#32302a",
        "inverse-primary": "#5c5f61",
        "surface-tint": "#c4c7c9",
        "surface-container": "#201f1f",
        "tertiary-fixed": "#e7e2d9",
        "inverse-on-surface": "#313030",
        "on-primary": "#2d3133",
        "outline-variant": "#444749",
        "on-primary-container": "#626567",
        "tertiary": "#ffffff",
        "tertiary-container": "#e7e2d9",
        "on-primary-fixed": "#191c1e",
        "error": "#ffb4ab",
        "tertiary-fixed-dim": "#cbc6bd",
        "error-container": "#93000a",
        "on-tertiary-fixed": "#1d1b16",
        "on-tertiary-container": "#67645d",
        "secondary-fixed": "#d3e4fe",
        "on-surface": "#e5e2e1",
        "positive": "#4ade80",
        "negative": "#f87171",
        "border-subtle": "#1e293b"
      },
      spacing: {
        "xs": "8px",
        "gutter": "24px",
        "sm": "16px",
        "xl": "64px",
        "lg": "40px",
        "md": "24px",
        "base": "4px",
        "margin-safe": "32px"
      },
      fontFamily: {
        "label-md": ["Inter"],
        "display-lg": ["Inter"],
        "mono-data": ["JetBrains Mono"],
        "body-lg": ["Inter"],
        "headline-lg": ["Inter"],
        "headline-md": ["Inter"],
        "body-md": ["Inter"],
        "body-sm": ["Inter"]
      }
    }
  }
}
