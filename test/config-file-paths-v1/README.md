Tests the following:

- ```ts
  export default {
    onRenderClient: 'import:./onRenderClient.jsx'
  } satisfies Config
  ```
- ```ts
  export default {
    // Instead of +route.js the route can be defined over +config.h.ts > export default { route }
    route: '/third-page'
  }
  ```
