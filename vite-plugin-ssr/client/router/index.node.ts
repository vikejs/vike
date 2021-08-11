import { assertUsage, isBrowser } from '../../shared/utils'

export { navigate }

function navigate(): never {
  assertUsage(
    !isBrowser(),
    '[`navigate(url)`] Something is wrong with your environement (it loads the wrong `vite-plugin-ssr/client/router` entry). This may be happening if you use Jest or Babel. Open a new GitHub issue so we can discuss a solution.'
  )
  assertUsage(
    false,
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.'
  )
}
