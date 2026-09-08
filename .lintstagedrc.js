module.exports = {
  '*.ts': (files) => `nx affected -t lint --fix --files=${files.join(',')}`,
  '*.{ts,js,json,md,yml,yaml,css,html,graphql}': (files) =>
    `nx format:write --files=${files.join(',')}`,
};
