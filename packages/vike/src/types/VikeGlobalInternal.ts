export type VikeGlobalInternal =
  | undefined
  | {
      globals?: Record<string, Record<string, unknown> | true>
      fullyRenderedUrl?: string
    }
