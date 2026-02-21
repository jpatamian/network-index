module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/app/frontend"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "\\.(svg|png|jpg|jpeg|gif)$": "<rootDir>/jest.fileMock.cjs",
    "^@/(.*)$": "<rootDir>/app/frontend/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest"],
    "^.+\\.(js|jsx)$": ["babel-jest"],
  },
  collectCoverageFrom: [
    "app/frontend/**/*.{ts,tsx}",
    "!app/frontend/**/*.d.ts",
    "!app/frontend/**/index.ts",
  ],
};
