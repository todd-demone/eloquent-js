// @ts-check

import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: true,
      },
    },
    rules: {
      quotes: ["error", "double"],
    },
  },
  eslintPluginPrettierRecommended,
);
