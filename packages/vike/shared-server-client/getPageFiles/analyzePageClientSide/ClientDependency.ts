export type { ClientDependency }

type ClientDependency = {
  // Can be:
  //  - absolute path, or `
  //  - `@vike/dist/...`.
  id: string
  onlyAssets: boolean
  eagerlyImported: boolean
}
