// Vike's `pageContext.content` type https://vike.dev/pageContext#content
import type { PageContextServer } from 'vike/types'

export function setContent(pageContext: PageContextServer) {
  pageContext.content = 'text'
  pageContext.content = new Uint8Array()
  pageContext.content = new ReadableStream<Uint8Array>()
  // @ts-expect-error
  pageContext.content = 42
}
