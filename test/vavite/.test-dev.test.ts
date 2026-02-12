import { testRunClassic } from '../utils'

testRunClassic('npm run dev', {
  tolerateError({ logText }) {
    return logText.includes("Vite's CLI is deprecated") || logText.includes('Run the built server entry')
  },
})
