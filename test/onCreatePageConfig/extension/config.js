export default {
  name: 'extension',
  onCreatePageConfig_experimental: async (page, { read }) => {
    const [pageFile] = page.imports('Page')
    const code = await read(pageFile.filePathAbsolute)
    // A `.ssr` hook doesn't run upon client-side navigation => no .pageContext.json request
    const fileName = code.includes('needs-server') ? 'onCreatePageContext.server.js' : 'onCreatePageContext.ssr.js'
    return { onCreatePageContext: `import:./${fileName}:onCreatePageContext` }
  },
}
