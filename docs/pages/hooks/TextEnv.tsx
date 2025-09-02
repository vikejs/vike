export { TextEnv }
export { TextEnv2 }
export { HooksLifecycle }

import React, { useState, useEffect } from 'react'
import { Link } from '@brillout/docpress'

function TextEnv({ children, style }: { children: any; style?: any }) {
  return <span style={{ color: '#888', fontSize: '0.94em', verticalAlign: 'middle', ...style }}>{children}</span>
}
function TextEnv2({ children }: { children: any }) {
  return <TextEnv style={{ fontWeight: 600 }}>{children}</TextEnv>
}

interface HookInfo {
  name: string
  href: string
  env: 'server' | 'client' | 'server & client'
  description?: string
  providedBy?: ('vike-react' | 'vike-vue' | 'vike-solid')[]
  isCore?: boolean
  dataEnv?: 'default' | 'client' | 'shared'
}

// First render hooks (server-side first, then client-side)
const firstRenderHooks: HookInfo[] = [
  // Server-side hooks
  { name: 'onCreateApp()', href: '/onCreateApp', env: 'server', providedBy: ['vike-vue'] },
  { name: 'renderPage()', href: '/renderPage', env: 'server', isCore: true },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server', isCore: true },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing executes your Route Functions (of all your pages).', isCore: true },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server', isCore: true },
  { name: 'guard()', href: '/guard', env: 'server', isCore: true, dataEnv: 'default' },
  { name: 'data()', href: '/data', env: 'server', isCore: true, dataEnv: 'default' },
  { name: 'onData()', href: '/onData', env: 'server', isCore: true, dataEnv: 'default' },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', isCore: true, dataEnv: 'default' },
  { name: 'onBeforeRenderHtml()', href: '/onBeforeRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'] },
  { name: 'onRenderHtml()', href: '/onRenderHtml', env: 'server', isCore: true },
  { name: 'onAfterRenderHtml()', href: '/onAfterRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'] },

  // Client-side hooks
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client', isCore: true },
  { name: 'onCreateApp()', href: '/onCreateApp', env: 'client', providedBy: ['vike-vue'] },
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'] },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client', isCore: true },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'] },
  { name: 'onHydrationEnd()', href: '/onHydrationEnd', env: 'client', isCore: true },
]

// Client-side navigation hooks
const clientNavigationHooks: HookInfo[] = [
  { name: 'onPageTransitionStart()', href: '/onPageTransitionStart', env: 'client', isCore: true },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'client', isCore: true },
  { name: 'Routing', href: '/routing', env: 'client', isCore: true },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client', isCore: true },
  { name: 'onCreateApp()', href: '/onCreateApp', env: 'client', providedBy: ['vike-vue'] },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server', isCore: true },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing is executed twice: once for the client and once for the server.', isCore: true },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server', isCore: true },
  { name: 'guard()', href: '/guard', env: 'server', isCore: true, dataEnv: 'default' },
  { name: 'data()', href: '/data', env: 'server', isCore: true, dataEnv: 'default' },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', isCore: true, dataEnv: 'default' },
  { name: 'onData()', href: '/onData', env: 'client', isCore: true, dataEnv: 'default' },
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'] },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client', isCore: true },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'] },
  { name: 'onPageTransitionEnd()', href: '/onPageTransitionEnd', env: 'client', isCore: true },
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
    // Start with the appropriate base hooks
    let hooks = [...(phase === 'first-render' ? firstRenderHooks : clientNavigationHooks)]

    // Filter out extension hooks that aren't available for the selected framework
    hooks = hooks.filter(hook => {
      if (hook.isCore) return true
      if (!selectedFramework) return false
      return hook.providedBy?.includes(selectedFramework) || false
    })

    // Adjust hooks based on data environment
    if (dataEnv !== 'default') {
      const dataHookNames = ['guard()', 'data()', 'onData()', 'onBeforeRender()']

      if (dataEnv === 'client') {
        // For client-only mode, move data hooks to client-side
        hooks = hooks.map(hook => {
          if (hook.dataEnv === 'default' && dataHookNames.includes(hook.name)) {
            return { ...hook, env: 'client' as const }
          }
          return hook
        })

        // Remove server-side data hooks for client-only mode in first render
        if (phase === 'first-render') {
          hooks = hooks.filter(hook =>
            !(hook.dataEnv === 'default' && hook.env === 'server' && dataHookNames.includes(hook.name))
          )

          // Move client-side data hooks to after onCreatePageContext (client)
          const clientDataHooks = hooks.filter(hook =>
            hook.dataEnv === 'default' && hook.env === 'client' && dataHookNames.includes(hook.name)
          )
          const otherHooks = hooks.filter(hook =>
            !(hook.dataEnv === 'default' && hook.env === 'client' && dataHookNames.includes(hook.name))
          )

          // Find the index of client onCreatePageContext
          const clientPageContextIndex = otherHooks.findIndex(h =>
            h.name === 'onCreatePageContext()' && h.env === 'client'
          )

          if (clientPageContextIndex !== -1) {
            // Insert data hooks after client onCreatePageContext
            hooks = [
              ...otherHooks.slice(0, clientPageContextIndex + 1),
              ...clientDataHooks,
              ...otherHooks.slice(clientPageContextIndex + 1)
            ]
          } else {
            hooks = [...otherHooks, ...clientDataHooks]
          }
        }
      }
      // For shared mode, keep the hooks as-is (they run on both sides)
    }

    return hooks
  }

  const isHookGrayedOut = (hook: HookInfo) => {
    if (hook.isCore) return false
    if (!selectedFramework) return true
    return !hook.providedBy?.includes(selectedFramework)
  }

  const renderHooksList = (phase: 'first-render' | 'client-navigation', title: string) => {
    const hooks = getFilteredHooks(phase)

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h4>{title}</h4>
        <ol>
          {hooks.map((hook, index) => {
            const isGrayed = isHookGrayedOut(hook)
            const key = `${hook.name}-${hook.env}-${hook.order}`

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

      {renderHooksList('first-render', 'First Render')}
      {renderHooksList('client-navigation', 'Client-side Navigation')}

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
