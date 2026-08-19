import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
                pl: {
          purple: "#37003c",
          "purple-soft": "#5a2361",
          accent: "#00ff85",
          "accent-dark": "#00cc6a",
          "accent-text": "#007a3d",
          bg: "#f7f4f9",
          surface: "#ffffff",
          border: "#e5e0eb",
          muted: "#6b5f75",
        },
      },
    },
  },
  plugins: [],
};
export default config;