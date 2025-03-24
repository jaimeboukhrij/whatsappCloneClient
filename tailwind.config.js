/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        navbarBackground: 'var(--navbar-background)',
        backgroundDefault: 'var(--background-default)',
        searchInputBg: 'var(--serach-input-background)',
        textGray: 'var(--text-gray)',
      }
    },
  },
  plugins: [],
}
