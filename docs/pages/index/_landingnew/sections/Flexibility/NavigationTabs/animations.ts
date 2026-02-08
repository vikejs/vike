import { gsap } from 'gsap'
import { uiConfig } from '../../../util/ui.constants'

interface ApplyGrayscaleParams {
  targets: HTMLElement[]
  amount: number
  mode: 'set' | 'to'
}

export const applyGrayscale = ({ targets, amount, mode }: ApplyGrayscaleParams) => {
  if (!targets.length) {
    return
  }

  const filter = `grayscale(${amount})`

  if (mode === 'set') {
    gsap.set(targets, { filter })
    return
  }

  gsap.to(targets, {
    filter,
    duration: uiConfig.transition.shortDuration,
    ease: uiConfig.transition.easeOutGsap,
    overwrite: 'auto',
  })
}


