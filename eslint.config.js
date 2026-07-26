import js from '@eslint/js';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Two runtimes live in this repo and they do NOT share globals:
 *   - src/       → browser (React app)
 *   - supabase/  → Deno (edge function)
 * The previous config hand-listed a dozen browser globals and applied them
 * everywhere, so anything it forgot (HTMLElement, IntersectionObserver, URL,
 * AbortController…) plus every `Deno.*` reference came back as `no-undef`.
 * That was 82 of the 105 lint errors — config noise, not real defects.
 */
export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.config.js',
      '*.config.ts',
      'vite.config.*',
    ],
  },

  js.configs.recommended,

  // ---------------------------------------------------------------- browser
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
      'react/no-unescaped-entities': 'warn',
      'react/display-name': 'off',
      'react/jsx-key': ['error', {
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
      }],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // console.log is fine while building; it just should not ship silently
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-unused-vars': 'off', // handled by @typescript-eslint/no-unused-vars
      'no-undef': 'off',       // TypeScript already resolves identifiers
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-duplicate-imports': 'error',
    },
  },

  // ------------------------------------------------------------------- Deno
  {
    files: ['supabase/functions/**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.deno, Deno: 'readonly' },
    },
    plugins: { '@typescript-eslint': typescript },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // request/response payloads
      'no-console': 'off',                         // server logs are the point
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
];
