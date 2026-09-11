import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F2ECF1",
        muted: "#C7BDC8",
        card: "#221A29",
        border: "#3A2E44",
        blue: { 300: "#F2C230", 400: "#F2C230", 500: "#F2C230", 600: "#F2C230", 700: "#D9A900" },
        slate: { 700: "#2C2234", 800: "#221A29", 900: "#1A1420" },
        emerald: { 400: "#86CDA0", 500: "#2F6B45" },
      },
      fontFamily: { sans: ["'Instrument Sans'", "system-ui", "sans-serif"], display: ["'Bricolage Grotesque'", "sans-serif"] },
    },
  },
  plugins: [],
};

export default config;
