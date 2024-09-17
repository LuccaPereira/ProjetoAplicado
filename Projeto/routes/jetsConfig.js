module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  verbose: true,
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Usa babel-jest para transpilar arquivos JS/TS
  },
};
