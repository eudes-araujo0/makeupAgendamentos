/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./public/**/*.html", 
        "./index.html",
        "./public/scripts/**/*.js",
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
  