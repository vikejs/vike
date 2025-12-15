import { defineConfig } from 'vike/types'

export default defineConfig({
  onCreateGlobalContext: [
    'import:./+onCreateGlobalContext.client',
    'import:./+onCreateGlobalContext.server',
  ]
})
