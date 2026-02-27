/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // AFH Brand Colors
      colors: {
        // Primary Brand Colors
        'afh-orange': {
          DEFAULT: '#F26729', // Deep Orange Primary
          50: '#FEF4F0',
          100: '#FCE4D6',
          200: '#F9C8AD',
          300: '#F5A573',
          400: '#F4834E',
          500: '#F26729', // Primary
          600: '#E04A14',
          700: '#B8370F',
          800: '#952D14',
          900: '#7A2614',
        },
        'afh-blue': {
          DEFAULT: '#313E48', // Blue Gray Secondary
          50: '#F7F8F9',
          100: '#EBEEF1',
          200: '#D3D9E0',
          300: '#ADB8C4',
          400: '#8092A3',
          500: '#5F7285',
          600: '#4C5C6D',
          700: '#313E48', // Secondary
          800: '#2A3439',
          900: '#252C31',
        },
        // Complementary
        'afh-white': '#FFFFFF',

        // Semantic colors based on brand
        primary: '#F26729',
        secondary: '#313E48',
        accent: '#F26729',
        neutral: '#313E48',

        // CSS Variables for dynamic theming
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },

      // AFH Brand Typography
      fontFamily: {
        primary: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        secondary: [
          'Roboto',
          'Century Gothic',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Default sans
        body: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // Typography Scale
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      // Font Weights (Poppins supports these)
      fontWeight: {
        normal: '400', // Poppins Regular
        medium: '500', // Poppins Medium
        semibold: '600', // Poppins Semibold
        bold: '700', // Poppins Bold
      },

      // Spacing and Layout
      spacing: {
        18: '4.5rem',
        20: '5rem',
        88: '22rem',
        128: '32rem',
      },

      // Border Radius
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      // Box Shadow
      boxShadow: {
        afh: '0 4px 6px -1px rgba(49, 62, 72, 0.1), 0 2px 4px -1px rgba(49, 62, 72, 0.06)',
        'afh-lg':
          '0 10px 15px -3px rgba(49, 62, 72, 0.1), 0 4px 6px -2px rgba(49, 62, 72, 0.05)',
      },

      // Animation and Transitions
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },

      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
