import type { Config } from '@brillout/docpress'
import { headings } from './headings'
import { headingsDetached } from './headingsDetached'
import { projectInfo } from './utils'
import vikeIcon from './images/icons/baby-mjolnir.svg'

export default {
  projectInfo,
  faviconUrl: vikeIcon,
  headings,
  headingsDetached,
  tagline: 'Next.js/Nuxt alternative. Flexible, reliable, clutter-free, fast, community-driven.',
  twitterHandle: '@vike_js',
  websiteUrl: 'https://vike.dev',
  sponsorGithubAccount: 'vikejs',
  algolia: {
    appId: 'YMV9Y4B58S',
    apiKey: '9ac178c1a29ba00e8afb98365015f677',
    indexName: 'vike'
  },
  bannerUrl: 'https://vike.dev/banner.png',
  // i18n: true,
  pressKit: true,
  navMaxWidth: 1100
} satisfies Config
