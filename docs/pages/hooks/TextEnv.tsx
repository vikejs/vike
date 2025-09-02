export { TextEnv }
export { TextEnv2 }
export { HooksLifecycle }

import React, { useState, useEffect } from 'react'
import { Link } from '@brillout/docpress'

function TextEnv({ children, style }: { children: any; style?: any }) {
  return <span style={{ color: '#888', fontSize: '0.94em', verticalAlign: 'middle', ...style }}>{children}</span>
}
function TextEnv2({ children }: { children: any }) {
  // Color code based on environment
  const getEnvColor = (text: string) => {
    if (text.includes('server')) return '#d110ff'
    if (text.includes('client')) return '#3acd3a'
    return '#888'
  }

  return <TextEnv style={{ fontWeight: 600, color: getEnvColor(children) }}>{children}</TextEnv>
}

interface HookInfo {
  name: string
  href: string
  env: 'server' | 'client' | 'server & client'
  description?: string
  providedBy?: ('vike-react' | 'vike-vue' | 'vike-solid')[]
  dataEnv?: ('default' | 'client' | 'shared')[]
  phase?: ('first-render' | 'client-navigation')[]
}

const allHooks: HookInfo[] = [
  // First render - server
  { name: 'onCreateApp()', href: '/onCreateApp', env: 'server', providedBy: ['vike-vue'], phase: ['first-render'] },
  { name: 'renderPage()', href: '/renderPage', env: 'server', phase: ['first-render'] },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server', phase: ['first-render'] },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing executes your Route Functions (of all your pages).', phase: ['first-render'] },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server', phase: ['first-render'] },
  { name: 'guard()', href: '/guard', env: 'server', phase: ['first-render'], dataEnv: ['default', 'shared'] },
  { name: 'data()', href: '/data', env: 'server', phase: ['first-render'], dataEnv: ['default', 'shared'] },
  { name: 'onData()', href: '/onData', env: 'server', phase: ['first-render'], dataEnv: ['default', 'shared'] },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', phase: ['first-render'], dataEnv: ['default', 'shared'] },
  { name: 'onBeforeRenderHtml()', href: '/onBeforeRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'], phase: ['first-render'] },
  { name: 'onRenderHtml()', href: '/onRenderHtml', env: 'server', phase: ['first-render'] },
  { name: 'onAfterRenderHtml()', href: '/onAfterRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'], phase: ['first-render'] },

  // First render - client
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client', phase: ['first-render'] },
  { name: 'guard()', href: '/guard', env: 'client', phase: ['first-render'], dataEnv: ['client'] },
  { name: 'data()', href: '/data', env: 'client', phase: ['first-render'], dataEnv: ['client'] },
  { name: 'onData()', href: '/onData', env: 'client', phase: ['first-render'], dataEnv: ['client'] },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'client', phase: ['first-render'], dataEnv: ['client'] },
  { name: 'onCreateApp()', href: '/onCreateApp', env: 'client', providedBy: ['vike-vue'], phase: ['first-render'] },
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'], phase: ['first-render'] },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client', phase: ['first-render'] },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'], phase: ['first-render'] },
  { name: 'onHydrationEnd()', href: '/onHydrationEnd', env: 'client', phase: ['first-render'] },

  // Client navigation
  { name: 'onPageTransitionStart()', href: '/onPageTransitionStart', env: 'client', phase: ['client-navigation'] },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'client', phase: ['client-navigation'] },
  { name: 'Routing', href: '/routing', env: 'client', phase: ['client-navigation'] },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client', phase: ['client-navigation'] },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server', phase: ['client-navigation'], dataEnv: ['default', 'shared'] },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing is executed twice: once for the client and once for the server.', phase: ['client-navigation'], dataEnv: ['default', 'shared'] },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server', phase: ['client-navigation'], dataEnv: ['default', 'shared'] },
  { name: 'guard()', href: '/guard', env: 'server', phase: ['client-navigation'], dataEnv: ['default', 'shared'] },
  { name: 'data()', href: '/data', env: 'server', phase: ['client-navigation'], dataEnv: ['default', 'shared'] },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', phase: ['client-navigation'], dataEnv: ['default', 'shared'] },
  { name: 'onData()', href: '/onData', env: 'client', phase: ['client-navigation'], dataEnv: ['default', 'shared'] },
  { name: 'guard()', href: '/guard', env: 'client', phase: ['client-navigation'], dataEnv: ['client'] },
  { name: 'data()', href: '/data', env: 'client', phase: ['client-navigation'], dataEnv: ['client'] },
  { name: 'onData()', href: '/onData', env: 'client', phase: ['client-navigation'], dataEnv: ['client'] },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'client', phase: ['client-navigation'], dataEnv: ['client'] },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client', phase: ['client-navigation'] },
  { name: 'onCreateApp()', href: '/onCreateApp', env: 'client', providedBy: ['vike-vue'], phase: ['client-navigation'] },
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'], phase: ['client-navigation'] },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'], phase: ['client-navigation'] },
  { name: 'onPageTransitionEnd()', href: '/onPageTransitionEnd', env: 'client', phase: ['client-navigation'] },
]



