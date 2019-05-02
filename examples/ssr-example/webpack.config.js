const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')

const loaders = [
  {
    test: /\.(jsx?)$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.(tsx?)$/,
    exclude: /node_modules/,
    loader: 'ts-loader',
  },
]

const resolve = {
  extensions: ['.ts', '.tsx', '.js'],
  mainFields: ['browser', 'module', 'main'],
  modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  alias: {
    'react-rsrouter$': path.resolve(__dirname, '../..'),

    // webpack issue: https://github.com/webpack/webpack/issues/2134
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    redux: path.resolve(__dirname, 'node_modules/redux'),
    'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
    'react-saga': path.resolve(__dirname, 'node_modules/react-saga'),
    'react-hot-loader': path.resolve(__dirname, 'node_modules/react-hot-loader'),
  },
}

module.exports = [
  {
    name: 'client',
    target: 'web',
    mode: process.env.NODE_ENV,
    entry: {
      bundle: ['@babel/polyfill', path.resolve(__dirname, 'src/client/index.tsx')],
    },
    module: {
      rules: [{ loader: 'react-hot-loader/webpack' }, ...loaders],
    },
    resolve,
    output: {
      filename: 'client.js',
      publicPath: 'static/',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new ManifestPlugin({ fileName: path.resolve(__dirname, 'dist', 'manifest.json'), writeToFileEmit: true }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        isBrowser: true,
      }),
    ],
  },
  {
    name: 'server',
    target: 'node',
    mode: process.env.NODE_ENV,
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src/server.tsx')],
    module: {
      rules: loaders,
    },
    plugins: [
      new webpack.DefinePlugin({
        isBrowser: false,
        PORT: process.env.PORT,
      }),
    ],
    resolve,
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
]
