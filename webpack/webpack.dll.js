let client = process.env.client || 'client-project';
if (process.env.c) {
  client = process.env.c;
}
const _ = require('lodash');
const fse = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const package = require('../package.json');
const FastUglifyJsPlugin = require('fast-uglifyjs-plugin');
const dll = package.dll;
const dllAny = dll.any || [];
const dllClient = dll[client] || [];
const dllArray = _.uniq([...dllAny, ...dllClient]);
console.log('packing dll: ', dllArray);
module.exports = {
  mode: 'production',
  entry: {
    dll: dllArray
  },
  output: {
    path: path.resolve(__dirname, `../${client}/assets/dll`),
    filename: '[name].js',
    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendor_library`
     */
    library: '[name]_library'
  },
  resolve: {
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        include: [
          // 这里编写需要预先 babel 的项目
          // /node_modules\/react-native-/,
          // /node_modules\/react-navigation/,
        ],
        loader: require.resolve('babel-loader'),
        options: {
          compact: true,
        },
      },
    ],
  },
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
    new webpack.DllPlugin({
      /**
       * path
       * 定义 manifest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      path: path.resolve(
        __dirname,
        `../${client}/assets/dll/[name]-manifest.json`
      ),
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可。
       */
      name: '[name]_library'
    })
  ]
};
