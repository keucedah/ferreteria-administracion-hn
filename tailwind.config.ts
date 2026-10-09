import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        marca: {
          50: "#fff7ed",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        marino: {
          700: "#1d3f8f",
          800: "#132d6b",
          900: "#0b1d45",
          950: "#071330",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
