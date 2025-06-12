import type { Config } from '@brillout/docpress'
import { headings } from './headings'
import { headingsDetached, categories } from './headingsDetached'
import { projectInfo } from './utils'
import logoUrl from './assets/logo/vike.svg'
import faviconUrl from './assets/logo/vike-favicon.svg'

export default {
  projectInfo,
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
