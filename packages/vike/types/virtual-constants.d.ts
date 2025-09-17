declare module 'virtual:vike:constants' {
  /** Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`). */
  export const __VIKE__IS_DEV: boolean

  /** Like `import.meta.env.SSR` but inverted, works inside `node_modules/` (even if package is `ssr.external`). */
  export const __VIKE__IS_CLIENT: boolean

  /**
   * Whether a debug flag is enabled (either the global flag `DEBUG=vike` or a specific flag `DEBUG=vike:some-flag`).
   *
   * WARNING: must be used ONLY on the client-side. (The value is always `undefined` on the server-side.)
   *
   * In isomorphic code, use `__VIKE__IS_CLIENT` to make sure it's only used on the client-side.
   */
  export const __VIKE__IS_DEBUG: boolean | undefined
}
