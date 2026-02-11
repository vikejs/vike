import { gsap } from 'gsap'

export const R = (min: number, max: number) => Math.random() * (max - min) + min

export const killTweens = (targets: Element[], props?: string | string[]) => {
  if (!targets.length) {
    return
  }
  gsap.killTweensOf(targets, props)
}
