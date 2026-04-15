import { describe, it, expect } from 'vitest';
import { isOnCurveAddress, isValidEmail, isValidSHA3Hash } from './validation';

const VALID_SOLANA = 'GhTppHPoSppnBurco1sPuYWyn3mejhsaRdRbt3dHtFyc';

describe('isOnCurveAddress', () => {
  it('accepts a well-formed on-curve Solana address', () => {
    expect(isOnCurveAddress(VALID_SOLANA)).toBe(true);
  });

  it('rejects a garbage string', () => {
    expect(isOnCurveAddress('not-a-real-address')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isOnCurveAddress('')).toBe(false);
  });

  it('rejects a too-short base58 string', () => {
    expect(isOnCurveAddress('abc')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('accepts a plain email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts an email with dots and plus', () => {
    expect(isValidEmail('a.b+tag@sub.example.co')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects missing domain tld', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });

  it('rejects whitespace', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidSHA3Hash', () => {
  const hex64 = 'a'.repeat(64);
  const hex128 = 'F'.repeat(128);

  it('accepts a 64-char hex string', () => {
    expect(isValidSHA3Hash(hex64)).toBe(true);
  });

  it('accepts a 128-char hex string (mixed case)', () => {
    expect(isValidSHA3Hash(hex128)).toBe(true);
  });

  it('rejects a non-hex character', () => {
    expect(isValidSHA3Hash('g'.repeat(64))).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(isValidSHA3Hash('a'.repeat(63))).toBe(false);
    expect(isValidSHA3Hash('a'.repeat(100))).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidSHA3Hash('')).toBe(false);
  });
});
