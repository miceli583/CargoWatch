import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CargoWatch Brand Colors
        brand: {
          red: "#D93025",
          "red-hover": "#C72419",
          navy: "#1B202B",
          "navy-light": "#242936",
          "navy-dark": "#151822",
        },
        // Severity Colors
        severity: {
          critical: "#D93025",
          high: "#F97316",
          medium: "#FBBF24",
          low: "#10B981",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
