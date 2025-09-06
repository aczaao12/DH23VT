import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // New configuration for Firebase Functions
  {
    files: ['functions/**/*.js'], // Target JavaScript files in the functions directory
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node, // Set Node.js globals
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs', // Functions typically use CommonJS modules
      },
    },
    rules: {
      // Temporarily ignore 'context' for no-unused-vars in functions/index.js
      'no-unused-vars': ['error', { argsIgnorePattern: '^context$' }],
    },
  },
])