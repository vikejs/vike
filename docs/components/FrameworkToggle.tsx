import React, { useState } from 'react'

type Framework = 'react' | 'vue' | 'solid'

interface FrameworkToggleProps {
  defaultFramework?: Framework
  onFrameworkChange?: (framework: Framework) => void
  children: (framework: Framework) => React.ReactNode
}

export function FrameworkToggle({ defaultFramework = 'react', onFrameworkChange, children }: FrameworkToggleProps) {
  const [selectedFramework, setSelectedFramework] = useState<Framework>(defaultFramework)

  const handleFrameworkChange = (framework: Framework) => {
    setSelectedFramework(framework)
    onFrameworkChange?.(framework)
  }

  const frameworks: { value: Framework; label: string; color: string }[] = [
    { value: 'react', label: 'React', color: '#61dafb' },
    { value: 'vue', label: 'Vue', color: '#42b883' },
    { value: 'solid', label: 'Solid', color: '#2c4f7c' },
  ]

  return (
    <div className="framework-toggle">
      <div className="framework-tabs">
        {frameworks.map((framework) => (
          <button
            key={framework.value}
            onClick={() => handleFrameworkChange(framework.value)}
            className={`framework-tab ${selectedFramework === framework.value ? 'active' : ''}`}
            style={{
              borderColor: selectedFramework === framework.value ? framework.color : 'transparent',
              color: selectedFramework === framework.value ? framework.color : '#666',
            }}
          >
            {framework.label}
          </button>
        ))}
      </div>
      <div className="framework-content">{children(selectedFramework)}</div>
      <style>{`
        .framework-toggle {
          margin: 1rem 0;
        }
        .framework-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e5e5e5;
        }
        .framework-tab {
          padding: 0.5rem 1rem;
          border: 2px solid transparent;
          border-radius: 6px 6px 0 0;
          background: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .framework-tab:hover {
          background-color: #f5f5f5;
        }
        .framework-tab.active {
          background-color: white;
          border-bottom-color: white;
        }
        .framework-content {
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 0 0 6px 6px;
          border: 1px solid #e5e5e5;
          border-top: none;
        }
      `}</style>
    </div>
  )
}
