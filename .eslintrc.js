/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  rules: {
    // CLAUDE.md 禁止事項の強制
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'error',

    // 品質ルール
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-empty-function': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
  },
  overrides: [
    {
      // テストファイルでは console 許可
      files: ['**/*.spec.ts', '**/*.test.ts', '**/*.test.tsx', '**/*.integration.ts'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      // Next.js ファイル
      files: ['apps/web/**/*.ts', 'apps/web/**/*.tsx'],
      env: {
        browser: true,
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    'coverage/',
    '*.js',
    '!.eslintrc.js',
  ],
};
