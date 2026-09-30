export type Page = { html: string }

declare global {
  /** The number of onRenderClient() calls since the page was loaded */
  var __renderCount: number
  /** The chunks of the streams and async iterables, with their arrival time */
  var __chunks: { key: string; chunk: unknown; receivedAt: number }[]
  /** Server-side, see pages/status */
  var __cancelCount: undefined | number
}
