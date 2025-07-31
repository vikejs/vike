import { handleSsr } from './ssr'

export default {
  async fetch(request, env) {
    // TODO/now remove
    console.log('fetch(_, env)', env)
    const url = new URL(request.url)
    return await handleSsr(url)
  },
}
