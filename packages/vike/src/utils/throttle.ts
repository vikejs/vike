export { throttle }
export type { ThrottledFunction }

type ThrottledFunction = {
  (): void
  cancel: () => void
}

// TODO/ai: simplify implementation
function throttle(func: Function, waitTime: number): ThrottledFunction {
  let isQueued: boolean = false
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const throttled = () => {
    if (!isQueued) {
      isQueued = true
      timeoutId = setTimeout(() => {
        isQueued = false
        timeoutId = null
        func()
      }, waitTime)
    }
  }

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
      isQueued = false
    }
  }

  return throttled
}
