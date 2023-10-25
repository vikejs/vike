// This script is only loaded on the client-side
console.log('Some client-only script.')
console.log(`isBrowser: ${typeof window !== 'undefined'}`)
/* TODO
window.counter = window.counter ?? 0
window.counter++
const isSingleton = window.counter === 1
console.log(`Some client-only script. It's always loaded one time: ${isSingleton}.`)
*/
