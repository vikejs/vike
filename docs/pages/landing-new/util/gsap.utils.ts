import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export const R = (min: number, max: number) => Math.random() * (max - min) + min

export const killTweens = (targets: Element[], props?: string | string[]) => {
  if (!targets.length) {
    return
  }
  gsap.killTweensOf(targets, props)
}

let scrollTriggerRegistered = false
let scrollSmootherRegistered = false

export const registerScrollSmoother = () => {
  if (scrollSmootherRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollSmoother)
  scrollSmootherRegistered = true
}

export const registerScrollTrigger = () => {
  if (scrollTriggerRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollTrigger)
  scrollTriggerRegistered = true
}

export const debounce = <T extends (...args: any[]) => void>(fn: T, waitMs: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: unknown
  let result: ReturnType<T> | undefined

  const invoke = () => {
    timeoutId = null
    if (!lastArgs) {
      return
    }
    result = fn.apply(lastThis as any, lastArgs) as ReturnType<T>
    lastArgs = null
    lastThis = undefined
  }

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args
    lastThis = this
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(invoke, waitMs)
    return result
  } as T & { cancel: () => void; flush: () => ReturnType<T> | undefined }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = null
    lastArgs = null
    lastThis = undefined
  }

  debounced.flush = () => {
    if (!timeoutId) {
      return result
    }
    clearTimeout(timeoutId)
    invoke()
    return result
  }

  return debounced
}
