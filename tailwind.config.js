module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        surface2: '#18181f',
        'border': '#2a2a38',
        accent: '#e8ff47',
        accent2: '#ff4747',
        accent3: '#47c4ff',
        text: '#f0f0f5',
        muted: '#6b6b80',
        success: '#47ff9b',
      },
      fontFamily: {
        bebas: 'var(--font-bebas-neue)',
        display: 'var(--font-dm-sans)',
        mono: 'var(--font-space-mono)',
      },
      fontSize: {
        '10px': '10px',
        '11px': '11px',
      },
      spacing: {
        '10px': '10px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      zIndex: {
        100: '100',
        1000: '1000',
        9000: '9000',
        9999: '9999',
      },
    },
  },
  plugins: [],
};
