import { route } from './route.shared'

export { hydratePage }

async function hydratePage() {
  const url = window.location.pathname
  const pageId = await route(url)
  console.log(pageId)
}
