import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 15px 0 var(--gold-glow)',
        legal: '0 10px 40px -10px rgba(0,0,0,0.2)',
        premium: '0 20px 50px -12px rgba(0, 0, 0, 0.12)',
        "card-hover": '0 30px 60px -12px rgba(0, 0, 0, 0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        "pulse-accent": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        reveal: 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        "pulse-accent": 'pulse-accent 3s ease-in-out infinite',
      },
      colors: {
        // Semantic Backgrounds
        app: "var(--bg-app)",
        card: "var(--bg-card)",
        soft: "var(--bg-soft)",
        "accent-bg": "var(--bg-accent)",
        
        // Semantic Text
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        "on-accent": "var(--text-on-accent)",
        
        // Brand Accents
        legal: {
          red: "var(--accent-legal)",
          hover: "var(--accent-hover)",
        },

        // System Status
        status: {
          error: "var(--status-error)",
          success: "var(--status-success)",
          warning: "var(--status-warning)",
        },

        // Borders
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        }
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        plexMono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
