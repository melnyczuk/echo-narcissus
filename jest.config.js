// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// eslint-disable-next-line no-undef
module.exports = {
  clearMocks: true,
	moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  preset:'ts-jest',
	roots: ['<rootDir>/src'],
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
	testPathIgnorePatterns: ['/node_modules/'],
};
