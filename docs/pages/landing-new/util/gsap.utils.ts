import { gsap } from 'gsap'

export const killTweens = (targets: Element[], props?: string | string[]) => {
  if (!targets.length) {
    return
  }
  gsap.killTweensOf(targets, props)
}
