const webpack = require('webpack')
const nodemon = require('nodemon')
const rimraf = require('rimraf')
const path = require('path')
const webpackConfig = require('../webpack.config.js')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const chalk = require('chalk')

const app = express();

const getPortNum = (val, defPort = 3000) => !Number.isNaN(Number(val)) ? Number(val) : defPort
const prependSlash = str => str.startsWith('/') ? str : `/${str}`;
const appendSlash = str => str.endsWith('/') ? str : `${str}/`;
const cutLastSlash = str => str.endsWith('/') ? str.slice(0, -1) : str;

const WEBPACK_PORT = getPortNum(process.env.WEBPACK_PORT, getPortNum(process.env.PORT) + 1);

const logMessage = (message, level = 'info') => {
  const color = level === 'error' ? 'red' : level === 'warning' ? 'yellow' : 'white';
  console.log(`[${new Date().toISOString()}]`, chalk[color](message));
};

const compilerPromise = (name, compiler) => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      logMessage(`[${name}] Compiling `);
    });
    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};

const distPath = path.resolve('./dist')

const start = async () => {
  rimraf.sync(distPath);

  const [clientConfig, serverConfig] = webpackConfig;
  clientConfig.entry.bundle = [
    `webpack-hot-middleware/client?path=http://localhost:${WEBPACK_PORT}/__webpack_hmr`,
    ...clientConfig.entry.bundle,
  ];

  //clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  //clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';

  const publicPath = clientConfig.output.publicPath;

  clientConfig.output.publicPath = `http://localhost:${WEBPACK_PORT}${appendSlash(prependSlash(publicPath))}`;
  serverConfig.output.publicPath = clientConfig.output.publicPath;

  const multiCompiler = webpack([clientConfig, serverConfig]);

  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client');
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server');

  const clientPromise = compilerPromise('client', clientCompiler);
  const serverPromise = compilerPromise('server', serverCompiler);

  const watchOptions = {
    // poll: true,
    ignored: /node_modules/,
    stats: clientConfig.stats,
  };

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    return next();
  });
  app.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: cutLastSlash(prependSlash(publicPath)),
      stats: clientConfig.stats,
      watchOptions,
    })
  );

  app.use(webpackHotMiddleware(clientCompiler));

  app.use(cutLastSlash(prependSlash(publicPath)), express.static(distPath));

  app.listen(WEBPACK_PORT, 'localhost');

  serverCompiler.watch(watchOptions, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats));
      return;
    }

    if (error) {
      logMessage(error, 'error');
    }

    if (stats.hasErrors()) {
      const info = stats.toJson();
      const errors = info.errors[0].split('\n');
      logMessage(errors[0], 'error');
      logMessage(errors[1], 'error');
      logMessage(errors[2], 'error');
    }
  });

  // wait until client and server is compiled
  try {
    await serverPromise;
    await clientPromise;
  } catch (error) {
    logMessage(error, 'error');
  }

  const script = nodemon({
    script: `${distPath}/server.js`,
    ignore: ['src', 'scripts', 'config', './*.*', 'build/client'],
  });

  script.on('restart', () => {
    logMessage('Server side app has been restarted.', 'warning');
  });

  script.on('quit', () => {
    console.log('Process ended');
    process.exit();
  });

  script.on('error', () => {
    logMessage('An error occured. Exiting', 'error');
    process.exit(1);
  });
};

start();
