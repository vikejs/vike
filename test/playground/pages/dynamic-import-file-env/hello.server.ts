import { isBrowser } from '../../utils/isBrowser'
if (isBrowser) throw new Error("I shouldn't be imported from the client")
if (import.meta.env.PUBLIC_ENV__TEST) {
  console.log('hello from server')
}
