import fs from 'node:fs'
import vike, { rerunOnPageConfigs } from 'vike/plugin'

export default {
  plugins: [vike(), setOnCreatePageContext()],
}

function setOnCreatePageContext() {
  return {
    name: 'setOnCreatePageContext',
    vike: {
      onPageConfigs({ pages }) {
        Object.entries(pages).forEach(([pageId, page]) => {
          const code = fs.readFileSync(new URL(`.${pageId}/+Page.js`, import.meta.url), 'utf-8')
          // A `.ssr` hook doesn't run upon client-side navigation => no .pageContext.json request
          const fileName = code.includes('needs-server')
            ? 'onCreatePageContext.server.js'
            : 'onCreatePageContext.ssr.js'
          page.config.onCreatePageContext = `import:./hooks/${fileName}:onCreatePageContext`
        })
      },
    },
    async hotUpdate({ file }) {
      if (this.environment.name === 'client' && file.endsWith('/+Page.js')) await rerunOnPageConfigs(this.environment)
    },
  }
}
