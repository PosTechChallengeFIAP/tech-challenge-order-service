export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec).ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    clearMocks: true,
  };