module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    // "macros"
  ],
  env: {
    development: {
      // plugins: ["react-hot-loader/babel"]
    }
    //  'test': {
    //    'plugins': [
    //      '@babel/plugin-transform-modules-commonjs',
    //      '@babel/plugin-syntax-dynamic-import'
    //    ]
    //  }
  }
}
