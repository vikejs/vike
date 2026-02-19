import { testRunClassic } from '../../test/utils'
testRunClassic('npm run dev', {
  skipAboutPage: true,
  tolerateExitCode: [143],
  tolerateError({ logText, logSource }) {
    return logText.includes('terminated with non-0 error code 143') && logSource === 'run() failure'
  },
})
