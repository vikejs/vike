/** Test whether the environment is a *real* browser (not a browser simulation such as `jsdom`). */
export function isBrowser() {
  // - Using `typeof window !== 'undefined'` alone isn't narrow enough because some users use https://www.npmjs.com/package/ssr-window
  // - Using `typeof window !== "undefined" && typeof window.scrollY === "number"` still isn't narrow enough because of jsdom
  // - https://github.com/jsdom/jsdom/issues/1537#issuecomment-1689368267
  return Object.getOwnPropertyDescriptor(globalThis, 'window')?.get?.toString().includes('[native code]') ?? false
}
