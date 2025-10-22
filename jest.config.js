module.exports = {
  preset: 'ts-jest', // the preset to use for TypeScript
  testEnvironment: 'node',// the test environment to use
  testMatch: ['**/test/**/*.test.ts'], // the path to test files
  moduleDirectories: ['node_modules', 'src'], // the directories to search for modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',// the alias for the src directory
  },
};
