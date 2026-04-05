import { testRun } from '../cloudflare-workers-react-full/.testRun'
testRun('pnpm run preview', { hasStarWarsPage: false, testNodeEnv: true, testBindings: true })
