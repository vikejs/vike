// We do not `import { assertUsage } from './utils'` because otherwise Node.js loads browser-only code, such as `import.meta.env.BASE_URL` defined in `./utils/getBaseUrl.ts`,  and choke.
import { assertUsage } from './utils/assert'
import { isBrowser } from './utils/isBrowser'

export { navigate }

function navigate(): never {
  assertUsage(
    !isBrowser(),
    '[`navigate(url)`] Something is wrong with your environment (it loads the wrong `vite-plugin-ssr/client/router` entry). This may be happening if you use Jest or Babel. Open a new GitHub issue to discuss a solution.',
  )
  assertUsage(
    false,
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.',
  )
}
