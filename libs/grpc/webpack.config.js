const { createLibConfig } = require('@jobber/webpack-config/lib');

module.exports = createLibConfig({
  dirname: __dirname,
  name: 'grpc',
  plugin: {
    assets: [
      {
        glob: '**/*.proto',
        input: './proto',
        output: 'proto',
      },
    ],
  },
});
