module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**',
        '!**/test/**'
    ],
    coverageDirectory: 'coverage',
    testEnviroment: 'node',
    present: '@shelf/jest-mongodb',
    transform: { '.+\\.ts$': 'ts-jest'},  
    moduleNameMapper: { 
        '@/(.*)': '<rootDir>/src/$1'
    }
}