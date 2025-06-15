export default {
    // Config jest test
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: ["<rootDir>/src/tests/**/*.test.tsx"]
};
