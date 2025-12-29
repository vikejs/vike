export { config as default }

import type { Config } from '@brillout/docpress'
import { headings, headingsDetached, categories } from './headings'
import logo from './assets/logo/vike-experiment.svg'
import { PROJECT_VERSION } from './utils/PROJECT_VERSION'
import { discordInvite } from './links'
import { TopNavigation } from './TopNavigation'
import React from 'react'

const config: Config = {
  name: 'Vike',
  version: PROJECT_VERSION,
  url: 'https://vike.dev',
  tagline:
    '(Replaces Next.js/Nuxt) 🔨 The composable framework to build advanced applications with stability and flexibility.',
  logo,
  banner: 'https://vike.dev/banner.jpg',

  github: 'https://github.com/vikejs/vike',
  discord: discordInvite,
  twitter: '@vike_js',
  bluesky: 'vike.dev',
  linkedin: 'vikejs',

  headings,
  headingsDetached,
  categories,

  algolia: {
    appId: 'YMV9Y4B58S',
    apiKey: '9ac178c1a29ba00e8afb98365015f677',
    indexName: 'vike',
  },
  googleAnalytics: 'G-QW0N4TCTYF',

  pressKit: true,

  topNavigation: <TopNavigation />,
  navMaxWidth: 1140,
  navLogoSize: 38,
  navLogoStyle: {
    position: 'relative',
    top: 0,
    left: 0,
  },
  navLogoTextStyle: {
    letterSpacing: '0.02em',
    fontWeight: 480,
    fontStyle: 'italic',
    color: '#555',
    fontSize: 22.4,
  },
} satisfies Config
