require("@testing-library/jest-dom");

// Mock import.meta.env for Vite environment variables
globalThis.import_meta_env = {
  VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || "",
  MODE: "test",
  DEV: false,
  PROD: false,
  SSR: false,
};

// Polyfill TextEncoder/TextDecoder for React Router
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill structuredClone for Chakra UI
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array)
      return obj.map((item) => global.structuredClone(item));
    if (obj instanceof Object) {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = global.structuredClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  };
}

// Mock window.matchMedia for Chakra UI
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
