let client = process.env.client || 'client-project';
if (process.env.c) {
  client = process.env.c;
}

function host() {
  const interfaces = require('os').networkInterfaces();
  for (let devName in interfaces) {
    const face = interfaces[devName];
    for (let i = 0; i < face.length; i++) {
      const alias = face[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

const nowHost = host();

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const webpackDefault = require('./webpack.default.js');
const package = require('../package.json');
const clientPath = path.resolve(__dirname, `../${client}/`);
const port = process.env.port || package.port;
// console.log(`{client:${client}, path:${clientPath}}`)

const ignoreHost = [
  'http://0.0.0.0:' + port,
  'http://127.0.0.1:' + port,
  'http://localhost:' + port
];
if (package.proxy['/']) {
  ignoreHost.map(v => {
    if (package.proxy['/'].target === v) {
      // console.log('约定，当 proxy 的端口和 port 一致时，不启用代理')
      package.proxy['/'] = {};
    }
  });
}

console.log(clientPath);
console.log(`http://${nowHost}:${port}/`);

module.exports = merge(webpackDefault, {
  // devtool: 'inline-source-map',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: nowHost,
    port: port,
    proxy: {
      ...package.proxy
    },
    compress: false,
    quiet: false, //控制台中输出打包的信息
    hot: true, //开启热点
    inline: true, //开启页面自动刷新
    stats: 'errors-only',
    noInfo: true,
    contentBase: clientPath
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  stats: 'errors-only'
});
