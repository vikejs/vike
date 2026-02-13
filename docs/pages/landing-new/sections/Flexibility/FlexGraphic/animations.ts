import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { uiConfig } from '../../../util/ui.constants'

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
    duration: uiConfig.transition.shortDuration,
    ease: uiConfig.transition.easeOutGsap,
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
    duration: uiConfig.transition.shortDuration,
    ease: uiConfig.transition.easeOutGsap,
    overwrite: 'auto',
  })
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

  const scroller =
    typeof document === 'undefined' ? undefined : (document.querySelector<HTMLElement>('#smooth-wrapper') ?? undefined)

  return ScrollTrigger.create({
    id: 'slideshow strt',
    trigger,
    scroller,
    start: 'top 65%',
    end: 'bottom 45%',
    markers: false,
    onEnter,
    onEnterBack,
    onLeave,
    onLeaveBack,
  })
}
