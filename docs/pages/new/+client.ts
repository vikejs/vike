import '@batijs/elements'
console.log(1)
window.isBatiLoaded = true
window.onBatiLoaded?.()

declare global {
  interface Window {
    onBatiLoaded: () => void
    isBatiLoaded: boolean
  }
}
