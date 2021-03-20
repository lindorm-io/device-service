/* eslint-disable */
module.exports = {
  collectCoverageFrom: [
    "**/*.test.{ts, tsx}",
    // Non-library folders/files
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/dist/**",
    "!**/tmp/**",
    "!jest.integration.js",
    "!jest.config.js",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["lcov"],
  roots: ["src"],
  setupFiles: [],
  setupFilesAfterEnv: ["jest-extended"],
  testMatch: ["**/*.test.ts"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
};
