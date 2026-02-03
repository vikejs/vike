import { gsap } from 'gsap'

// todo: to config
const animationDuration = 0.15
const animationEase = 'power2.out'

interface ApplyColorParams {
  targets: SVGElement[]
  color: string
  mode: 'set' | 'to'
  attr: 'stroke' | 'fill'
}

export const applyColor = ({ targets, color, mode, attr }: ApplyColorParams) => {
  if (!targets.length) {
    return
  }

  if (mode === 'set') {
    gsap.set(targets, { attr: { [attr]: color } })
    return
  }

  gsap.to(targets, {
    attr: { [attr]: color },
    duration: animationDuration,
    ease: animationEase,
    overwrite: 'auto',
  })
}

export const applyStrokeWidth = (targets: SVGElement[], width: number, mode: 'set' | 'to') => {
  if (!targets.length) {
    return
  }

  if (mode === 'set') {
    gsap.set(targets, { attr: { 'stroke-width': width } })
    return
  }

  gsap.to(targets, {
    attr: { 'stroke-width': width },
    duration: animationDuration,
    ease: animationEase,
    overwrite: 'auto',
  })
}

export const killTweens = (targets: SVGElement[]) => {
  if (!targets.length) {
    return
  }
  gsap.killTweensOf(targets)
}
