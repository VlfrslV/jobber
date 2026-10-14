const { merge } = require('webpack-merge');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const baseConfig = {
  output: {
    clean: true,
    libraryTarget: 'commonjs2',
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
};

function createLibPlugin(overrides = {}) {
  return new NxAppWebpackPlugin({
    target: 'node',
    compiler: 'tsc',
    main: './src/index.ts',
    tsConfig: './tsconfig.lib.json',
    optimization: false,
    outputHashing: 'none',
    generatePackageJson: false,
    sourceMap: true,
    ...overrides,
  });
}

function createLibConfig({ dirname, name, plugin = {} }) {
  return merge(baseConfig, {
    output: {
      path: join(dirname, `../../dist/libs/${name}`),
    },
    plugins: [createLibPlugin(plugin)],
  });
}

module.exports = { createLibConfig, createLibPlugin, baseConfig };
