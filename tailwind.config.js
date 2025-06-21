/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2B2D42',
        secondary: '#8D99AE',
        accent: '#EF233C',
        background: '#EDF2F4',
        foreground: '#0B0C10',
        'dark-bg': '#0F0F0F',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 2s infinite',
        'scanline': 'scanline 3s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'cyber-pulse': 'cyberPulse 3s ease-in-out infinite',
        'hologram': 'hologram 4s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { 
            transform: 'translateX(0)',
            filter: 'hue-rotate(0deg)'
          },
          '10%': { 
            transform: 'translateX(-2px) skewX(-2deg)',
            filter: 'hue-rotate(90deg)'
          },
          '20%': { 
            transform: 'translateX(2px) skewX(2deg)',
            filter: 'hue-rotate(180deg)'
          },
          '30%': { 
            transform: 'translateX(-1px) skewX(-1deg)',
            filter: 'hue-rotate(270deg)'
          },
          '40%': { 
            transform: 'translateX(1px) skewX(1deg)',
            filter: 'hue-rotate(360deg)'
          },
          '50%': { 
            transform: 'translateX(-0.5px) skewX(-0.5deg)',
            filter: 'hue-rotate(180deg)'
          },
        },
        scanline: {
          '0%': { 
            transform: 'translateY(-100vh) scaleY(0.1)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '90%': {
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(100vh) scaleY(0.1)',
            opacity: '0'
          },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(60px) scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        slideInRight: {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          },
        },
        slideInLeft: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)' 
          },
          '25%': { 
            transform: 'translateY(-20px) rotate(1deg)' 
          },
          '50%': { 
            transform: 'translateY(-10px) rotate(-1deg)' 
          },
          '75%': { 
            transform: 'translateY(-15px) rotate(0.5deg)' 
          },
        },
        pulseGlow: {
          '0%': {
            boxShadow: '0 0 20px rgba(239, 35, 60, 0.3)',
            transform: 'scale(1)'
          },
          '100%': {
            boxShadow: '0 0 40px rgba(239, 35, 60, 0.6)',
            transform: 'scale(1.02)'
          }
        },
        gradientShift: {
          '0%, 100%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          }
        },
        bounceSubtle: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        },
        rotateSlow: {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },
        matrixRain: {
          '0%': {
            transform: 'translateY(-100vh)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '90%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(100vh)',
            opacity: '0'
          }
        },
        cyberPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(239, 35, 60, 0.5), inset 0 0 20px rgba(239, 35, 60, 0.1)',
            borderColor: 'rgba(239, 35, 60, 0.5)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(239, 35, 60, 0.8), inset 0 0 40px rgba(239, 35, 60, 0.2)',
            borderColor: 'rgba(239, 35, 60, 0.8)'
          }
        },
        hologram: {
          '0%, 100%': {
            opacity: '0.8',
            transform: 'translateY(0px)'
          },
          '50%': {
            opacity: '1',
            transform: 'translateY(-2px)'
          }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(45deg, #2B2D42 0%, #8D99AE 25%, #EF233C 50%, #2B2D42 75%, #8D99AE 100%)',
        'cyber-grid': 'linear-gradient(rgba(239, 35, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 35, 60, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cyber-grid': '20px 20px',
      }
    },
  },
  plugins: [],
};