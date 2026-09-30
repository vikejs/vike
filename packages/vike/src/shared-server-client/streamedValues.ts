// The wire format of streamed pageContext values: a ReadableStream, a Promise or an async iterable (e.g. an async
// generator) anywhere in a passToClient value. https://vike.dev/passToClient#streaming
//
// - Serialization: a marker followed by the value's id, e.g. `"!VikePromise:0"` (the serializer escapes user strings
//   starting with `!`, so a user string can't be mistaken for a marker).
// - Delivery: after the serialized pageContext, in the same response, one JSON line per chunk / result:
//   - HTML: see server/runtime/renderPageServer/html/streamedValuesHtml.ts
//   - `.pageContext.json`: see server/runtime/renderPageServer/pageContextJson.ts
//
// Lines:
//   {"s":<id>,"t":<text>}      A chunk that is a Uint8Array of valid UTF-8
//   {"s":<id>,"b":<base64url>} A chunk that is any other Uint8Array
//   {"s":<id>,"v":<value>}     Any other chunk, or the value of a Promise (@brillout/json-serializer)
//   {"s":<id>,"end":true}      The end of a ReadableStream / async iterable
//   {"s":<id>,"error":true}    The value failed (the error is logged on the server-side and isn't sent to the client)
//
// A chunk or a Promise value can contain further streamed values: they get new ids and their lines follow.

export { markers }
export { pageContextJsonLinesBegin }
export { pageContextJsonLinesEnd }
export type { Line }
export type { LineContent }

const markers = {
  readableStream: '!VikeStream:',
  promise: '!VikePromise:',
  asyncIterable: '!VikeAsyncIterable:',
}

type LineContent = { t: string } | { b: string } | { v: unknown } | { end: true } | { error: true }
type Line = { s: number } & LineContent

// See server/runtime/renderPageServer/pageContextJson.ts
const pageContextJsonLinesBegin = ',"_streamedValues":['
const pageContextJsonLinesEnd = ']}'
