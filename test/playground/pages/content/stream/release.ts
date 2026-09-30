export { waitForRelease, release }

let resolve: undefined | (() => void)
function waitForRelease() {
  return new Promise<void>((r) => (resolve = r))
}
function release() {
  resolve?.()
}
