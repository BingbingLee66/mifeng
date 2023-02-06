module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: true
      },
      'ant-design-vue'
    ],
    [
      'import',
      {
        libraryName: 'antd',
        customName: name =>
          `ant-design-vue/es/${name.replace(
            /[A-Z]/g,
            (match, index) => (index === 0 ? '' : '-') + match.toLowerCase()
          )}`,
        style: true
      },
      'antd'
    ]
  ]
}
