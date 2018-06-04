const client = process.env.client || 'client-project';
if (process.env.c) {
  client = process.env.c;
}
const fse = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FastUglifyJsPlugin = require('fast-uglifyjs-plugin');
const autoprefixer = require('autoprefixer');

const dllManifestPath = path.join(
  __dirname,
  '../',
  `/${client}/assets/dll/dll-manifest.json`
);
const isHaveDll = fse.existsSync(dllManifestPath);
const dllPlugins = isHaveDll
  ? [
      new webpack.DllReferencePlugin({
        manifest: dllManifestPath
      })
    ]
  : [];
const cssLoaders = [
  {
    loader: require.resolve('style-loader'),
    options: {
      sourceMap: true
    }
  },
  {
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: true
    }
  },
  {
    loader: require.resolve('postcss-loader'),
    options: {
      // sourceMap: 'inline',
      sourceMap: true,
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9' // React doesn't support IE8 anyway
          ],
          flexbox: 'no-2009'
        })
      ]
    }
  }
];

module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, `../${client}/index.js`)
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, `../public/${client}`)
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '~': path.resolve(__dirname, `../${client}`)
    }
  },
  plugins: [
    // 全局变量
    new webpack.ProvidePlugin({
      $: 'jquery',
      _: 'lodash'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../${client}/index.html`),
      minify: {
        removeAttributeQuotes: true // 移除属性的引号
      }
    }),
    new webpack.HashedModuleIdsPlugin(),
    ...dllPlugins
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        exclude: function(path) {
          // 路径中含有 node_modules 的就不去解析。
          var isNpmModule =
            !!path.match(/node_modules/) || !!path.match(/assets/);
          return isNpmModule;
        },
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
            'stage-0',
            [
              'env',
              {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 7'],
                  node: 'current',
                  useBuiltIns: true
                }
              }
            ]
          ],
          plugins: [
            'transform-class-properties',
            'transform-async-to-module-method',
            'transform-runtime',
            'react-hot-loader/babel'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [...cssLoaders]
      },
      {
        test: /\.styl$/,
        use: [
          ...cssLoaders,
          {
            loader: 'stylus-loader',
            options: {
              strictMath: true,
              noIeCompat: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          ...cssLoaders,
          {
            loader: 'less-loader',
            options: {
              strictMath: true,
              noIeCompat: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|pdf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      }
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  stats: 'errors-only' //minimal
};
