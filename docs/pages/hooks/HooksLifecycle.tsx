export { HooksLifecycle }

import React, { useState, useEffect } from 'react'
import { Link } from '@brillout/docpress'
import { TextEnv } from './TextEnv'

interface HookInfo {
  name: string
  href: string
  env: 'server' | 'client' | 'server & client'
  description?: string
  providedBy?: ('vike-react' | 'vike-vue' | 'vike-solid')[]
  dataHooks?: ('default' | 'client' | 'shared')[]
}

const firstRenderHooks: HookInfo[] = [
  // Server-side hooks
  ...[
    { name: 'onCreateApp()', href: '/onCreateApp', providedBy: ['vike-vue'] },
    { name: 'renderPage()', href: '/renderPage' },
    { name: 'onBeforeRoute()', href: '/onBeforeRoute' },
    { name: 'Routing', href: '/routing', description: 'The routing executes your Route Functions (of all your pages).' },
    { name: 'onCreatePageContext()', href: '/onCreatePageContext' },
    { name: 'guard()', href: '/guard', dataHooks: ['default', 'shared'] },
    { name: 'data()', href: '/data', dataHooks: ['default', 'shared'] },
    { name: 'onData()', href: '/onData', dataHooks: ['default', 'shared'] },
    { name: 'onBeforeRender()', href: '/onBeforeRender', dataHooks: ['default', 'shared'] },
    { name: 'onBeforeRenderHtml()', href: '/onBeforeRenderHtml', providedBy: ['vike-react', 'vike-vue'] },
    { name: 'onRenderHtml()', href: '/onRenderHtml' },
    { name: 'onAfterRenderHtml()', href: '/onAfterRenderHtml', providedBy: ['vike-react', 'vike-vue'] },
  ].map(hook => ({ ...hook, env: 'server' as const })),

  // Client-side hooks
  ...[
    { name: 'onCreatePageContext()', href: '/onCreatePageContext' },
    { name: 'guard()', href: '/guard', dataHooks: ['client'] },
    { name: 'data()', href: '/data', dataHooks: ['client'] },
    { name: 'onData()', href: '/onData', dataHooks: ['client'] },
    { name: 'onBeforeRender()', href: '/onBeforeRender', dataHooks: ['client'] },
    { name: 'onCreateApp()', href: '/onCreateApp', providedBy: ['vike-vue'] },
    { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', providedBy: ['vike-react', 'vike-vue'] },
    { name: 'onRenderClient()', href: '/onRenderClient' },
    { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', providedBy: ['vike-react', 'vike-vue', 'vike-solid'] },
    { name: 'onHydrationEnd()', href: '/onHydrationEnd' },
  ].map(hook => ({ ...hook, env: 'client' as const })),
]

const clientNavigationHooks: HookInfo[] = [
  // Client-side hooks (first part)
  ...[
    { name: 'onPageTransitionStart()', href: '/onPageTransitionStart' },
    { name: 'onBeforeRoute()', href: '/onBeforeRoute' },
    { name: 'Routing', href: '/routing' },
    { name: 'onCreatePageContext()', href: '/onCreatePageContext' },
    { name: 'guard()', href: '/guard', dataHooks: ['client'] },
    { name: 'data()', href: '/data', dataHooks: ['client'] },
    { name: 'onData()', href: '/onData', dataHooks: ['client'] },
    { name: 'onBeforeRender()', href: '/onBeforeRender', dataHooks: ['client'] },
  ].map(hook => ({ ...hook, env: 'client' as const })),

  // Server-side hooks (for data fetching)
  ...[
    { name: 'onBeforeRoute()', href: '/onBeforeRoute', dataHooks: ['default', 'shared'] },
    { name: 'Routing', href: '/routing', description: 'The routing is executed twice: once for the client and once for the server.', dataHooks: ['default', 'shared'] },
    { name: 'onCreatePageContext()', href: '/onCreatePageContext', dataHooks: ['default', 'shared'] },
    { name: 'guard()', href: '/guard', dataHooks: ['default', 'shared'] },
    { name: 'data()', href: '/data', dataHooks: ['default', 'shared'] },
    { name: 'onBeforeRender()', href: '/onBeforeRender', dataHooks: ['default', 'shared'] },
  ].map(hook => ({ ...hook, env: 'server' as const })),

  // Client-side hooks (second part)
  ...[
    { name: 'onData()', href: '/onData', dataHooks: ['default', 'shared'] },
    { name: 'onRenderClient()', href: '/onRenderClient' },
    { name: 'onCreateApp()', href: '/onCreateApp', providedBy: ['vike-vue'] },
    { name: 'onBeforeRenderClient()', href: '/onBeforeRenderClient', providedBy: ['vike-react', 'vike-vue'] },
    { name: 'onAfterRenderClient()', href: '/onAfterRenderClient', providedBy: ['vike-react', 'vike-vue', 'vike-solid'] },
    { name: 'onPageTransitionEnd()', href: '/onPageTransitionEnd' },
  ].map(hook => ({ ...hook, env: 'client' as const })),
]

function HooksLifecycle() {
  const [selectedFramework, setSelectedFramework] = useState<'vike-react' | 'vike-vue' | 'vike-solid' | null>(null)
  const [dataHooks, setDataEnv] = useState<'default' | 'client' | 'shared'>('default')

  // Load from localStorage on mount
  useEffect(() => {
    const savedFramework = localStorage.getItem('vike-docs-selected-framework') as
      | 'vike-react'
      | 'vike-vue'
      | 'vike-solid'
      | null
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
    localStorage.setItem('vike-docs-data-env', dataHooks)
  }, [dataHooks])

  function getFilteredHooks(phase: 'first-render' | 'client-navigation') {
    const hooks = phase === 'first-render' ? firstRenderHooks : clientNavigationHooks
    return hooks.filter((hook) => shouldShowHook(hook, dataHooks, selectedFramework))
  }

  function renderHooksList(phase: 'first-render' | 'client-navigation', title: string) {
    const hooks = getFilteredHooks(phase)

    return (
      <div
        style={{
          marginBottom: '2rem',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#fafbfc',
        }}
      >
        <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>{title}</h4>
        <ol>
          {hooks.map((hook, index) => {
            const key = `${hook.name}-${hook.env}-${index}`

            return (
              <li key={key}>
                <TextEnv2>{hook.env}</TextEnv2> <Link href={hook.href}>{hook.name}</Link>
                {hook.description && (
                  <>
                    <br />
                    <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '1rem' }}>{hook.description}</span>
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
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}
      >
        <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Configuration</h4>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>UI Framework Extension:</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedFramework(null)}
              style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: selectedFramework === null ? '#007bff' : 'white',
                color: selectedFramework === null ? 'white' : 'black',
                cursor: 'pointer',
              }}
            >
              None
            </button>
            {(['vike-react', 'vike-vue', 'vike-solid'] as const).map((framework) => (
              <button
                key={framework}
                onClick={() => setSelectedFramework(framework)}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: selectedFramework === framework ? '#007bff' : 'white',
                  color: selectedFramework === framework ? 'white' : 'black',
                  cursor: 'pointer',
                }}
              >
                <code>{framework}</code>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Data Environment:</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'default', label: 'Default (server)' },
              { key: 'client', label: 'Client-only' },
              { key: 'shared', label: 'Shared (server + client)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDataEnv(key as any)}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: dataHooks === key ? '#007bff' : 'white',
                  color: dataHooks === key ? 'white' : 'black',
                  cursor: 'pointer',
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {renderHooksList('first-render', 'First Render')}
        {renderHooksList('client-navigation', 'Client-side Navigation')}
      </div>
    </div>
  )
}

function shouldShowHook(
  hook: HookInfo,
  dataHooks: 'default' | 'client' | 'shared',
  selectedFramework: 'vike-react' | 'vike-vue' | 'vike-solid' | null,
) {
  // If hook has dataHooks specified, it must include the current dataHooks
  // If no dataHooks specified, always show (hooks like onRenderClient, onPageTransitionStart, etc.)
  if (hook.dataHooks && !hook.dataHooks.includes(dataHooks)) return false

  // Framework filter
  if (hook.providedBy && !selectedFramework) return false
  if (hook.providedBy && selectedFramework && !hook.providedBy.includes(selectedFramework)) return false

  return true
}

function getEnvColor(text: string) {
  if (text.includes('server')) return '#d110ff'
  if (text.includes('client')) return '#3acd3a'
  return '#888'
}

function TextEnv2({ children }: { children: any }) {
  return <TextEnv style={{ fontWeight: 600, color: getEnvColor(children) }}>{children}</TextEnv>
}
