module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      lines: 80,
      functions: 80,
    },
  },
  collectCoverageFrom: [
    '**/src/**/*.{js,ts}',
  ],
  moduleDirectories: ['node_modules', 'src'],
};
