import { testRun } from './.testRun'

testRun('pnpm run preview', {
  tolerateError: true,
  serverIsReadyMessage: 'Starting local server',
  serverIsReadyDelay: 2000,
  serverUrl: 'http://127.0.0.1:3000',
})
