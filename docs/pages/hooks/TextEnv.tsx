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
  order: number
  phase: 'first-render' | 'client-navigation'
}

const coreHooks: HookInfo[] = [
  // First render - server side
  { name: 'renderPage()', href: '/renderPage', env: 'server', isCore: true, order: 1, phase: 'first-render' },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server', isCore: true, order: 2, phase: 'first-render' },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing executes your Route Functions (of all your pages).', isCore: true, order: 3, phase: 'first-render' },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server', isCore: true, order: 4, phase: 'first-render' },
  { name: 'guard()', href: '/guard', env: 'server', isCore: true, order: 5, phase: 'first-render', dataEnv: 'default' },
  { name: 'data()', href: '/data', env: 'server', isCore: true, order: 6, phase: 'first-render', dataEnv: 'default' },
  { name: 'onData()', href: '/onData', env: 'server', isCore: true, order: 7, phase: 'first-render', dataEnv: 'default' },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', isCore: true, order: 8, phase: 'first-render', dataEnv: 'default' },
  { name: 'onRenderHtml()', href: '/onRenderHtml', env: 'server', isCore: true, order: 9, phase: 'first-render' },

  // First render - client side
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client', isCore: true, order: 10, phase: 'first-render' },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client', isCore: true, order: 11, phase: 'first-render' },
  { name: 'onHydrationEnd()', href: '/onHydrationEnd', env: 'client', isCore: true, order: 12, phase: 'first-render' },

  // Client navigation
  { name: 'onPageTransitionStart()', href: '/onPageTransitionStart', env: 'client', isCore: true, order: 1, phase: 'client-navigation' },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'client', isCore: true, order: 2, phase: 'client-navigation' },
  { name: 'Routing', href: '/routing', env: 'client', isCore: true, order: 3, phase: 'client-navigation' },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'client', isCore: true, order: 4, phase: 'client-navigation' },
  { name: 'onBeforeRoute()', href: '/onBeforeRoute', env: 'server', isCore: true, order: 5, phase: 'client-navigation' },
  { name: 'Routing', href: '/routing', env: 'server', description: 'The routing is executed twice: once for the client and once for the server.', isCore: true, order: 6, phase: 'client-navigation' },
  { name: 'onCreatePageContext()', href: '/onCreatePageContext', env: 'server', isCore: true, order: 7, phase: 'client-navigation' },
  { name: 'guard()', href: '/guard', env: 'server', isCore: true, order: 8, phase: 'client-navigation', dataEnv: 'default' },
  { name: 'data()', href: '/data', env: 'server', isCore: true, order: 9, phase: 'client-navigation', dataEnv: 'default' },
  { name: 'onBeforeRender()', href: '/onBeforeRender', env: 'server', isCore: true, order: 10, phase: 'client-navigation', dataEnv: 'default' },
  { name: 'onData()', href: '/onData', env: 'client', isCore: true, order: 11, phase: 'client-navigation', dataEnv: 'default' },
  { name: 'onRenderClient()', href: '/onRenderClient', env: 'client', isCore: true, order: 12, phase: 'client-navigation' },
  { name: 'onPageTransitionEnd()', href: '/onPageTransitionEnd', env: 'client', isCore: true, order: 13, phase: 'client-navigation' },
]

const extensionHooks: HookInfo[] = [
  // vike-react hooks
  { name: 'onBeforeRenderHtml()', href: '/onBeforeRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'], order: 8.5, phase: 'first-render' },
  { name: 'onAfterRenderHtml()', href: '/onAfterRenderHtml', env: 'server', providedBy: ['vike-react', 'vike-vue'], order: 9.5, phase: 'first-render' },
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'], order: 10.5, phase: 'first-render' },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'], order: 11.5, phase: 'first-render' },

  // vike-vue specific
  { name: 'onCreateApp()', href: '/onCreateApp', env: 'server & client', providedBy: ['vike-vue'], order: 0.5, phase: 'first-render' },

  // Client navigation extension hooks
  { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue'], order: 11.5, phase: 'client-navigation' },
  { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', env: 'client', providedBy: ['vike-react', 'vike-vue', 'vike-solid'], order: 12.5, phase: 'client-navigation' },
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
    let hooks = [...coreHooks.filter(h => h.phase === phase)]

    // Add extension hooks if framework is selected
    if (selectedFramework) {
      hooks.push(...extensionHooks.filter(h =>
        h.phase === phase && h.providedBy?.includes(selectedFramework)
      ))
    }

    // Filter based on data environment
    if (dataEnv !== 'default') {
      hooks = hooks.map(hook => {
        if (hook.dataEnv === 'default' && (hook.name === 'guard()' || hook.name === 'data()' || hook.name === 'onData()' || hook.name === 'onBeforeRender()')) {
          if (dataEnv === 'client') {
            // Move these hooks to client-side
            if (hook.phase === 'first-render') {
              return { ...hook, env: 'client' as const, order: hook.name === 'guard()' ? 10.1 : hook.name === 'data()' ? 10.2 : hook.name === 'onData()' ? 10.3 : 10.4 }
            } else {
              return { ...hook, env: 'client' as const, order: hook.name === 'guard()' ? 4.1 : hook.name === 'data()' ? 4.2 : hook.name === 'onData()' ? 4.3 : 4.4 }
            }
          }
          // For shared, keep server-side but also add client-side versions for navigation
        }
        return hook
      })

      // Remove server-side data hooks for client-only mode in first render
      if (dataEnv === 'client' && phase === 'first-render') {
        hooks = hooks.filter(hook =>
          !(hook.dataEnv === 'default' && hook.env === 'server' &&
            ['guard()', 'data()', 'onData()', 'onBeforeRender()'].includes(hook.name))
        )
      }
    }

    return hooks.sort((a, b) => a.order - b.order)
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
