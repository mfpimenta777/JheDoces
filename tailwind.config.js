/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans' : ['Times new roman', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home" : "url('/assets/confeitaria.webp')"
      }
    },
  },
  plugins: [],
}




