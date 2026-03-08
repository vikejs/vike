export { validateLicenseKey }
export { getRootDomain }

// Ed25519 public key (SPKI/DER, base64-encoded) — inlined to avoid fs/path imports
const PUBLIC_KEY_B64 = 'MCowBQYDK2VwAyEABX+3/YY4I5eZC+uTxD20Pk+0JXsGWc1ekRq5KBJiMco='

type ValidationResult = { valid: true; domains: string[] } | { valid: false; reason: 'malformed' | 'invalid_signature' }

async function validateLicenseKey(licenseKey: string): Promise<ValidationResult> {
  // Decode outer base64url envelope
  let combined: Uint8Array
  try {
    const b64 = licenseKey.replace(/-/g, '+').replace(/_/g, '/')
    combined = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  } catch {
    return { valid: false, reason: 'malformed' }
  }

  // Ed25519 signatures are always 64 bytes; format: payload_bytes + 0x20 + sig_bytes
  const SIG_LENGTH = 64
  if (combined.length < SIG_LENGTH + 2) {
    return { valid: false, reason: 'malformed' }
  }
  const payloadBytes = combined.slice(0, combined.length - SIG_LENGTH - 1)
  const spaceByte = combined[combined.length - SIG_LENGTH - 1]
  const sigBytes = combined.slice(combined.length - SIG_LENGTH)
  if (spaceByte !== 0x20) return { valid: false, reason: 'malformed' }

  const payloadStr = new TextDecoder().decode(payloadBytes)
  const domains = payloadStr.split(',').filter(Boolean)
  if (domains.length === 0) return { valid: false, reason: 'malformed' }

  // Import public key and verify
  const keyBytes = Uint8Array.from(atob(PUBLIC_KEY_B64), (c) => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey('spki', keyBytes, { name: 'Ed25519' }, false, ['verify'])
  const isValid = await crypto.subtle.verify('Ed25519', cryptoKey, sigBytes, payloadBytes)
  if (!isValid) return { valid: false, reason: 'invalid_signature' }

  return { valid: true, domains }
}

function getRootDomain(hostname: string): string {
  const host = hostname.replace(/^https?:\/\//, '').split('/')[0]!
  const parts = host.split('.')
  return parts.length > 2 ? parts.slice(-2).join('.') : host
}
