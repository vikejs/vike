import { assertUsage, assertWarning, getCurrentUrl, objectAssign } from './utils.js'
import { getPageContextSerializedInHtml } from '../shared/getPageContextSerializedInHtml.js'
import { getPageFilesAll } from '../../shared/getPageFiles.js'
import { loadPageFilesClientSide } from '../shared/loadPageFilesClientSide.js'

export { getPageContext }

const urlFirst = getCurrentUrl({ withoutHash: true })

async function getPageContext() {
  const pageContext = getPageContextSerializedInHtml()
  objectAssign(pageContext, {
    isHydration: true as const,
    isBackwardNavigation: null,
    _hasPageContextFromClient: false
  })
  objectAssign(pageContext, await loadPageFiles(pageContext._pageId))
  assertPristineUrl()
  return pageContext
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlFirst === urlCurrent,
    `URL manipulated before hydration finished (\`${urlFirst}\` to \`${urlCurrent}\`). Ensure the hydration finishes with \`onHydrationEnd()\` before manipulating the URL.`
  )
}

async function loadPageFiles(pageId: string) {
  const pageContextAddendum = {}
  const { pageFilesAll, pageConfigs } = await getPageFilesAll(true)
  objectAssign(pageContextAddendum, {
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs
  })

  objectAssign(pageContextAddendum, await loadPageFilesClientSide(pageFilesAll, pageConfigs, pageId))

  pageFilesAll
    .filter((p) => p.fileType !== '.page.server')
    .forEach((p) => {
      assertWarning(
        !p.fileExports?.onBeforeRender,
        `\`export { onBeforeRender }\` of ${p.filePath} is loaded in the browser but never executed (because you are using Server-side Routing). In order to reduce the size of you browser-side JavaScript, define \`onBeforeRender()\` in \`.page.server.js\` instead. See https://vite-plugin-ssr.com/onBeforeRender-isomorphic#server-routing`,
        { onlyOnce: true }
      )
    })

  return pageContextAddendum
}
