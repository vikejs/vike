export { throttle }

function throttle(func: Function, waitTime: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const call = () => {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        func()
      }, waitTime)
    }
  }

  const cancel = () => {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }

  return { call, cancel }
}
