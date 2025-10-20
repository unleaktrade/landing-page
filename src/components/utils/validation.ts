import { PublicKey } from '@solana/web3.js@1';

export function isOnCurveAddress(addr: string): boolean {
  try {
    const pk = new PublicKey(addr);
    return PublicKey.isOnCurve(pk.toBytes());
  } catch {
    return false;
  }
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
