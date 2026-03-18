import { testRunClassic } from '../../test/utils'
testRunClassic('npm run dev', {
  tolerateError({ logText, logSource }) {
    return logText.includes('vike-server is deprecated') && logSource === 'stderr'
  },
})
