import { testRun } from '../cloudflare-workers/.testRun'
testRun('npm run dev', { hasStarWarsPage: true, isWebpack: true })
