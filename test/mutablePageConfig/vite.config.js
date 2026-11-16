import fs from 'node:fs'
import vike, { getVikeConfig } from 'vike/plugin'

export default {
  plugins: [vike(), setOnCreatePageContext()],
}

function setOnCreatePageContext() {
  return {
    name: 'setOnCreatePageContext',
    configResolved() {
      setPageConfigs()
    },
    handleHotUpdate({ file }) {
      if (file.endsWith('/+Page.js')) setPageConfigs()
    },
  }
}

function setPageConfigs() {
  Object.entries(getVikeConfig().pages).forEach(([pageId, page]) => {
    const code = fs.readFileSync(new URL(`.${pageId}/+Page.js`, import.meta.url), 'utf-8')
    // A `.ssr` hook doesn't run upon client-side navigation => no .pageContext.json request
    const fileName = code.includes('needs-server') ? 'onCreatePageContext.server.js' : 'onCreatePageContext.ssr.js'
    page.config.onCreatePageContext = `import:./hooks/${fileName}:onCreatePageContext`
  })
}
