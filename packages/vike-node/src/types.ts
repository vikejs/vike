export type { ConfigVikeNode, ConfigVikeNodeResolved }

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

        /** List of native dependencies.
         *
         */
        native?: string[]
      }
}

type ConfigVikeNodeResolved = {
  server: { entry: { index: string; [name: string]: string }; native: string[]; standalone: boolean }
}
