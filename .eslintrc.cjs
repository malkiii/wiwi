/** @type {import("eslint").Linter.Config} */
const config = {
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': true,
  },
  'plugins': ['@typescript-eslint', 'drizzle'],
  'extends': ['next/core-web-vitals'],
  'rules': {
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        'prefer': 'type-imports',
        'fixStyle': 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'argsIgnorePattern': '^_',
      },
    ],
    '@typescript-eslint/require-await': 'off',
    'drizzle/enforce-delete-with-where': [
      'error',
      {
        'drizzleObjectName': ['db', 'ctx.db'],
      },
    ],
    'drizzle/enforce-update-with-where': [
      'error',
      {
        'drizzleObjectName': ['db', 'ctx.db'],
      },
    ],
  },
};
module.exports = config;
