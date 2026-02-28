import "dotenv/config";
import '@testing-library/jest-dom/vitest';

process.env.JWT_SECRET = process.env.JWT_SECRET || "default-test-secret";