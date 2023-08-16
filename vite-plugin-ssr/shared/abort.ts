// TODO/v1-release: Move all universal imports (when using Client Routing) to:
//   import {
//     redirect,
//     render,
//     resolveRoute,
//     navigate,
//     prefetch,
//   } from 'vite-plugin-ssr'
// Use package.json#exports to make the imports isomorphic.
// The client-side has no utility when using Server Routing.
export { redirect, render } from './route/abort.js'
