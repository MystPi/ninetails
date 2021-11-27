module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/index.html',
      './src/browser.js'
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
