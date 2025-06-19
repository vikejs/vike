export { config as default }

import type { Config } from '@brillout/docpress'
import { headings } from './headings'
import { headingsDetached, categories } from './headingsDetached'
import logoUrl from './assets/logo/vike.svg'
import faviconUrl from './assets/logo/vike-favicon.svg'
import { PROJECT_VERSION } from './PROJECT_VERSION'
import { discordInvite, githubDiscussions } from './links'
import { TopNavigation } from './TopNavigation'
import React from 'react'

const config: Config = {
  projectInfo: {
    projectName: 'Vike',
    projectVersion: PROJECT_VERSION,
    githubRepository: 'https://github.com/vikejs/vike',
    githubIssues: 'https://github.com/vikejs/vike/issues/new',
    githubDiscussions: githubDiscussions,
    discordInvite: discordInvite,
    twitterProfile: 'https://x.com/vike_js',
    blueskyHandle: 'vike.dev',
  },
  docsDir: 'packages/vike.dev',
  logoUrl,
  faviconUrl,
  headings,
  headingsDetached,
  categories,
  tagline: 'The Framework *You* Control - Next.js & Nuxt alternative for unprecedented flexibility and stability.',
  twitterHandle: '@vike_js',
  websiteUrl: 'https://vike.dev',
  sponsorGithubAccount: 'vikejs',
  algolia: {
    appId: 'YMV9Y4B58S',
    apiKey: '9ac178c1a29ba00e8afb98365015f677',
    indexName: 'vike',
  },
  bannerUrl: 'https://vike.dev/banner.jpg',
  // i18n: true,
  pressKit: true,
  navMaxWidth: 1140,
  topNavigation: <TopNavigation />,
  navLogoSize: 41,
  navLogoStyle: {
    position: 'relative',
    top: -1,
  },
  navLogoTextStyle: {
    letterSpacing: '0.01em',
    fontWeight: 420,
    color: '#444',
  },
} satisfies Config
