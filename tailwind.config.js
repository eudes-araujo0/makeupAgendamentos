/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./public/**/*.html", 
        "./index.html",
        "./pages/**/*.html",
        "./script/**/*.js",
      ],
      theme: {
        extend: {
          fontFamily: {
            cinzel: ['Cinzel', 'serif'], // Adicionando a fonte 'Cinzel'
          },
        },
      },
      plugins: [],
    }
  