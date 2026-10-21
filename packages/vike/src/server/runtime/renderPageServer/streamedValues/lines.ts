// The encoding of the lines (see shared-server-client/streamedValues.ts)

export { serializeLine }
export { chunkToLine }

import { stringify, type Replacer } from '@brillout/json-serializer/stringify'
import type { Line, LineContent } from '../../../../shared-server-client/streamedValues.js'
import { assert } from '../../../../utils/assert.js'
import '../../../assertEnvServer.js'

// `replacer` replaces the streamed values that a `v` line's value contains
function serializeLine(line: Line, replacer: Replacer): string {
  const lineStr =
    'v' in line
      ? `{"s":${line.s},"v":${stringify(line.v, {
          forbidReactElements: true,
          valueName: 'a streamed pageContext value',
          replacer,
          htmlScriptSafe: { escapeScripts: true, escapeURLs: false },
        })}}`
      : JSON.stringify(line)
  // JSON.stringify() escapes line breaks: one line per JSON value
  assert(!lineStr.includes('\n'))
  return lineStr
}

// A ReadableStream / async iterable: one line per chunk, then an `end` line
function chunkToLine(result: IteratorResult<unknown>): { line: LineContent; isLast: boolean } {
  if (result.done) return { line: { end: true }, isLast: true }
  return { line: encodeChunk(result.value), isLast: false }
}

function encodeChunk(chunk: unknown): LineContent {
  if (!(chunk instanceof Uint8Array)) return { v: chunk }
  const text = decodeUtf8(chunk)
  return text !== null ? { t: text } : { b: encodeBase64url(chunk) }
}

const utf8Decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })
function decodeUtf8(bytes: Uint8Array): string | null {
  try {
    return utf8Decoder.decode(bytes)
  } catch {
    return null
  }
}
function encodeBase64url(bytes: Uint8Array): string {
  let binary = ''
  // In slices: spreading a large array into a single call overflows the stack
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}
