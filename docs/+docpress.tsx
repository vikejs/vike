export { config as default }

import type { Config } from '@brillout/docpress'
import { headings, headingsDetached, categories } from './headings'
import logoWithShadow from './assets/logo/vike-shadow.svg'
import { PROJECT_VERSION } from './utils/PROJECT_VERSION'
import { discordInvite } from './links'
import { TopNavigation } from './TopNavigation'
import {
  iconHono,
  iconExpress,
  iconFastify,
  iconH3,
  iconElysia,
  iconReact,
  iconVue,
  iconSolid,
} from './assets/choices-icons'
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
      choices: [
        { name: 'Hono', icon: iconHono, iconStyle: { width: 13, height: 13 } },
        { name: 'Express', icon: iconExpress },
        { name: 'Fastify', icon: iconFastify, iconStyle: { position: 'relative', top: 1 } },
        { name: 'H3', icon: iconH3 },
        { name: 'Elysia', icon: iconElysia },
        'Other',
      ],
      default: 'Hono',
    },
    uiFramework: {
      choices: [
        { name: 'React', icon: iconReact, iconStyle: { position: 'relative', top: -0.5, opacity: 1 } },
        { name: 'Vue', icon: iconVue, iconStyle: { position: 'relative', top: -0.5 } },
        { name: 'Solid', icon: iconSolid, iconStyle: { position: 'relative', top: -0.5 } },
      ],
      default: 'React',
    },
  },
} satisfies Config
