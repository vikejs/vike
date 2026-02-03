import React from 'react'

// 3 default combinations: blue, orange, green
const defaultGradients = {
  blue: { startColor: '#7F5AF0', endColor: '#3B82F6' },
  orange: { startColor: '#F97316', endColor: '#E879F9' },
  green: { startColor: '#10B981', endColor: '#4ADE80' },
}

type GradientTextColors = 'blue' | 'orange' | 'green'

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
