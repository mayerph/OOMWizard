module.exports = {
    roots: ['<rootDir>/src/'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: false,
    testMatch: ['**/server.spec.ts'],
    reporters: [
      'default',
      ['jest-html-reporters', {
        publicPath: './docs',
        filename: 'test-server-report.html'
      }]
    ]
  }
  