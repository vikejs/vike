import { useEffect, useState } from 'react'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const getInitialMotionAllowed = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }
  return !window.matchMedia(reducedMotionQuery).matches && document.visibilityState === 'visible'
}

const useMotionAllowed = () => {
  const [isMotionAllowed, setIsMotionAllowed] = useState<boolean>(getInitialMotionAllowed)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(reducedMotionQuery)
    const updateMotionAllowed = () => {
      setIsMotionAllowed(!mediaQuery.matches && document.visibilityState === 'visible')
    }

    updateMotionAllowed()

    mediaQuery.addEventListener('change', updateMotionAllowed)
    document.addEventListener('visibilitychange', updateMotionAllowed)

    return () => {
      mediaQuery.removeEventListener('change', updateMotionAllowed)
      document.removeEventListener('visibilitychange', updateMotionAllowed)
    }
  }, [])

  return isMotionAllowed
}

export default useMotionAllowed
