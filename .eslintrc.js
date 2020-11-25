module.exports = {
  env: {
    commonjs: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['plugin:prettier/recommended'],
  rules: {
    semi: ['error', 'never', {beforeStatementContinuationChars: 'always'}],
  },
}
