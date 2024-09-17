import { isBrowser } from './isBrowser'
console.log(`hello from ${isBrowser ? 'browser' : 'server'}`)
if (!isBrowser) throw new Error("I shouldn't be imported from the server")
