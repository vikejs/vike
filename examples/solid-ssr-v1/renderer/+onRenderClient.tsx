import { createStore, reconcile } from 'solid-js/store'
import { hydrate, render } from 'solid-js/web'
import { IPageContext } from 'types'

import { PageComponent } from './PageComponent'

const [pageContextStore, setPageContext] = createStore<IPageContext>({} as IPageContext)

let dispose: () => void
let isFirstRender = false

function onRenderClient(pageContext: IPageContext) {
  if (!isFirstRender) {
    // Dispose to prevent duplicate pages when navigating.
    if (dispose) dispose()
    setPageContext(pageContext)

    const container = document.getElementById('page-view') as HTMLElement
    if (pageContext.isHydration) {
      dispose = hydrate(() => {
        return PageComponent(pageContextStore)
      }, container)
    } else {
      dispose = render(() => {
        return PageComponent(pageContextStore)
      }, container)
    }
    isFirstRender = true
  } else {
    setPageContext(reconcile(pageContext))
  }
}

export default onRenderClient
