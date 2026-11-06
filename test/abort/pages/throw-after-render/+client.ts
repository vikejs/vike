import { handleError } from 'vike/client/router'

if (location.search === '?early-listener') {
  window.addEventListener('unhandledrejection', async (event) => {
    event.preventDefault()
    await handleError(event.reason)
    console.log('handleError() settled')
  })
}
