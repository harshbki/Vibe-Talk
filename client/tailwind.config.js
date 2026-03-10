/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#6366f1",
          "primary-content": "#ffffff",
          "secondary": "#8b5cf6",
          "secondary-content": "#ffffff",
          "accent": "#06b6d4",
          "accent-content": "#ffffff",
          "neutral": "#1e293b",
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        dark: {
          "primary": "#818cf8",
          "primary-content": "#ffffff",
          "secondary": "#a78bfa",
          "secondary-content": "#ffffff",
          "accent": "#22d3ee",
          "accent-content": "#0f172a",
          "neutral": "#f1f5f9",
          "neutral-content": "#0f172a",
          "base-100": "#0c0f1a",
          "base-200": "#151929",
          "base-300": "#1a1f35",
          "base-content": "#e2e8f0",
          "info": "#38bdf8",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
  },
}
