export { config as default }

import type { Config } from '@brillout/docpress'
import { headings, headingsDetached, categories } from './headings'
import logoWithShadow from './assets/logo/vike-shadow.svg'
import { PROJECT_VERSION } from './utils/PROJECT_VERSION'
import { discordInvite } from './links'
import { TopNavigation } from './TopNavigation'
import React from 'react'

const config = {
  name: 'Vike',
  version: PROJECT_VERSION,
  url: 'https://vike.dev',
  tagline: '(Replaces Next.js/Nuxt) 🔨 Build mission-critical applications with stability and development freedom.',
  logo: logoWithShadow,
  favicon: {
    browser: '/favicon.svg',
    google: '/apple-touch-icon.png',
  },
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
  navLogoSize: 50,
  navLogoTextStyle: {
    fontWeight: 'normal',
    fontSize: 21,
    marginLeft: 0,
  },
  choices: {
    server: {
      choices: ['Hono', 'Express', 'Fastify', 'H3', 'Elysia', 'Other'],
      default: 'Hono',
    },
    uiFramework: {
      choices: ['React', 'Vue', 'Solid'],
      default: 'React',
    },
  },
} satisfies Config
