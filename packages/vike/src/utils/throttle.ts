export { throttle }

function throttle(func: Function, waitTime: number) {
  let isQueued: boolean = false
  return () => {
    if (!isQueued) {
      isQueued = true
      setTimeout(() => {
        isQueued = false
        func()
      }, waitTime)
    }
  }
}
