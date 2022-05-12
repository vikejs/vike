export type { ClientDependency }

type ClientDependency = {
  // Can be:
  //  - absolute path, or `
  //  - `@vite-plugin-ssr/dist/...`.
  id: string
  onlyAssets: boolean
}
