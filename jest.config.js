module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      lines: 60,
      functions: 60,
    },
  },
  collectCoverageFrom: [
    '**/src/**/*.{js,ts}',
    '!**/src/DiscordBot.ts',
    '!**/src/events/**',
    '!**/src/commands/**',
  ],
  moduleDirectories: ['node_modules', 'src', 'tests'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
