module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    testTimeout: 120000  // 2 minutes for all tests
}