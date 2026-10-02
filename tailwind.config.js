/**
 * Tailwind convive con Bootstrap:
 *  - prefix "tw-" evita choques de nombres (p-4, d-flex, etc.).
 *  - preflight desactivado: el reset lo aporta Bootstrap (Reboot).
 * Recompilar tras cambiar clases tw-:
 *   npx tailwindcss@3 -c tailwind.config.js -i assets/css/tailwind.input.css -o assets/css/tailwind.css --minify
 */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  prefix: "tw-",
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
