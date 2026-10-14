const { createAppConfig } = require('@jobber/webpack-config/app');

module.exports = createAppConfig({
  dirname: __dirname,
  name: 'executor',
});
