// frontend/.eslintrc.js

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    // Base ESLint recommended rules
    "eslint:recommended",

    // TypeScript rules
    "plugin:@typescript-eslint/recommended",

    // Vue 3 rules
    "plugin:vue/vue3-recommended",

    // Vuetify rules
    "plugin:vuetify/recommended",

    // Prettier integration
    "eslint-config-prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "vuetify"],
  rules: {
    "vue/multi-word-component-names": "off",
  },
};