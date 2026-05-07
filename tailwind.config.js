/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./docs/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "ui-monospace", "monospace"]
      },
      colors: {
        ink: "#101820",
        paper: "#f7f3e8",
        river: "#2364aa",
        mint: "#2fbf71",
        coral: "#f45b69",
        amber: "#f5a623"
      },
      boxShadow: {
        soft: "0 18px 60px rgb(16 24 32 / 0.16)"
      }
    }
  },
  plugins: []
};
