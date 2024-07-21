export type { ConfigVikeNode, ConfigVikeNodeResolved, ConfigVikeNodePlugin }

type ConfigVikeNode = {
  /** Server entry path.
   *
   */
  server:
    | string
    | {
        entry: string | { index: string; [name: string]: string }
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

type ConfigVikeNodeResolved = {
  server: { entry: { index: string; [name: string]: string }; external: string[]; standalone: boolean }
}

type ConfigVikeNodePlugin = ConfigVikeNode['server']
