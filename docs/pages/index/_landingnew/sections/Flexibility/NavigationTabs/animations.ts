import { gsap } from 'gsap'
import { uiConfig } from '../../../util/ui.constants'

export const pipeWaveStagger = { each: 0.02, from: 'end', ease: "power1.out" } as const
const pipeWaveKeyframes = [
  { y: -3, opacity: 0.7, duration: uiConfig.transition.shortDuration },
  { y: -6, opacity: 0.4, duration: uiConfig.transition.shortDuration },
  { y: 0, opacity: 1, duration: uiConfig.transition.shortDuration },
] as const
export const pipeWaveDuration = uiConfig.transition.longDuration
export const gradientHoverOffset = -100
export const gradientActiveOffset = -140

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
    duration: uiConfig.transition.longDurationTw,
    ease: uiConfig.transition.easeOutGsap,
    overwrite: 'auto',
  })
}

export const moveTabGradient = ({
  target,
  y,
  mode,
}: {
  target: HTMLElement | null
  y: number
  mode: 'set' | 'to'
}) => {
  if (!target) {
    return
  }
  if (mode === 'set') {
    gsap.set(target, { y })
    return
  }
  gsap.to(target, {
    y,
    duration: pipeWaveDuration,
    ease: uiConfig.transition.easeOutGsap,
    overwrite: 'auto',
  })
}

export const createPipeWaveTimeline = (targets: HTMLElement[]) => {
  if (!targets.length) {
    return null
  }

  gsap.set(targets, { transformOrigin: 'top center' })

  return gsap.timeline().to(targets, {
    keyframes: pipeWaveKeyframes,
    stagger: pipeWaveStagger,
    ease: uiConfig.transition.easeOutGsap,
    overwrite: true,
  })
}

export const resetPipeWave = (targets: HTMLElement[]) => {
  if (!targets.length) {
    return
  }

  gsap.set(targets, { transformOrigin: 'left center' })
  gsap.to(targets, {
    scale: 1,
    opacity: 1,
    duration: uiConfig.transition.shortDuration,
    ease: uiConfig.transition.easeOutGsap,
    overwrite: 'auto',
  })
}
