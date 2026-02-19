import { testRunClassic } from '../../test/utils'
testRunClassic('npm run preview', { skipAboutPage: true, serverIsReadyMessage: 'Listening on:' })
