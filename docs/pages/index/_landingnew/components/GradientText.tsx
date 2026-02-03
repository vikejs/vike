import React from 'react'
import { GradientTextColors } from '../util/ui.constants'

// 3 default combinations: blue, orange, green
export const defaultGradients: Record<GradientTextColors, { startColor: string; endColor: string }> = {
  blue: { startColor: '#7F5AF0', endColor: '#3B82F6' },
  orange: { startColor: '#F97316', endColor: '#E879F9' },
  green: { startColor: '#00955f', endColor: '#00b0a5' },
}

interface GradientTextProps {
  children: React.ReactNode
  startColor?: string
  endColor?: string
  rotation?: number
  color?: GradientTextColors
}

const GradientText = ({ children, color, startColor, endColor, rotation = 90 }: GradientTextProps) => {
  const isCustomGradient = Boolean(startColor && endColor)
  const usedStartColor = isCustomGradient ? startColor : color ? defaultGradients[color].startColor : 'green'
  const usedEndColor = isCustomGradient ? endColor : color ? defaultGradients[color].endColor : 'red'

  const styleBackgroundString = `linear-gradient(${rotation}deg, ${usedStartColor}, ${usedEndColor})`

  return (
    <span
      style={{
        background: styleBackgroundString,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  )
}

export default GradientText
