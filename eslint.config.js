import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['dist/', '.vite/', 'playwright-report/', 'test-results/']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      eqeqeq: 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  { files: ['src/js/**/*.js'], languageOptions: { globals: globals.browser } },
  {
    files: ['*.config.js', 'scripts/**/*.js', 'tests/**/*.js'],
    languageOptions: { globals: globals.nodeBuiltin },
  },
  prettier,
);
