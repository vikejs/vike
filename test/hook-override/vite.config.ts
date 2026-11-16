import fs from 'node:fs'
import react from '@vitejs/plugin-react'
import vike, { getVikeConfig } from 'vike/plugin'
import type { Plugin, UserConfig } from 'vite'

export default {
  plugins: [vike(), react(), setOnCreatePageContext()],
} satisfies UserConfig

const pageGroup = '/pages/mutable-page-config'

function setOnCreatePageContext(): Plugin {
  return {
    name: 'setOnCreatePageContext',
    configResolved() {
      setPageConfigs()
    },
    handleHotUpdate({ file }) {
      if (file.includes(`${pageGroup}/`) && file.endsWith('/+Page.tsx')) setPageConfigs()
    },
  }
}

function setPageConfigs() {
  Object.entries(getVikeConfig().pages)
    .filter(([pageId]) => pageId.startsWith(`${pageGroup}/`))
    .forEach(([pageId, page]) => {
      const code = fs.readFileSync(new URL(`.${pageId}/+Page.tsx`, import.meta.url), 'utf-8')
      // A `.ssr` hook doesn't run upon client-side navigation => no .pageContext.json request
      const fileName = code.includes('needs-server') ? 'onCreatePageContext.server.ts' : 'onCreatePageContext.ssr.ts'
      // @ts-expect-error The type is the hook's, not its pointer import's
      page.config.onCreatePageContext = `import:.${pageGroup}/${fileName}:onCreatePageContext`
    })
}
