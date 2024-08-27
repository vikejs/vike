export type { ConfigVikeNode, ConfigVikeNodeResolved, ConfigVikeNodePlugin, EntryResolved }

type ConfigVikeNode = {
  /** Server entry path.
   *
   */
  server:
    | string
    | {
        entry: string | { index: string; [name: string]: string | { entry: string } }
        /** Enable standalone build.
         *
         * @default false
         */
        standalone?: boolean

        /** List of external/native dependencies.
         *
         */
        external?: string[]
      }
}

type EntryResolved = {
  index: { entry: string }
  [name: string]: { entry: string }
}
type ConfigVikeNodeResolved = {
  server: {
    entry: EntryResolved
    external: string[]
    standalone: boolean
  }
}

type ConfigVikeNodePlugin = ConfigVikeNode['server']
