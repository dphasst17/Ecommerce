import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens:{
      'ssm':'480px',
      // => @media (min-width: 480px) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }
      'smd':'700px',
      // => @media (min-width: 700px) { ... }
      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
    fontFamily: {
      'boo': ['"Fjalla One"', 'sans-serif'],
      'han': ['"PT Sans Narrow"', 'sans-serif'],
      'honk': ['Honk', 'system-ui'],
      'pr': ['Protest Revolution', 'sans-serif']
    },
  },
  /* darkMode: "class", */
  plugins: [nextui()]
}