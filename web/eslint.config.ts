// eslint.config.ts

import type { Linter } from "eslint";
import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";
import globals from "globals";
import sonarjs from "eslint-plugin-sonarjs";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // --- 1. GLOBAL IGNORES ---
  // This block tells ESLint to completely ignore certain files and folders.
  // This is crucial for performance and to prevent linting build artifacts,
  // dependencies, or configuration files that don't need to be checked.
  {
    ignores: [
      "dist/",
      "node_modules/",
      "__tests__/",
      "cypress/",
      "scripts/",
      "vite.config.ts",
      "tailwind.config.cjs",
      "postcss.config.js",
      "babel.config.cjs",
      "src/shared/components/shadcn",
      "src/shared/api",
    ],
  },

  // --- 2. GLOBAL RULES ---
  // These are the base recommended rules from ESLint that apply to all files
  // that are not ignored.
  eslint.configs.recommended,
  sonarjs.configs.recommended, // General bugs

  // --- 3. TYPESCRIPT STRICT & STYLISTIC CONFIGS ---
  // TypeScript strict type-checked and stylistic configs
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.{ts,tsx}", "__testUtils__/**/*.{ts,tsx}"],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.{ts,tsx}", "__testUtils__/**/*.{ts,tsx}"],
  })),

  // --- 4. TYPESCRIPT SOURCE CODE CONFIGURATION ---
  // This is the most important block. It defines the strict, type-aware linting
  // rules that ONLY apply to your TypeScript source files.
  {
    files: ["src/**/*.{ts,tsx}", "__testUtils__/**/*.{ts,tsx}"],
    // Configures the parser to understand TypeScript and find the tsconfig.json.
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    // Registers the plugins we want to use in this block.
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      unicorn: unicorn,
      import: pluginImport,
    },
    // Shared settings for plugins.
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      // This is crucial for making path aliases (e.g., `@/components`) work.
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          // We point it to all tsconfig files to ensure it finds all aliases.
          project: ["./tsconfig.json", "./tsconfig.node.json"],
        },
        node: true,
      },
    },
    // Our custom rules and overrides.
    rules: {
      // Disable unified-signatures rule due to crashes in @typescript-eslint/eslint-plugin
      "@typescript-eslint/unified-signatures": "off",
      // Prevents `console.log` (In prod), but allows `console.warn` and `console.error`.
      "no-console": ["error", { allow: ["warn", "error"] }],
      // Enforces the project's coding conventions for naming variables, functions, etc.
      "@typescript-eslint/naming-convention": [
        "error",
        // Allows `_id` from MongoDB or other APIs.
        {
          selector: ["memberLike", "parameter"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        { selector: "default", format: ["camelCase"] },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        {
          selector: "import",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["snake_case"] },
      ],
      // Enforces that all filenames are in kebab-case (e.g., `user-profile.ts`).
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      // Automatically sorts and groups import statements.
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [{ pattern: "@**/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      // Catches imports that cannot be resolved to a file.
      "import/no-unresolved": "error",
      // Ensures that named imports exist in the imported file.
      "import/named": "error",
      // Prevents importing the same module multiple times.
      "import/no-duplicates": "error",
    },
  },

  // --- 5. REACT-SPECIFIC CONFIGURATION ---
  // This block applies rules specifically for React components (JSX/TSX files).
  {
    files: ["src/**/*.{jsx,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    plugins: {
      react: react,
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      // Adds global variables for browser environments (like `window` or `document`).
      globals: { ...globals.browser, React: "readonly" },
    },
    settings: {
      // Helps the React plugin automatically detect the version of React.
      react: { version: "detect" },
    },
    rules: {
      // Enables the recommended rules from the React plugins.
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      // Rule for Vite's Fast Refresh feature.
      "react-refresh/only-export-components": "warn",
      // We turn this off because TypeScript handles prop type checking for us.
      "react/prop-types": "off",
      // Enforces self-closing tags for components with no children, e.g. `<div />`.
      "react/self-closing-comp": ["error", { component: true, html: true }],
      // Removes unnecessary curly braces in JSX, e.g. `name={"John"}` -> `name="John"`.
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      // Enforces that all React components are written as arrow functions.
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
    },
  },

  // --- 6. PRETTIER CONFIGURATION ---
  // This MUST be the last item. It disables any ESLint rules that conflict
  // with Prettier, letting Prettier handle all code formatting.
  prettierConfig,
] satisfies Linter.Config[];
