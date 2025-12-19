import tseslint from "typescript-eslint";

/**
 * Base ESLint configuration for TypeScript projects
 * Spread this in your app/package eslint.config.mjs
 *
 * Usage:
 * import { baseConfig } from "../../packages/config/eslint.base.config.mjs";
 * export default defineConfig([...baseConfig, ...yourConfig]);
 */
export const baseConfig = [
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      // Add shared rules here
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

