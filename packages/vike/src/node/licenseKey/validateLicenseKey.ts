export { validateLicenseKey }

// Ed25519 public key (SPKI/DER, base64-encoded) — inlined to avoid fs/path imports
const KEY_VIKE_LICENSE_PUBLIC = 'MCowBQYDK2VwAyEABX+3/YY4I5eZC+uTxD20Pk+0JXsGWc1ekRq5KBJiMco='

type ValidationResult = { valid: true; domains: string[] } | { valid: false; reason: 'malformed' | 'invalid_signature' }

async function validateLicenseKey(licenseKey: string): Promise<ValidationResult> {
  // Decode outer base64url envelope
  let content: Uint8Array
  try {
    const b64 = licenseKey.replace(/-/g, '+').replace(/_/g, '/')
    content = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  } catch {
    return { valid: false, reason: 'malformed' }
  }

  // Ed25519 signatures are always 64 bytes; format: payloadBytes + separatorByte + signatureBytes
  const SIG_LENGTH = 64
  if (content.length < SIG_LENGTH + 2) {
    return { valid: false, reason: 'malformed' }
  }
  const payloadBytes = content.slice(0, content.length - SIG_LENGTH - 1)
  const separatorByte = content[content.length - SIG_LENGTH - 1]
  const signatureBytes = content.slice(content.length - SIG_LENGTH)
  if (separatorByte !== 0x20) return { valid: false, reason: 'malformed' }

  const payloadStr = new TextDecoder().decode(payloadBytes)
  const domains = payloadStr.split(',').filter(Boolean)
  if (domains.length === 0) return { valid: false, reason: 'malformed' }

  // Verify
  const keyBytes = Uint8Array.from(atob(KEY_VIKE_LICENSE_PUBLIC), (c) => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey(
    'spki', // SubjectPublicKeyInfo (DER-encoded) — standard format for public keys
    keyBytes, // raw bytes of the Ed25519 public key
    { name: 'Ed25519' }, // algorithm identifier
    false, // not extractable — the key cannot be exported back out
    ['verify'], // allowed operations — only signature verification
  )
  const isValid = await crypto.subtle.verify('Ed25519', cryptoKey, signatureBytes, payloadBytes)
  if (!isValid) return { valid: false, reason: 'invalid_signature' }

  return { valid: true, domains }
}
