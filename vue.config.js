const webpack = require('webpack')
const npmCfg = require('./package.json')

const banner = [
  'vue-picflow v' + npmCfg.version,
  '(c) ' + new Date().getFullYear() + ' ' + npmCfg.author,
  npmCfg.homepage
].join('\n')

module.exports = {
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    plugins: [new webpack.BannerPlugin(banner)]
  },
  css: {
    extract: true,
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            viewportWidth: 375
          })
        ]
      }
    }
  }
}
