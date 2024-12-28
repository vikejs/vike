import { isBrowser } from '../../utils/isBrowser'
if (!isBrowser) throw new Error("I shouldn't be imported from the server")
console.log('hello from client')
