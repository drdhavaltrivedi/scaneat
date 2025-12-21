// ESLint configuration for Firebase Functions (ESLint v9+ format)
module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // Allow console.log in Cloud Functions
      'no-console': 'off',
      // Warn about unused variables
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Allow any types (common in Firebase Functions)
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