function HooksLifecycle() {
  const [selectedFramework, setSelectedFramework] = useState<'vike-react' | 'vike-vue' | 'vike-solid' | null>(null)
  const [dataEnv, setDataEnv] = useState<'default' | 'client' | 'shared'>('default')

  // Load from localStorage on mount
  useEffect(() => {
    const savedFramework = localStorage.getItem('vike-docs-selected-framework') as 'vike-react' | 'vike-vue' | 'vike-solid' | null
    const savedDataEnv = localStorage.getItem('vike-docs-data-env') as 'default' | 'client' | 'shared' | null

    if (savedFramework) setSelectedFramework(savedFramework)
    if (savedDataEnv) setDataEnv(savedDataEnv)
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    if (selectedFramework) {
      localStorage.setItem('vike-docs-selected-framework', selectedFramework)
    } else {
      localStorage.removeItem('vike-docs-selected-framework')
    }
  }, [selectedFramework])

  useEffect(() => {
    localStorage.setItem('vike-docs-data-env', dataEnv)
  }, [dataEnv])

  const getFilteredHooks = (phase: 'first-render' | 'client-navigation') => {
    return allHooks.filter(hook => {
      // Phase filter
      if (!hook.phase?.includes(phase)) return false

      // Data environment filter
      if (hook.dataEnv && !hook.dataEnv.includes(dataEnv)) return false

      // Framework filter
      if (hook.providedBy && !selectedFramework) return false
      if (hook.providedBy && selectedFramework && !hook.providedBy.includes(selectedFramework)) return false

      return true
    })
  }

  const isHookGrayedOut = (hook: HookInfo) => {
    // Core hooks (no providedBy) are never grayed out
    if (!hook.providedBy) return false
    // Extension hooks are grayed out if no framework is selected
    if (!selectedFramework) return true
    // Extension hooks are grayed out if the selected framework doesn't provide them
    return !hook.providedBy.includes(selectedFramework)
  }

  const renderHooksList = (phase: 'first-render' | 'client-navigation', title: string) => {
    const hooks = getFilteredHooks(phase)

    return (
      <div style={{
        marginBottom: '2rem',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#fafbfc'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>{title}</h4>
        <ol>
          {hooks.map((hook, index) => {
            const isGrayed = isHookGrayedOut(hook)
            const key = `${hook.name}-${hook.env}-${index}`

            return (
              <li key={key} style={{
                opacity: isGrayed ? 0.4 : 1,
              }}>
                <TextEnv2>{hook.env}</TextEnv2>{' '}
                <Link href={hook.href}>{hook.name}</Link>
                {hook.description && (
                  <>
                    <br />
                    <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '1rem' }}>
                      {hook.description}
                    </span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Configuration</h4>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            UI Framework Extension:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedFramework(null)}
              style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: selectedFramework === null ? '#007bff' : 'white',
                color: selectedFramework === null ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              None
            </button>
            {(['vike-react', 'vike-vue', 'vike-solid'] as const).map(framework => (
              <button
                key={framework}
                onClick={() => setSelectedFramework(framework)}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: selectedFramework === framework ? '#007bff' : 'white',
                  color: selectedFramework === framework ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                <code>{framework}</code>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Data Environment:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'default', label: 'Default (server)' },
              { key: 'client', label: 'Client-only' },
              { key: 'shared', label: 'Shared (server + client)' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDataEnv(key as any)}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: dataEnv === key ? '#007bff' : 'white',
                  color: dataEnv === key ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.85em', color: '#666', marginTop: '0.5rem' }}>
            See <Link href="/data#environment">data() environment configuration</Link> for details.
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {renderHooksList('first-render', 'First Render')}
        {renderHooksList('client-navigation', 'Client-side Navigation')}
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <p style={{ margin: 0, fontSize: '0.9em' }}>
          <strong>Note:</strong> Grayed out hooks are not available in your current configuration.
          Extension hooks require the corresponding UI framework extension to be installed.
        </p>
      </div>
    </div>
  )
}
