declare module 'vite-plugin-ssr/types' {
  export interface Config {
    Page?: `import:${string}`
  }
}

// Useless import in order to make this file non-ambient
import { Config as _ } from 'vite-plugin-ssr/types'
