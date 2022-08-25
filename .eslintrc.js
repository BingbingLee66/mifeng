module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended','prettier'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //// 禁止在语句末尾使用分号
    'semi': ['error', 'never'],
    'no-dupe-keys': 2,
    'key-spacing': ['error', { beforeColon: false }],
    'quote-props': ['error', 'as-needed'],
    'object-shorthand': 2,
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    'no-unused-vars': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false
      }
    ],
    'no-var': 0,
    'no-param-reassign': 0,
    'no-irregular-whitespace': 0,
    'no-useless-catch': 1,
    'array-callback-return': 1,
   // 要求使用 === 和 !== (eqeqeq)
    'eqeqeq': 2,
    'no-invalid-this': 0,
    'no-self-assign': 2,
    'guard-for-in': 0,
    'no-useless-escape': 1,
    'no-undef': 2,
    'no-prototype-builtins': 'off',
    'jsx-quotes': ['error', 'prefer-double'],
    // quotes: ['error', 'single'],
    // 强制使用一致的缩进
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'arrow-spacing': 2,
    'arrow-parens': ['error', 'as-needed'],
    'prefer-destructuring': [
      'warn',
      {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: true,
          object: false
        }
      }
    ],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-newline': ['error', { multiline: true }],
    'vue/multi-word-component-names': 0,
    'no-dupe-args': 2,
    'prefer-rest-params': 2,
    'comma-spacing': 2,
    'computed-property-spacing': 2,
    'func-call-spacing': 2,
    'keyword-spacing': 2,
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-in-parens': 2,
    'space-infix-ops': 2,
    'spaced-comment': 2
  }
}
