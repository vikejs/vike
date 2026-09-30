// The app's own `pageContext.content` takes precedence over Vike's https://vike.dev/pageContext#content
import type { PageContextServer } from 'vike/types'

declare global {
  namespace Vike {
    interface PageContext {
      content: { title: string }
    }
  }
}

export function onBeforeRender(pageContext: PageContextServer) {
  pageContext.content = { title: 'Hello' }
  const title: string = pageContext.content.title
  return title
}
