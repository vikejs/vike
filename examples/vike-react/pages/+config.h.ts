import type { Config } from 'vike-react/types'
import Layout from '../layouts/LayoutDefault'
import Head from '../layouts/HeadDefault'
import logoUrl from '../assets/logo.svg'
import vikeReact from 'vike-react'

// Default configs (can be overriden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + React App',
  // <meta name="description">
  description: 'Demo showcasing Vike + React',
  // <link rel="icon" href="${favicon}" />
  favicon: logoUrl,
  extends: vikeReact
} satisfies Config
