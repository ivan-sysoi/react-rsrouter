const path = require('path')
const webpack = require('webpack')

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
    'react-rsrouter$': path.resolve(__dirname, '../../packages/react-rsrouter'),

    // webpack issue: https://github.com/webpack/webpack/issues/2134
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    redux: path.resolve(__dirname, 'node_modules/redux'),
    'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
    'react-saga': path.resolve(__dirname, 'node_modules/react-saga'),
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
    plugins: [new webpack.HotModuleReplacementPlugin()],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  {
    name: 'server',
    target: 'node',
    mode: process.env.NODE_ENV,
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src/server.tsx')],
    module: {
      rules: loaders,
    },
    resolve,
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
]
