import { testRun } from '../hono-app/.testRun'

testRun('pnpm run dev', {
  serverIsReadyMessage: 'Server running',
  hasServer: true,
})
