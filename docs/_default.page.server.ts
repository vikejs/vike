export * from 'libframe-docs/_default.page.server'
import logoUrl from './icons/vite-plugin-ssr.svg'
import { setFrame } from 'libframe-docs/_default.page.server'
import { headings } from './headings'
setFrame({ headings, logoUrl })
