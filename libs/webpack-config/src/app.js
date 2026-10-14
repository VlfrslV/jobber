const { merge } = require('webpack-merge');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const baseConfig = {
  output: {
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
};

function createAppPlugin(overrides = {}) {
  return new NxAppWebpackPlugin({
    target: 'node',
    compiler: 'tsc',
    main: './src/main.ts',
    tsConfig: './tsconfig.app.json',
    assets: ['./src/assets'],
    optimization: false,
    outputHashing: 'none',
    generatePackageJson: true,
    sourceMap: true,
    ...overrides,
  });
}

function createAppConfig({ dirname, name, plugin = {} }) {
  return merge(baseConfig, {
    output: {
      path: join(dirname, `../../dist/apps/${name}`),
    },
    plugins: [createAppPlugin(plugin)],
  });
}

module.exports = { createAppConfig, createAppPlugin, baseConfig };
