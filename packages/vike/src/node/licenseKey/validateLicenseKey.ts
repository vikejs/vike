export { validateLicenseKey }
export { getRootDomain }

import { createPublicKey, verify } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const PUBLIC_KEY_PEM = readFileSync(path.join(fileURLToPath(import.meta.url), '..', 'publicKey.pem'), 'utf8')

type ValidationResult = { valid: true; domains: string[] } | { valid: false; reason: 'malformed' | 'invalid_signature' }

function validateLicenseKey(licenseKey: string): ValidationResult {
  let combined: Buffer
  try {
    combined = Buffer.from(licenseKey, 'base64')
  } catch {
    return { valid: false, reason: 'malformed' }
  }
  // Ed25519 signatures are always 64 bytes; payload + space precede them
  const SIG_LENGTH = 64
  if (combined.length < SIG_LENGTH + 2) {
    // minimum: 1 domain char + space + 64 sig bytes
    return { valid: false, reason: 'malformed' }
  }
  const payloadBytes = combined.subarray(0, combined.length - SIG_LENGTH - 1)
  const spaceByte = combined[combined.length - SIG_LENGTH - 1]
  const sigBytes = combined.subarray(combined.length - SIG_LENGTH)
  if (spaceByte !== 0x20) return { valid: false, reason: 'malformed' }
  const payloadStr = payloadBytes.toString('utf8')
  const domains = payloadStr.split(',').filter(Boolean)
  if (domains.length === 0) return { valid: false, reason: 'malformed' }
  const isValid = verify(null, payloadBytes, createPublicKey(PUBLIC_KEY_PEM), sigBytes)
  if (!isValid) return { valid: false, reason: 'invalid_signature' }
  return { valid: true, domains }
}

function getRootDomain(hostname: string): string {
  const host = hostname.replace(/^https?:\/\//, '').split('/')[0]!
  const parts = host.split('.')
  return parts.length > 2 ? parts.slice(-2).join('.') : host
}
