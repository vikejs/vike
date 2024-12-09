import { isBrowser } from '../isBrowser'
if (isBrowser) throw new Error("I shouldn't be imported from the client")
console.log('hello from server')
