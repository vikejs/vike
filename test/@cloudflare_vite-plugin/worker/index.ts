export { handleAll as default }
export { TodoListDurableObject } from '../database/todoItems'

import { handleSsr } from './ssr'
import { handleTelefunc } from './telefunc'

const handleAll = {
  async fetch(request) {
    const url = new URL(request.url)

    const respTelefunc = await handleTelefunc(request)
    if (respTelefunc) return respTelefunc

    return await handleSsr(url)
  },
} satisfies ExportedHandler<Env>
