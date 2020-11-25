module.exports = {
  env: {
    commonjs: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'never', {beforeStatementContinuationChars: 'always'}],
  },
}
