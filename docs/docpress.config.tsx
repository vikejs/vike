import type { Config } from '@brillout/docpress'
import { headings } from './headings'
import { headingsDetached } from './headingsDetached'
import { projectInfo } from './utils'
import faviconUrl from './images/icons/vike-favicon.svg'
import React from 'react'
import { NavHeader, NavHeaderMobile } from './NavHeader'

export default {
  projectInfo,
  faviconUrl,
  navHeader: <NavHeader />,
  navHeaderMobile: <NavHeaderMobile />,
  headings,
  headingsDetached,
  tagline: 'Like Next.js/Nuxt but as do-one-thing-do-it-well Vite plugin.',
  titleNormalCase: false,
  twitterHandle: '@brillout',
  websiteUrl: 'https://vike.dev',
  algolia: {
    PENDING_APPROVAL: true,
    appId: '9I3TIPWD8C',
    apiKey: '62a6bb4f96d3cc479e9cee43b1a02ea9',
    indexName: 'vike.dev'
  },
  bannerUrl: 'https://vike.dev/banner.png',
  i18n: true
} satisfies Config
