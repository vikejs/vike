import React from 'react'
import { UiColorVariantKey } from '../util/ui.constants'

// TODO: defined new colors in tailwind config and use those instead of hex values
export const defaultGradients: Record<UiColorVariantKey, { startColor: string; endColor: string }> = {
  blue: { startColor: '#7F5AF0', endColor: '#3B82F6' },
  orange: { startColor: '#F97316', endColor: '#E879F9' },
  green: { startColor: '#00955f', endColor: '#00b0a5' },
}

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  startColor?: string
  endColor?: string
  rotation?: number
  color?: UiColorVariantKey
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ children, color, startColor, endColor, rotation = 90, style, ...props }, ref) => {
    const isCustomGradient = Boolean(startColor && endColor)
    const usedStartColor = isCustomGradient ? startColor : color ? defaultGradients[color].startColor : 'green'
    const usedEndColor = isCustomGradient ? endColor : color ? defaultGradients[color].endColor : 'red'

    const gradientStyle = {
      '--gradient-start': usedStartColor,
      '--gradient-end': usedEndColor,
      background: `linear-gradient(${rotation}deg, var(--gradient-start), var(--gradient-end))`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      ...style,
    } as React.CSSProperties

    return (
      <span ref={ref} style={gradientStyle} {...props}>
        {children}
      </span>
    )
  },
)

GradientText.displayName = 'GradientText'

export default GradientText
