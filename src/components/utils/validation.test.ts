import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import {
  base58Decode,
  isOnCurveAddress,
  isOnCurveBytes,
  isValidEmail,
  isValidSHA3Hash,
} from './validation';

// The reference implementation this module replaces (web3.js is a devDependency
// now, used only to prove parity here).
function web3IsOnCurveAddress(addr: string): boolean {
  try {
    const pk = new PublicKey(addr);
    return PublicKey.isOnCurve(pk.toBytes());
  } catch {
    return false;
  }
}

// Deterministic PRNG so a parity failure is reproducible.
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

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

describe('isOnCurveAddress parity with @solana/web3.js', () => {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  it('matches web3.js on 2,000 random 32-byte keys', () => {
    const rnd = prng(42);
    let onCurve = 0;
    for (let n = 0; n < 2000; n++) {
      const bytes = Uint8Array.from({ length: 32 }, () => Math.floor(rnd() * 256));
      const addr = new PublicKey(bytes).toBase58();
      const expected = web3IsOnCurveAddress(addr);
      expect(isOnCurveAddress(addr), addr).toBe(expected);
      if (expected) onCurve++;
    }
    // about half of random y values decompress: both branches are exercised
    expect(onCurve).toBeGreaterThan(700);
    expect(onCurve).toBeLessThan(1300);
  });

  it('matches web3.js on random base58 strings of every plausible length', () => {
    const rnd = prng(7);
    for (let n = 0; n < 1000; n++) {
      const len = Math.floor(rnd() * 50);
      const addr = Array.from({ length: len }, () => ALPHABET[Math.floor(rnd() * 58)]).join('');
      expect(isOnCurveAddress(addr), addr).toBe(web3IsOnCurveAddress(addr));
    }
  });

  it('matches web3.js on the RFC 8032 edge cases', () => {
    const P = 2n ** 255n - 19n;
    const le = (v: bigint, sign = false) => {
      const b = new Uint8Array(32);
      for (let i = 0; i < 32; i++) b[i] = Number((v >> BigInt(8 * i)) & 0xffn);
      if (sign) b[31] |= 0x80;
      return b;
    };
    const cases = [
      le(0n),
      le(1n), // identity point, x = 0
      le(1n, true), // x = 0 with the sign bit set: rejected
      le(P - 1n), // y = -1, x = 0
      le(P - 1n, true),
      le(P), // y = p: out of range under RFC 8032
      le(P + 1n),
      le(2n ** 255n - 1n),
      new Uint8Array(32).fill(0xff),
    ];
    for (const bytes of cases) {
      const addr = new PublicKey(bytes).toBase58();
      expect(isOnCurveAddress(addr), addr).toBe(web3IsOnCurveAddress(addr));
      expect(isOnCurveBytes(bytes)).toBe(web3IsOnCurveAddress(addr));
    }
  });

  it('rejects non-base58 characters and wrong byte lengths', () => {
    expect(base58Decode('0OIl')).toBeNull();
    expect(base58Decode('11')).toEqual(new Uint8Array([0, 0]));
    expect(isOnCurveBytes(new Uint8Array(31))).toBe(false);
    expect(isOnCurveAddress('1'.repeat(33))).toBe(web3IsOnCurveAddress('1'.repeat(33)));
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
