export const ignorePatternsBuiltIn = [
  '**/node_modules/**',
  // Only relevant for crawls that include dot directories (see CrawlOptions['dot'])
  '**/.git/**',
  // Ejected Vike extensions, see https://github.com/snake-py/eject
  '**/ejected/**',
  // Allow:
  // ```bash
  // +Page.js
  // +Page.telefunc.js
  // ```
  '**/*.telefunc.*',
  // https://github.com/vikejs/vike/issues/1589#issuecomment-2031925598
  '**/.history/**',
  // https://github.com/vikejs/vike/discussions/2222
  '**/*.generated.*',
  // https://github.com/vikejs/vike/issues/2347
  '**/*.spec.*',
  '**/*.test.*',
] as const
