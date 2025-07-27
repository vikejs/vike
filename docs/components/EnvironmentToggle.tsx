import React, { useState } from 'react'

type Environment = 'client' | 'server' | 'shared'

interface EnvironmentToggleProps {
  defaultEnvironment?: Environment
  onEnvironmentChange?: (environment: Environment) => void
  children: (environment: Environment) => React.ReactNode
}

export function EnvironmentToggle({
  defaultEnvironment = 'server',
  onEnvironmentChange,
  children,
}: EnvironmentToggleProps) {
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>(defaultEnvironment)

  const handleEnvironmentChange = (environment: Environment) => {
    setSelectedEnvironment(environment)
    onEnvironmentChange?.(environment)
  }

  const environments: { value: Environment; label: string; description: string; color: string }[] = [
    {
      value: 'server',
      label: 'Server',
      description: '+data.server.js',
      color: '#dc3545',
    },
    {
      value: 'client',
      label: 'Client',
      description: '+data.client.js',
      color: '#007bff',
    },
    {
      value: 'shared',
      label: 'Shared',
      description: '+data.js (both)',
      color: '#28a745',
    },
  ]

  return (
    <div className="environment-toggle">
      <div className="environment-tabs">
        {environments.map((env) => (
          <button
            key={env.value}
            onClick={() => handleEnvironmentChange(env.value)}
            className={`environment-tab ${selectedEnvironment === env.value ? 'active' : ''}`}
            style={{
              borderColor: selectedEnvironment === env.value ? env.color : 'transparent',
              color: selectedEnvironment === env.value ? env.color : '#666',
            }}
          >
            <div className="env-label">{env.label}</div>
            <div className="env-description">{env.description}</div>
          </button>
        ))}
      </div>
      <div className="environment-content">{children(selectedEnvironment)}</div>
      <style>{`
        .environment-toggle {
          margin: 1rem 0;
        }
        .environment-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e5e5e5;
        }
        .environment-tab {
          padding: 0.5rem 1rem;
          border: 2px solid transparent;
          border-radius: 6px 6px 0 0;
          background: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: center;
          min-width: 80px;
        }
        .environment-tab:hover {
          background-color: #f5f5f5;
        }
        .environment-tab.active {
          background-color: white;
          border-bottom-color: white;
        }
        .env-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .env-description {
          font-size: 0.75rem;
          opacity: 0.8;
          font-weight: normal;
        }
        .environment-content {
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
