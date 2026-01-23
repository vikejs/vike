export { throttle }
export type { ThrottledFunction }

type ThrottledFunction = {
  (): void
  cancel: () => void
}

function throttle(func: Function, waitTime: number): ThrottledFunction {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const throttled = () => {
    if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        timeoutId = null
        func()
      }, waitTime)
    }
  }

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return throttled
}
