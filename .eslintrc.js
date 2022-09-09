module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  /* 指定如何解析语法 */
  parser: 'vue-eslint-parser',
  extends: ['plugin:vue/recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
  globals: {
    CKEDITOR: 'readonly',
    ClipboardJS: 'readonly',
    TMap: 'readonly',
    Aliplayer: 'readonly',
    AliPlayerComponent: 'readonly'
  },

  // add your custom rules here
  // it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['error', 'never'], // 禁止在语句末尾使用分号
    eqeqeq: 2, // 要求使用 === 和 !== (eqeqeq)
    quotes: ['error', 'single'], // 强制使用一致的反勾号、双引号或单引号
    indent: ['error', 2, { SwitchCase: 1 }], // 强制使用一致的缩进
    'no-var': 2, // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
    'no-use-before-define': 1, // 禁止在 函数/类/变量 定义之前使用它们
    'prefer-const': 2, // 此规则旨在标记使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    'no-irregular-whitespace': 1, // 禁止不规则的空白
    // vue (https://eslint.vuejs.org/rules)
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效
    // '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
    // '@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
    // '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
    // '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
    // '@typescript-eslint/ban-ts-ignore': 'off', // 禁止使用 @ts-ignore
    // '@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
    // '@typescript-eslint/explicit-function-return-type': 'off', // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    // '@typescript-eslint/no-var-requires': 'off', // 不允许在 import 语句中使用 require 语句
    // '@typescript-eslint/no-empty-function': 'off', // 禁止空函数
    // '@typescript-eslint/no-use-before-define': 'off', // 禁止在变量定义之前使用它们
    // '@typescript-eslint/ban-ts-comment': 'off', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    // '@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)
    // '@typescript-eslint/explicit-module-boundary-types': 'off', // 要求导出函数和类的公共类方法的显式返回和参数类型
    'no-dupe-keys': 2, // 禁止在对象字面量中出现重复的键
    'key-spacing': ['error', { beforeColon: false }], // 禁止在对象字面量的键和冒号之间存在空格
    'quote-props': ['error', 'as-needed'], // 当没有严格要求时，禁止对象字面量属性名称使用引号
    'object-shorthand': 2, // 要求对象字面量简写语法
    'no-empty': ['error', { allowEmptyCatch: true }], // 禁止空块语句
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }], // 禁止未使用过的变量
    'no-param-reassign': 1, // 禁止对函数参数再赋值
    'no-useless-catch': 1, // 禁止不必要的 catch 子句
    'array-callback-return': 1, // 强制数组方法的回调函数中有 return 语句
    'no-invalid-this': 0, // 禁止 this 关键字在类或类对象之外出现
    'no-self-assign': 2, // 禁止自身赋值
    'guard-for-in': 0, // 需要约束 for-in
    'no-useless-escape': 1, // 禁用不必要的转义
    'jsx-quotes': ['error', 'prefer-double'], // 强制在 JSX 属性中使用一致的单引号或双引号
    'arrow-spacing': 2, // 要求箭头函数的箭头之前或之后有空格
    'arrow-parens': ['error', 'as-needed'], // 要求箭头函数的参数使用圆括号;在可以省略括号的地方强制不使用括号
    'object-curly-spacing': ['error', 'always'], // 强制在花括号中使用一致的空格
    'array-bracket-newline': ['error', { multiline: true }], // 强制换行后打开和关闭数组括号
    'vue/multi-word-component-names': 0, // vue组件名称用-连接
    'no-dupe-args': 2, // 禁止在 function 定义中出现重复的参数
    'prefer-rest-params': 2, // 建议使用剩余参数代替 arguments
    'comma-spacing': 2, // 强制在逗号周围使用空格
    'computed-property-spacing': 2,
    'func-call-spacing': 2, // 禁止或强制在计算属性中使用空格
    'keyword-spacing': 2, // 强制关键字周围空格的一致性
    'space-in-parens': 2, // 禁止或强制圆括号内的空格
    'space-infix-ops': 2, // 要求中缀操作符周围有空格
    'spaced-comment': 2, // 要求或禁止在注释前有空白
    'space-before-function-paren': [
      // 要求或禁止函数圆括号之前有一个空格
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'prefer-destructuring': [
      // 优先使用数组和对象解构
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
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'accessor-pairs': 2,
    'block-spacing': [2, 'always'],
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    camelcase: [
      0,
      {
        properties: 'always'
      }
    ],
    'comma-dangle': [0, 'never'],
    'comma-style': [2, 'last'],
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    'dot-location': [2, 'property'],
    'eol-last': 2,
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'handle-callback-err': [2, '^(err|error)$'],

    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-caller': 2,
    'no-class-assign': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-control-regex': 0,
    'no-delete-var': 2,
    'no-dupe-class-members': 2,
    'no-duplicate-case': 2,

    'no-empty-character-class': 2,
    'no-empty-pattern': 2,
    'no-eval': 2,
    'no-ex-assign': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implied-eval': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false
      }
    ],
    'no-lone-blocks': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-spaces': 2,
    'no-multi-str': 2,

    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-path-concat': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-return-assign': [2, 'except-parens'],
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false
      }
    ],
    'no-unreachable': 2,
    'no-unsafe-finally': 2,

    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'one-var': [
      2,
      {
        initialized: 'never'
      }
    ],
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    'padded-blocks': [2, 'never'],

    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    'space-before-blocks': [2, 'always']
  }
}
