const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin({
  outputFormat: 'human'
})
// devServer port
const port = 9528

const configureWebpack = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      vue$: 'vue/dist/vue.esm-bundler.js'
    }
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true
  }
}

module.exports = defineConfig({
  transpileDependencies: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }
      // mock.
      require('./mock/mock-server.js')(devServer)

      return middlewares
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize
          'primary-color': '#F4C820', // 全局主色
          'link-color': '#F4C820', // 链接色
          'success-color': '#52c41a', // 成功色
          'warning-color': '#faad14', // 警告色
          'error-color': '#f5222d', // 错误色
          'font-size-base': '14px', // 主字号
          'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
          'text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
          'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
          'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
          'border-radius-base': '4px', // 组件/浮层圆角
          'border-color-base': '#d9d9d9', // 边框色
          'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)' // 浮层阴影
        },
        javascriptEnabled: true
      },
      sass: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixin.scss";
        `
      }
    }
  },
  configureWebpack: process.env.VUE_APP_BUILD_ENV === 'speed' ? smp.wrap(configureWebpack) : configureWebpack,
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugin('html').tap(args => {
      args[0].title = '秘锋商协会数字管理系统'
      return args
    })
    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'commons',
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
})
