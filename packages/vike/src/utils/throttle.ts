export { throttle }

function throttle(func: Function, waitTime: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return () => {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        func()
      }, waitTime)
    }
  }
}
