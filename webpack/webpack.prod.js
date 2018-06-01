let client = process.env.client || 'client-project';
if (process.env.c) {
  client = process.env.c;
}

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FastUglifyJsPlugin = require('fast-uglifyjs-plugin');
const webpackDefault = require('./webpack.default.js');

const fse = require('fs-extra');
setTimeout(() => {
  fse.copy(
    path.resolve(__dirname, `../${client}/assets`),
    path.resolve(__dirname, `../public/${client}/assets`)
  );
}, 1000);

module.exports = merge(webpackDefault, {
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].chunk.[chunkhash].js',
    publicPath: ''
  },
  // devtool: 'source-map',
  plugins: [
    new FastUglifyJsPlugin({
      compress: {
        warnings: false
      },
      // debug 设为 true 可输出详细缓存使用信息:
      debug: true,
      // 默认开启缓存，提高uglify效率，关闭请使用:
      cache: true,
      // 默认缓存路径为项目根目录，手动配置请使用:
      cacheFolder: path.resolve(__dirname, '../.webpack_cache'),
      // 工作进程数，默认os.cpus().length
      workerNum: 2
    }),
    new CleanWebpackPlugin(['*'], {
      root: path.resolve(__dirname, `../public/${client}`),
      exclude: ['video'],
      verbose: true,
      dry: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
