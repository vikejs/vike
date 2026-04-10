import { testRunClassic } from '../../test/utils'
testRunClassic('pnpm run prod', {
  tolerateError({ logText, logSource }) {
    return logText.includes('vike-server is deprecated') && logSource === 'stderr'
  },
})
