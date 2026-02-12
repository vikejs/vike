import { testRunClassic } from '../utils'

testRunClassic('npm run preview', {
  tolerateError({ logText }) {
    return logText.includes("Vite's CLI is deprecated") || logText.includes('Run the built server entry')
  },
})
