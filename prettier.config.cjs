/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  semi: false,
  quoteProps: 'consistent',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}

module.exports = config
