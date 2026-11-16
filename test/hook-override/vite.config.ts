import fs from 'node:fs'
import react from '@vitejs/plugin-react'
import vike, { rerunOnPageConfigs } from 'vike/plugin'
import type { Config } from 'vike/types'
import type { UserConfig } from 'vite'

export default {
  plugins: [vike(), react(), setOnCreatePageContext()],
} satisfies UserConfig

const pageGroup = '/pages/mutable-page-config'

// Not typed as Vite's `Plugin`: in this monorepo, Vike adds its `vike` property to another copy of Vite's types
function setOnCreatePageContext() {
  return {
    name: 'setOnCreatePageContext',
    vike: {
      onPageConfigs({ pages }: { pages: Record<string, { config: Config }> }) {
        Object.entries(pages)
          .filter(([pageId]) => pageId.startsWith(`${pageGroup}/`))
          .forEach(([pageId, page]) => {
            const code = fs.readFileSync(new URL(`.${pageId}/+Page.tsx`, import.meta.url), 'utf-8')
            // A `.ssr` hook doesn't run upon client-side navigation => no .pageContext.json request
            const fileName = code.includes('needs-server')
              ? 'onCreatePageContext.server.ts'
              : 'onCreatePageContext.ssr.ts'
            page.config.onCreatePageContext = `import:.${pageGroup}/${fileName}:onCreatePageContext`
          })
      },
    },
    async hotUpdate(this: { environment: any }, { file }: { file: string }) {
      if (this.environment.name === 'client' && file.includes(`${pageGroup}/`) && file.endsWith('/+Page.tsx'))
        await rerunOnPageConfigs(this.environment)
    },
  }
}
