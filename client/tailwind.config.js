/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  // Include your main HTML file
    "./src/**/*.{js,jsx,ts,tsx}",  // Include all component files
  ],
  theme: {
    extend: {
      colors: {
        reddit_orange: '#f54404',
        reddit_red: '#f54404',
        reddit_dark: {
          DEFAULT: '#030303',
          brighter: '#1a1a1a',
          brightest: '#272728',
        },
        reddit_border: {
          DEFAULT: '#343536',
        },
        reddit_text: {
          DEFAULT: 'rgb(215, 218, 220)',
          darker: '#818384',
        },
      }
    },
  },
  plugins: [],
}

