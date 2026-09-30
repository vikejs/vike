export { onRenderClient }

import type { PageContextClient } from 'vike/types'
import type { Page } from './types'

declare global {
  var __renderCount: number
  var __chunks: { key: string; chunk: unknown; receivedAt: number }[]
}

// Shows each value of pageContext.data as it arrives: the chunks of streams and async iterables, the value of
// promises, or the error
function onRenderClient(pageContext: PageContextClient) {
  window.__renderCount = (window.__renderCount ?? 0) + 1
  window.__chunks = []
  const root = document.getElementById('root')!
  if (!pageContext.isHydration) root.innerHTML = (pageContext.Page as Page).html
  const list = document.createElement('ul')
  root.append(list)
  Object.entries(pageContext.data as Record<string, unknown>).forEach(([key, value]) => {
    const li = document.createElement('li')
    li.id = key
    list.append(li)
    show(li, value, key).then(() => (li.dataset.done = 'true'))
  })
}

async function show(el: HTMLElement, value: unknown, key: string): Promise<void> {
  const append = (text: string) => {
    const span = document.createElement('span')
    span.textContent = text
    el.append(span)
  }
  try {
    if (value instanceof Promise) {
      await show(el, await value, key)
    } else if (
      value instanceof ReadableStream ||
      (typeof value === 'object' && value && Symbol.asyncIterator in value)
    ) {
      for await (const chunk of value as AsyncIterable<unknown>) {
        window.__chunks.push({ key, chunk, receivedAt: Date.now() })
        await show(el, chunk, key)
      }
    } else if (value instanceof Uint8Array) {
      append(`bytes:${Array.from(value, (b) => b.toString(16).padStart(2, '0')).join('')}`)
    } else if (Array.isArray(value)) {
      for (const item of value) await show(el, item, key)
    } else if (typeof value === 'object' && value) {
      for (const [k, v] of Object.entries(value)) {
        append(`${k}=`)
        await show(el, v, key)
      }
    } else {
      append(String(value))
    }
  } catch (err) {
    append(`error:${(err as Error).message}`)
  }
}
