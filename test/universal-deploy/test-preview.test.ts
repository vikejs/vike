import { testRun } from './.testRun'
testRun('npm run preview', { skipAboutPage: true, serverIsReadyMessage: 'Listening on:' })
