// The decoding of the lines (see shared-server-client/streamedValues.ts)

export { decodeChunk }
export { getLineError }

import '../../assertEnvClient.js'

const textEncoder = new TextEncoder()

function decodeChunk(
  line: { t: string } | { b: string } | { v: unknown },
  parseValue: (value: unknown) => unknown,
): unknown {
  if ('t' in line) return textEncoder.encode(line.t)
  if ('b' in line) return decodeBase64url(line.b)
  return parseValue(line.v)
}

function getLineError() {
  return new Error('A streamed pageContext value failed on the server-side (see the server logs)')
}

function decodeBase64url(str: string): Uint8Array {
  const binary = atob(str.replaceAll('-', '+').replaceAll('_', '/'))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}
