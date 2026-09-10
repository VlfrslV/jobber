const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  passWithNoTests: true,
  // NestJS v12+ packages ship ESM; allow transforming them if present.
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@nestjs/config|@nestjs/passport|@nestjs/jwt))',
  ],
};
