export { config }

import type { Config } from 'libframe-docs'
import { headings, headingsWithoutLink } from '../headings'
import { projectInfo } from '../utils'
import faviconUrl from '../icons/vite-plugin-ssr.svg'
import React from 'react'
import { NavHeader, NavHeaderMobile } from './NavHeader'

const config = {
  projectInfo,
  faviconUrl,
  algolia: {
    appId: 'MUXG1ZE9F6',
    apiKey: '8d5986fca9ba9110bcbbfc51263de88b',
    indexName: 'vite-pluginssr',
  },
  navHeaderMobile: <NavHeaderMobile />,
  navHeader: <NavHeader />,
  headings,
  headingsWithoutLink,
  tagline: 'Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin.',
  titleNormalCase: false
} as Config
