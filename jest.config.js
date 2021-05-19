// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// eslint-disable-next-line no-undef
module.exports = {
  clearMocks: true,
	moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  preset:'ts-jest',
	roots: ['<rootDir>/src'],
  testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/'],
};
