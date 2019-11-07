module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
  coverageDirectory: "./coverage",
};
