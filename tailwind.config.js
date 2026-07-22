/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Caveat"', 'cursive'],
        body: ['"Quicksand"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#fbf3e4',
        lavender: '#c9b6e4',
        lavenderDeep: '#9d7fc7',
        blush: '#f6c6d4',
        blushDeep: '#e89aa9',
        sage: '#a8c69a',
        sageDeep: '#6f9c63',
        butter: '#f5d76e',
        butterDeep: '#e6b73e',
        twilight: '#3a2a5c',
        twilightDeep: '#241844',
        parchment: '#f3e4c1',
        parchmentDeep: '#d9c08a',
        ink: '#5a4a2e',
        wax: '#a23b3b',
      },
    },
  },
  plugins: [],
};
