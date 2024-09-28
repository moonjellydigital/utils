// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsdoc.configs['flat/recommended-typescript'],
  eslintConfigPrettier,
  {
    ignores: ['dist/**/*'],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      jsdoc,
    },
  },
);
