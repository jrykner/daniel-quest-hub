/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyan Gaming Theme for Daniel
        primary: {
          50: '#E0FFFF',   // Light Cyan
          100: '#B0FFFF',
          200: '#80FFFF', 
          300: '#40FFFF',
          400: '#00FFFF',  // Primary Cyan
          500: '#00E6E6',
          600: '#00CCCC',
          700: '#00B3B3',
          800: '#008B8B',  // Dark Cyan
          900: '#006666',
          950: '#004444',
        },
        accent: {
          400: '#1E90FF',  // Accent Blue
          500: '#0080FF',
          600: '#0066CC',
        },
        gaming: {
          bg: '#0A0A0A',      // Dark Background
          card: '#1A1A1A',    // Card Background
          border: '#333333',  // Border Color
        },
        text: {
          primary: '#FFFFFF',    // Primary Text
          secondary: '#CCCCCC',  // Secondary Text
          muted: '#999999',      // Muted Text
        }
      },
      fontFamily: {
        'gaming': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF' },
          '100%': { boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #00FFFF 0%, #008B8B 100%)',
        'gradient-accent': 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
      }
    },
  },
  plugins: [],
}