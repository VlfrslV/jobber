const { createLibConfig } = require('@jobber/webpack-config/lib');

module.exports = createLibConfig({
  dirname: __dirname,
  name: 'prisma',
});
