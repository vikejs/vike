import { testRunClassic } from '../utils'

testRunClassic('npm run preview', {
  serverIsReadyMessage: 'Server listening',
  tolerateError({ logText }) {
    return false
    return logText.includes("Vite's CLI is deprecated") || logText.includes('Run the built server entry')
  },
})
