import { testRun } from '../cloudflare-workers/.testRun'
testRun('npm run preview:miniflare', { hasStarWarsPage: true, isWebpack: true })
