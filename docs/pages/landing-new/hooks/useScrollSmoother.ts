import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

let scrollSmootherRegistered = false

const registerScrollSmoother = () => {
  if (scrollSmootherRegistered || typeof window === 'undefined') {
    return
  }
  gsap.registerPlugin(ScrollSmoother)
  scrollSmootherRegistered = true
}

const useScrollSmoother = () => {
  const smootherRef = useRef<ScrollSmoother | null>(null)

  useGSAP(
    () => {
      if (typeof window === 'undefined') {
        return
      }

      registerScrollSmoother()

      const wrapper = document.querySelector<HTMLElement>('#smooth-wrapper')
      const content = document.querySelector<HTMLElement>('#smooth-content')
      if (!wrapper || !content) {
        return
      }

      smootherRef.current?.kill()
      smootherRef.current = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 0,
        smoothTouch: 0,
        effects: true,
      })

      return () => {
        smootherRef.current?.kill()
        smootherRef.current = null
      }
    },
    { dependencies: [] },
  )
}

export default useScrollSmoother
