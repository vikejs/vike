import type { Config } from '@brillout/docpress'
import { headings } from './headings'
import { headingsDetached } from './headingsDetached'
import { projectInfo } from './utils'
import logoUrl from './assets/logo/vike.svg'
import faviconUrl from './assets/logo/vike-favicon.svg'

export default {
  projectInfo,
  logoUrl,
  faviconUrl,
  headings,
  headingsDetached,
  tagline:
    'The Framework *You* Control - Next.js & Nuxt alternative for unprecedented flexibility and dependability.',
  twitterHandle: '@vike_js',
  websiteUrl: 'https://vike.dev',
  sponsorGithubAccount: 'vikejs',
  algolia: {
    appId: 'YMV9Y4B58S',
    apiKey: '9ac178c1a29ba00e8afb98365015f677',
    indexName: 'vike'
  },
  bannerUrl: 'https://vike.dev/banner.jpg',
  // i18n: true,
  pressKit: true,
  navMaxWidth: 1140,
  navLogoSize: 45,
  navLogoTextStyle: {
    letterSpacing: '0.01em',
    fontWeight: 420
  }
} satisfies Config
