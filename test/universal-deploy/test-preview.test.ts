import { testRun } from './.testRun'

testRun('pnpm run preview', { skipAboutPage: true, serverIsReadyMessage: 'Listening on:' })
