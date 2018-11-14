module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: "./coverage/",
  collectCoverageFrom: [
    "index.ts",
    "src/**/*.ts", 
    "src/**/*.js", 
    "!__tests__/**/*.ts",
    "!__tests__/**/*.js"
  ],
  collectCoverage: true
};