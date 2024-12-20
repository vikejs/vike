export { useHeadingUnderlineAnimation }

import './useHeadingUnderlineAnimation.css'
import { useEffect } from 'react'

function useHeadingUnderlineAnimation() {
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('[data-underline-animated]')) as HTMLElement[]
    console.log('headings', headings)
    const onScroll = () => {
      const isTop = document.documentElement.scrollTop === 0
      headings.forEach((h) => {
        const { top } = h.getBoundingClientRect()
        const isHighlighted = !isTop && top < window.innerHeight / 2
        const widthStr = getComputedStyle(h).width
        h.style.setProperty('--heading-width', widthStr)
        const width = parseInt(widthStr, 10)
        const width_reference = 205.516
        const duration_agnostic = 0.7
        const duration_adjusted = (0.7 * width) / width_reference
        const compromise = width_reference > width ? 0.7 : 0.3
        const duration_compromise = compromise * duration_adjusted + (1 - compromise) * duration_agnostic
        h.style.setProperty('--animation-duration', `${duration_compromise}s`)
        // It's complex to only highlight only one heading at a time. We tried but failed:
        // - https://github.com/vikejs/vike/commit/9ce5fd1ecc2413242fc5ee0669f272c31e2599c5
        // - https://github.com/vikejs/vike/commit/e3a0e6457690782868405523ebca92524b1b48d7
        if (isHighlighted) h.classList.add('heading-highlight')
      })
    }
    onAfterPaint(onScroll)
    const events = ['scroll', 'resize']
    events.forEach((eventName) => {
      window.addEventListener(eventName, onScroll, { passive: true })
    })
    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, onScroll)
      })
    }
  })
}
function onAfterPaint(callback: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 300 })
  } else {
    // Fallback for old versions of Safari, we'll assume that things are less likely to be busy after 150ms.
    setTimeout(callback, 150)
  }
}
