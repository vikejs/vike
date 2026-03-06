export { validateLicenseKey }
export { getRootDomain }

import { createPublicKey, verify } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const PUBLIC_KEY_PEM = readFileSync(path.join(fileURLToPath(import.meta.url), '..', 'publicKey.pem'), 'utf8')

type ValidationResult = { valid: true; domains: string[] } | { valid: false; reason: 'malformed' | 'invalid_signature' }

function validateLicenseKey(licenseKey: string): ValidationResult {
  const parts = licenseKey.split('.')
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, reason: 'malformed' }
  }
  const [encodedPayload, encodedSignature] = parts as [string, string]
  let domains: unknown
  try {
    domains = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
  } catch {
    return { valid: false, reason: 'malformed' }
  }
  if (!Array.isArray(domains) || !domains.every((d) => typeof d === 'string')) {
    return { valid: false, reason: 'malformed' }
  }
  const payload = Buffer.from(encodedPayload, 'base64url')
  const signature = Buffer.from(encodedSignature, 'base64url')
  const isValid = verify(null, payload, createPublicKey(PUBLIC_KEY_PEM), signature)
  if (!isValid) return { valid: false, reason: 'invalid_signature' }
  return { valid: true, domains: domains as string[] }
}

function getRootDomain(hostname: string): string {
  const host = hostname.replace(/^https?:\/\//, '').split('/')[0]!
  const parts = host.split('.')
  return parts.length > 2 ? parts.slice(-2).join('.') : host
}
