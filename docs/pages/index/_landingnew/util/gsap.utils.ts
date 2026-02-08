import { gsap } from 'gsap'

export const killTweens = (targets: Element[]) => {
  if (!targets.length) {
    return
  }
  gsap.killTweensOf(targets)
}