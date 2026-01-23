export { throttle }
export type { ThrottledFunction }

type ThrottledFunction = {
  (): void
  cancel: () => void
}

function throttle(func: Function, waitTime: number): ThrottledFunction {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const throttled = () => {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        func()
      }, waitTime)
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  // TODO/ai return cancel instead of throttled
  return throttled
}
