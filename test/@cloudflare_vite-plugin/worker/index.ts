import { handleSsr } from './ssr'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    return await handleSsr(url)
  },
} satisfies ExportedHandler<Env>
