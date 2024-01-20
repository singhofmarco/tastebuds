import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: { DEFAULT: '#FF4500', foreground: '#FFFFFF' }, // Bright orange with white text
          success: { DEFAULT: '#32CD32', foreground: '#FFFFFF' }, // Lime green with white text
          error: { DEFAULT: '#FF6347', foreground: '#FFFFFF' }, // Tomato red with white text
          warning: { DEFAULT: '#FFC107', foreground: '#FFFFFF' }, // Gold yellow with white text
          secondary: { DEFAULT: '#787878', foreground: '#FFFFFF' }
        }
      },
      dark: {
        colors: {
          primary: { DEFAULT: '#FF4500', foreground: '#FFFFFF' }, // Bright orange with white text
          success: { DEFAULT: '#32CD32', foreground: '#FFFFFF' }, // Lime green with white text
          error: { DEFAULT: '#FF6347', foreground: '#FFFFFF' }, // Tomato red with white text
          warning: { DEFAULT: '#FFC107', foreground: '#FFFFFF' }, // Gold yellow with white text
          secondary: { DEFAULT: '#787878', foreground: '#FFFFFF' }
        }
      }
    }
  })],
}
