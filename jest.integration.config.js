/* eslint-disable */
module.exports = {
  collectCoverageFrom: [
    "**/*.integration.{ts, tsx}",
    // Non-library folders/files
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/dist/**",
    "!**/tmp/**",
    "!jest.integration.config.js",
    "!jest.config.js",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["lcov"],
  roots: ["src/test/integration"],
  setupFiles: [],
  setupFilesAfterEnv: ["jest-extended"],
  testMatch: ["**/*.integration.ts"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
};
