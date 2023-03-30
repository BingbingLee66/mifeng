module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  globals: {
    TMap: 'readonly',
    CKEDITOR: 'readonly',
    Aliplayer: true,
    AliyunUpload: true,
    AliPlayerComponent: 'readonly'
  },
  extends: ['plugin:vue/vue3-essential', '@vue/standard', 'plugin:prettier/recommended'],
  parserOptions: {
    requireConfigFile: false,
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['error', 'never'],
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
      'error',
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
    'array-callback-return': 2,
    eqeqeq: 2,
    'no-invalid-this': 0,
    'no-self-assign': 2,
    'guard-for-in': 0,
    'no-useless-escape': 1,
    'no-undef': 2,
    'no-prototype-builtins': 'off',
    camelcase: 'off',
    'jsx-quotes': ['error', 'prefer-double'],
    'arrow-spacing': 2,
    'arrow-parens': ['error', 'as-needed'],
    'prefer-destructuring': [
      'error',
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
