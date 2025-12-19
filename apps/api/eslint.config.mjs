import { defineConfig } from "eslint/config";
import { baseConfig } from "../../packages/config/eslint.base.config.mjs";

export default defineConfig([
  ...baseConfig,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
]);

