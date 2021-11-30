import { getContext } from 'telefunc'
import type { Session } from 'next-auth'

export { getUser }

function getUser() {
  const context = getContext<{ session: Session | null }>()

  if (context.session) {
    return context.session.user
  }
}
