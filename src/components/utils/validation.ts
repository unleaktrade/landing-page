/*
 * Solana address validation without @solana/web3.js.
 *
 * `new PublicKey(addr)` + `PublicKey.isOnCurve()` pulled the whole web3.js SDK
 * (and its BN / buffer / noble deps) into the landing page's main bundle just
 * to validate a form field. This is a 1:1 port of exactly what those two calls
 * do: base58-decode (base-x semantics) to exactly 32 bytes, then RFC 8032 point
 * decompression as in @noble/curves `ed25519.ExtendedPoint.fromHex` (zip215 =
 * false). validation.test.ts checks parity against web3.js itself.
 */

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/** base58 decode (Bitcoin alphabet); returns null on an invalid character. */
export function base58Decode(input: string): Uint8Array | null {
  let value = 0n;
  for (const ch of input) {
    const digit = BASE58_ALPHABET.indexOf(ch);
    if (digit < 0) return null;
    value = value * 58n + BigInt(digit);
  }
  let leadingZeros = 0;
  while (leadingZeros < input.length && input[leadingZeros] === '1') leadingZeros++;
  const bytes: number[] = [];
  while (value > 0n) {
    bytes.push(Number(value & 0xffn));
    value >>= 8n;
  }
  const out = new Uint8Array(leadingZeros + bytes.length);
  for (let i = 0; i < bytes.length; i++) out[out.length - 1 - i] = bytes[i];
  return out;
}

const P = 2n ** 255n - 19n;
// d = -121665 / 121666 mod p
const D = 37095705934669439343138083508754565189542113879843219016388785533085940283555n;

const mod = (a: bigint) => {
  const r = a % P;
  return r >= 0n ? r : r + P;
};

function powMod(base: bigint, exp: bigint): bigint {
  let result = 1n;
  let b = mod(base);
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % P;
    b = (b * b) % P;
    e >>= 1n;
  }
  return result;
}

/** True when 32 bytes decode to a point on the ed25519 curve (RFC 8032). */
export function isOnCurveBytes(bytes: Uint8Array): boolean {
  if (bytes.length !== 32) return false;
  const signBit = (bytes[31] & 0x80) !== 0;
  let y = 0n;
  for (let i = 31; i >= 0; i--) y = (y << 8n) | BigInt(i === 31 ? bytes[i] & 0x7f : bytes[i]);
  if (y >= P) return false;
  const y2 = mod(y * y);
  const u = mod(y2 - 1n); // y^2 - 1
  const v = mod(D * y2 + 1n); // d y^2 + 1, never 0 mod p
  // x^2 = u / v has a root iff u*v is zero or a quadratic residue (Euler).
  const uv = mod(u * v);
  if (uv === 0n) return !signBit; // x = 0: the sign bit must be clear
  return powMod(uv, (P - 1n) / 2n) === 1n;
}

export function isOnCurveAddress(addr: string): boolean {
  const bytes = base58Decode(addr);
  return bytes !== null && bytes.length === 32 && isOnCurveBytes(bytes);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidSHA3Hash(hash: string): boolean {
  // SHA3-256 produces a 64-character hexadecimal string
  // SHA3-512 produces a 128-character hexadecimal string
  // We'll accept both common formats
  const sha3Regex = /^[a-fA-F0-9]{64}$|^[a-fA-F0-9]{128}$/;
  return sha3Regex.test(hash);
}
