import { type RefObject, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

import { defaultGradients } from '../../components/GradientText'
import { R } from '../../util/gsap.utils'
import { UiColorVariantKey } from '../../util/ui.constants'

interface UseIntroHeadlineGradientMotionArgs {
  firstTextRef?: RefObject<HTMLElement | null>
  secondTextRef?: RefObject<HTMLElement | null>
  ctaButtonRef?: RefObject<HTMLElement | null>
  hoveredColor: UiColorVariantKey | null
}

interface GradientLooper {
  target: HTMLElement
  currentColor: UiColorVariantKey
  delayedCall: gsap.core.Tween | null
  colorTween: gsap.core.Tween | null
}

interface GradientMotionController {
  setLockedColor: (color: UiColorVariantKey | null) => void
}

const gradientColors: UiColorVariantKey[] = ['blue', 'green', 'orange']
const randomSwapDelaySeconds = {
  min: 3.5,
  max: 8,
}
const randomSwapDurationSeconds = {
  min: 0.6,
  max: 1,
}
const lockedColorDurationSeconds = {
  min: 0.5,
  max: 0.7,
}

const pickRandomColor = (currentColor: UiColorVariantKey): UiColorVariantKey => {
  const candidates = gradientColors.filter((color) => color !== currentColor)
  return candidates[Math.floor(Math.random() * candidates.length)] ?? currentColor
}

const tweenGradientToColor = (entry: GradientLooper, color: UiColorVariantKey, duration: number) => {
  const { startColor, endColor } = defaultGradients[color]
  entry.colorTween?.kill()
  entry.colorTween = gsap.to(entry.target, {
    '--gradient-start': startColor,
    '--gradient-end': endColor,
    duration,
    ease: 'sine.inOut',
    overwrite: 'auto',
  })
}

const useIntroHeadlineGradientMotion = ({
  firstTextRef,
  secondTextRef,
  ctaButtonRef,
  hoveredColor,
}: UseIntroHeadlineGradientMotionArgs) => {
  const controllerRef = useRef<GradientMotionController | null>(null)

  useGSAP(
    () => {
      const firstText = firstTextRef?.current ?? null
      const secondText = secondTextRef?.current ?? null
      const ctaButton = ctaButtonRef?.current ?? null
      if (!firstText && !secondText && !ctaButton) {
        return
      }

      const loopers: GradientLooper[] = [firstText, secondText, ctaButton]
        .filter((target): target is HTMLElement => target !== null)
        .map((target) => ({ target, currentColor: 'blue' as UiColorVariantKey, delayedCall: null, colorTween: null }))

      const state = { lockedColor: hoveredColor as UiColorVariantKey | null }

      const clearDelayedCall = (entry: GradientLooper) => {
        entry.delayedCall?.kill()
        entry.delayedCall = null
      }

      const scheduleSwap = (entry: GradientLooper) => {
        clearDelayedCall(entry)
        if (state.lockedColor) {
          return
        }

        entry.delayedCall = gsap.delayedCall(R(randomSwapDelaySeconds.min, randomSwapDelaySeconds.max), () => {
          if (state.lockedColor) {
            return
          }
          const nextColor = pickRandomColor(entry.currentColor)
          tweenGradientToColor(entry, nextColor, R(randomSwapDurationSeconds.min, randomSwapDurationSeconds.max))
          entry.currentColor = nextColor
          scheduleSwap(entry)
        })
      }

      const setLockedColor = (color: UiColorVariantKey | null) => {
        state.lockedColor = color
        loopers.forEach((entry) => {
          clearDelayedCall(entry)
          if (color) {
            tweenGradientToColor(entry, color, R(lockedColorDurationSeconds.min, lockedColorDurationSeconds.max))
            entry.currentColor = color
            return
          }
          scheduleSwap(entry)
        })
      }

      setLockedColor(hoveredColor)

      controllerRef.current = { setLockedColor }

      return () => {
        controllerRef.current = null
        loopers.forEach((entry) => {
          clearDelayedCall(entry)
          entry.colorTween?.kill()
        })
      }
    },
    { dependencies: [] },
  )

  useEffect(() => {
    controllerRef.current?.setLockedColor(hoveredColor)
  }, [hoveredColor])
}

export default useIntroHeadlineGradientMotion
