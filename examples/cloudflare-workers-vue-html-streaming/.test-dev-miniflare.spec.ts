import { runTests } from '../cloudflare-workers/.runTests'
runTests('npm run dev:miniflare', { hasStarWarsPage: false })
