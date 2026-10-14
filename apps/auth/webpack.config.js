const { createAppConfig } = require('@jobber/webpack-config/app');

module.exports = createAppConfig({
  dirname: __dirname,
  name: 'auth',
  plugin: {
    // Keep Prisma (and other node_modules) out of the bundle — bundling
    // breaks Prisma Client class inheritance at runtime.
    externalDependencies: 'all',
  },
});
