/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ejs}", // Include all HTML, JS, and EJS files in the src directory and its subdirectories
    "./views/**/*.ejs",          // If you're using an Express setup with views folder
    "./public/**/*.html"         // Adjust according to your file structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
