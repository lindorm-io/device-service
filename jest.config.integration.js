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
  globalSetup: "./jest.global.setup.js",
  roots: ["src"],
  setupFiles: [],
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
  testMatch: ["**/*.integration.ts"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
};
