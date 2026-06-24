import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        d3: "readonly",
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
  },
]);