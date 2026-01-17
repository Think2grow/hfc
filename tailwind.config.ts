import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4d648e',
        dark: '#1a2233',
        light: '#f7fafc',
        background: '#f5f6fa',
        accent: '#7fc29b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
