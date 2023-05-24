import type { ConfigNonHeaderFile } from 'vite-plugin-ssr/types'

export default {
  onRenderClientPath: './onRenderClient.jsx',
  onRenderHtmlPath: './onRenderHtml.jsx'
} satisfies ConfigNonHeaderFile
