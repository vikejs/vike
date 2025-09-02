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
  dataEnv?: 'default' | 'client' | 'shared'
}

// First render hooks (server-side first, then client-side)
const firstRenderHooks: HookInfo[] = [
  // Server-side hooks (matching documented order)
  { name: 'renderPage()', href: '/renderPage', env: 'server' },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server' },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing executes your Route Functions (of all your pages).' },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server' },
  { name: 'guard()', href: '/guard', env: 'server', dataEnv: 'default' },
  { name: 'data()', href: '/data', env: 'server', dataEnv: 'default' },
  { name: 'onData()', href: '/onData', env: 'server', dataEnv: 'default' },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', dataEnv: 'default' },
  { name: 'onRenderHtml()', href: '/onRenderHtml', env: 'server' },

  // Client-side hooks (matching documented order)
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client' },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client' },
  { name: 'onHydrationEnd()', href: '/onHydrationEnd', env: 'client' },
]

// Client-side navigation hooks
const clientNavigationHooks: HookInfo[] = [
  { name: 'onPageTransitionStart()', href: '/onPageTransitionStart', env: 'client' },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'client' },
  { name: 'Routing', href: '/routing', env: 'client' },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client' },

  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server' },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing is executed twice: once for the client and once for the server.' },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server' },
  { name: 'guard()', href: '/guard', env: 'server', dataEnv: 'default' },
  { name: 'data()', href: '/data', env: 'server', dataEnv: 'default' },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', dataEnv: 'default' },
  { name: 'onData()', href: '/onData', env: 'client', dataEnv: 'default' },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client' },
  { name: 'onPageTransitionEnd()', href: '/onPageTransitionEnd', env: 'client' },
]

// Extension hooks to add when frameworks are selected
const extensionHooksFirstRender: HookInfo[] = [
  { name: 'onBeforeRenderHtml()', href: '/onBeforeRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'] },
  { name: 'onAfterRenderHtml()', href: '/onAfterRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'] },
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'] },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'] },
]

const extensionHooksClientNavigation: HookInfo[] = [
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'] },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'] },
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

    // Add extension hooks if framework is selected
    if (selectedFramework) {
      const extensionHooks = phase === 'first-render' ? extensionHooksFirstRender : extensionHooksClientNavigation
      const availableExtensionHooks = extensionHooks.filter(hook =>
        hook.providedBy?.includes(selectedFramework)
      )

      // Insert extension hooks in the right positions
      availableExtensionHooks.forEach(extHook => {
        if (extHook.name === 'onBeforeRenderHtml()') {
          const index = hooks.findIndex(h => h.name === 'onRenderHtml()')
          if (index !== -1) hooks.splice(index, 0, extHook)
        } else if (extHook.name === 'onAfterRenderHtml()') {
          const index = hooks.findIndex(h => h.name === 'onRenderHtml()')
          if (index !== -1) hooks.splice(index + 1, 0, extHook)
        } else if (extHook.name === 'onBeforeRenderClient()') {
          const index = hooks.findIndex(h => h.name === 'onRenderClient()')
          if (index !== -1) hooks.splice(index, 0, extHook)
        } else if (extHook.name === 'onAfterRenderClient()') {
          const index = hooks.findIndex(h => h.name === 'onRenderClient()')
          if (index !== -1) hooks.splice(index + 1, 0, extHook)
        }
      })
    }


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
