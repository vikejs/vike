import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// todo: to config
const animationDuration = 0.25
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

let scrollTriggerRegistered = false

const registerScrollTrigger = () => {
  if (scrollTriggerRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollTrigger)
  scrollTriggerRegistered = true
}

interface SlideshowScrollTriggerParams {
  trigger: Element | null
  onEnter: () => void
  onEnterBack: () => void
  onLeave: () => void
  onLeaveBack: () => void
}

export const createSlideshowScrollTrigger = ({
  trigger,
  onEnter,
  onEnterBack,
  onLeave,
  onLeaveBack,
}: SlideshowScrollTriggerParams) => {
  if (!trigger) {
    return null
  }

  registerScrollTrigger()

  return ScrollTrigger.create({
    id: 'slideshow strt',
    trigger,
    start: 'top 75%',
    end: 'bottom 25%',
    markers: true,
    onEnter,
    onEnterBack,
    onLeave,
    onLeaveBack,
  })
}
