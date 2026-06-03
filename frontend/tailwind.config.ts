import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#e2e8f0",
        muted: "#94a3b8",
        card: "#1e293b",
        border: "#334155",
      },
    },
  },
  plugins: [],
};

export default config;
