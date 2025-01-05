import { prefetch } from 'vike/client/router'

if (import.meta.env.PROD) {
  prefetch('/new')
}
