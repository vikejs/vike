import { runTests } from '../cloudflare-workers/.runTests'
runTests('npm run prod', { hasStarWarsPage: false })
