import { useGSAP } from '@gsap/react'
import { BreakpointMediaQueries } from '../util/ui.constants'
import { useState } from 'react'
import { gsap } from 'gsap'

let mm = gsap.matchMedia()

const useBreakpoints = () => {
  const [breakpoints, setBreakpoints] = useState({
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
  })

  useGSAP(() => {
    mm.add(BreakpointMediaQueries.sm, () => {
      setBreakpoints((prev) => ({ ...prev, isSm: true }))
      return () => setBreakpoints((prev) => ({ ...prev, isSm: false }))
    })

    mm.add(BreakpointMediaQueries.md, () => {
      setBreakpoints((prev) => ({ ...prev, isMd: true }))
      return () => setBreakpoints((prev) => ({ ...prev, isMd: false }))
    })

    mm.add(BreakpointMediaQueries.lg, () => {
      setBreakpoints((prev) => ({ ...prev, isLg: true }))
      return () => setBreakpoints((prev) => ({ ...prev, isLg: false }))
    })

    mm.add(BreakpointMediaQueries.xl, () => {
      setBreakpoints((prev) => ({ ...prev, isXl: true }))
      return () => setBreakpoints((prev) => ({ ...prev, isXl: false }))
    })
  })

  return breakpoints
}

export default useBreakpoints
