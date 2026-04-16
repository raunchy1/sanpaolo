import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Stitch Design System — Roman Editorial Excellence
  			'stitch': {
  				'green': '#072316',
  				'green-light': '#0F3D28',
  				'green-hover': '#1A5C3E',
  				'olive': '#596332',
  				'olive-light': '#7A8A4A',
  				'bronze': '#420600',
  				'bronze-light': '#6B0A00',
  				'ivory': '#FFF8F5',
  				'ivory-warm': '#F5EDE6',
  				'ivory-cool': '#F0EBE3',
  				'surface': '#FAF6F2',
  				'surface-high': '#FFFFFF',
  				'surface-dim': '#EDE7E0',
  				'on-surface': '#29170D',
  				'on-surface-muted': '#6B5D52',
  				'gold': '#C8A96B',
  				'whatsapp': '#25D366',
  			},
  			// Legacy compatibility (map to Stitch values)
  			'luxury-green': '#072316',
  			'luxury-dark': '#0F3D28',
  			'luxury-sage': '#7A8A4A',
  			'luxury-ivory': '#FFF8F5',
  			'luxury-gold': '#C8A96B',
  			'luxury-charcoal': '#29170D',
  			'luxury-muted': '#6B5D52',
  			'roman': {
  				'espresso': '#29170D',
  				'warm-white': '#FFF8F5',
  				'terracotta': '#072316',
  				'terracotta-light': '#1A5C3E',
  				'gold': '#C8A96B',
  				'gold-light': '#D4BA85',
  				'cream': '#F5EDE6',
  				'sand': '#EDE7E0',
  				'whatsapp': '#25D366',
  				'olive': '#596332',
  				'shadow': 'rgba(41, 23, 13, 0.06)',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'luxury': '24px',
  			'luxury-lg': '28px',
  			'editorial': '16px',
  		},
  		fontFamily: {
  			'display': ['var(--font-newsreader)', 'Georgia', 'serif'],
  			'headline': ['var(--font-newsreader)', 'Georgia', 'serif'],
  			'body': ['var(--font-manrope)', 'system-ui', 'sans-serif'],
  			'label': ['var(--font-manrope)', 'system-ui', 'sans-serif'],
  			'editorial': ['var(--font-newsreader)', 'Georgia', 'serif'],
  			'ui': ['var(--font-manrope)', 'system-ui', 'sans-serif'],
  		},
  		boxShadow: {
  			'ambient': '0 24px 48px -12px rgba(41, 23, 13, 0.06)',
  			'ambient-lg': '0 32px 64px -16px rgba(41, 23, 13, 0.08)',
  			'ambient-sm': '0 8px 24px -4px rgba(41, 23, 13, 0.04)',
  			'float': '0 16px 40px -8px rgba(41, 23, 13, 0.12)',
  			'glow-green': '0 0 24px 4px rgba(7, 35, 22, 0.12)',
  			'glow-gold': '0 0 24px 4px rgba(200, 169, 107, 0.15)',
  			'ghost': '0 1px 0 0 rgba(41, 23, 13, 0.06)',
  		},
  		animation: {
  			'fade-up': 'fadeUp 0.6s ease-out forwards',
  			'hover-lift': 'hoverLift 0.3s ease-out',
  			'btn-shine': 'btnShine 0.6s ease-out',
  			'glow': 'glow 0.4s ease-out',
  			'scroll-reveal': 'scrollReveal 0.8s cubic-bezier(0.25, 0.4, 0.25, 1) forwards',
  		},
  		keyframes: {
  			fadeUp: {
  				'0%': { opacity: '0', transform: 'translateY(24px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			hoverLift: {
  				'0%': { transform: 'translateY(0)' },
  				'100%': { transform: 'translateY(-4px)' },
  			},
  			btnShine: {
  				'0%': { backgroundPosition: '-200% center' },
  				'100%': { backgroundPosition: '200% center' },
  			},
  			glow: {
  				'0%': { boxShadow: '0 0 0 0 rgba(7, 35, 22, 0)' },
  				'100%': { boxShadow: '0 0 20px 4px rgba(7, 35, 22, 0.12)' },
  			},
  			scrollReveal: {
  				'0%': { opacity: '0', transform: 'translateY(40px) scale(0.98)' },
  				'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
  			},
  		},
  		spacing: {
  			'section': '120px',
  			'editorial': '96px',
  		},
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;