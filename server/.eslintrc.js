module.exports = {
  env: {
    node: true,
    amd: true,
    jest: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb/base',
    'prettier',
    'plugin:import/errors',
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.ts'] },
    },
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'prettier/prettier': 'error',
    'consistent-return': 'off',
    camelcase: 'off',
    'no-console': 'off',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['src/test/**'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
};
