const config = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|js)",
  ],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
}

export default config
