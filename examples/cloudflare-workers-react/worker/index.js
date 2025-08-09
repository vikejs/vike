import { handleSsr } from './ssr'

console.log(`process.env.NODE_ENV === ${JSON.stringify(process.env.NODE_ENV)}`)

export default {
  async fetch(request) {
    const url = new URL(request.url)
    return await handleSsr(url)
  },
}
