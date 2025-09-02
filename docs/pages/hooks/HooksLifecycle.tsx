export { HooksLifecycle }

import React, { useState, useEffect } from 'react'
import { Link } from '@brillout/docpress'
import { TextEnv } from './TextEnv'

interface HookInfo {
  name: string
  href: string
  env: 'server' | 'client'
  providedBy?: ('vike-react' | 'vike-vue' | 'vike-solid')[]
  dataHooks?: ('server' | 'client' | 'shared')[]
}

const routing = { name: 'Routing', href: '/routing' }
const onCreateApp = { name: 'onCreateApp()', href: '/onCreateApp', providedBy: ['vike-vue'] as const }
const onCreatePageContext = { name: 'onCreatePageContext()', href: '/onCreatePageContext' }
const onBeforeRoute = { name: 'onBeforeRoute()', href: '/onBeforeRoute' }
const guard = { name: 'guard()', href: '/guard' }
const data = { name: 'data()', href: '/data' }
const onData = { name: 'onData()', href: '/onData' }
const onBeforeRender = { name: 'onBeforeRender()', href: '/onBeforeRender' }
const onBeforeRenderClient = {
  name: 'onBeforeRenderClient()',
  href: '/onBeforeRenderClient',
  providedBy: ['vike-react', 'vike-vue'] as const,
}
const onAfterRenderClient = {
  name: 'onAfterRenderClient()',
  href: '/onAfterRenderClient',
  providedBy: ['vike-react', 'vike-vue', 'vike-solid'] as const,
}

const renderPage = { name: 'renderPage()', href: '/renderPage' }
const onBeforeRenderHtml = {
  name: 'onBeforeRenderHtml()',
  href: '/onBeforeRenderHtml',
  providedBy: ['vike-react', 'vike-vue'] as const,
}
const onRenderHtml = { name: 'onRenderHtml()', href: '/onRenderHtml' }
const onAfterRenderHtml = {
  name: 'onAfterRenderHtml()',
  href: '/onAfterRenderHtml',
  providedBy: ['vike-react', 'vike-vue'] as const,
}
const onRenderClient = { name: 'onRenderClient()', href: '/onRenderClient' }
const onHydrationEnd = { name: 'onHydrationEnd()', href: '/onHydrationEnd' }
const onPageTransitionStart = { name: 'onPageTransitionStart()', href: '/onPageTransitionStart' }
const onPageTransitionEnd = { name: 'onPageTransitionEnd()', href: '/onPageTransitionEnd' }

const firstRenderHooks: HookInfo[] = [
  // Server-side hooks
  ...(
    [
      onCreateApp,
      renderPage,
      onBeforeRoute,
      routing,
      onCreatePageContext,
      { ...guard, dataHooks: ['server', 'shared'] },
      { ...data, dataHooks: ['server', 'shared'] },
      { ...onData, dataHooks: ['server', 'shared'] },
      { ...onBeforeRender, dataHooks: ['server', 'shared'] },
      onBeforeRenderHtml,
      onRenderHtml,
      onAfterRenderHtml,
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'server' }) satisfies HookInfo),

  // Client-side hooks
  ...(
    [
      onCreatePageContext,
      { ...guard, dataHooks: ['client'] },
      { ...data, dataHooks: ['client'] },
      { ...onData, dataHooks: ['client'] },
      { ...onBeforeRender, dataHooks: ['client'] },
      onCreateApp,
      onBeforeRenderClient,
      onRenderClient,
      onAfterRenderClient,
      onHydrationEnd,
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'client' }) satisfies HookInfo),
]

const clientNavigationHooks: HookInfo[] = [
  // Client-side hooks (first part)
  ...(
    [
      onPageTransitionStart,
      onBeforeRoute,
      routing,
      onCreatePageContext,
      { ...guard, dataHooks: ['client'] },
      { ...data, dataHooks: ['client'] },
      { ...onData, dataHooks: ['client'] },
      { ...onBeforeRender, dataHooks: ['client'] },
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'client' }) satisfies HookInfo),

  // Server-side hooks (for data fetching)
  ...(
    [
      { ...onBeforeRoute, dataHooks: ['server', 'shared'] },
      { ...routing, dataHooks: ['server', 'shared'] },
      { ...onCreatePageContext, dataHooks: ['server', 'shared'] },
      { ...guard, dataHooks: ['server', 'shared'] },
      { ...data, dataHooks: ['server', 'shared'] },
      { ...onBeforeRender, dataHooks: ['server', 'shared'] },
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'server' }) satisfies HookInfo),

  // Client-side hooks (second part)
  ...(
    [
      { ...onData, dataHooks: ['server', 'shared'] },
      onRenderClient,
      onCreateApp,
      onBeforeRenderClient,
      onAfterRenderClient,
      onPageTransitionEnd,
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'client' }) satisfies HookInfo),
]

function HooksLifecycle() {
  const [selectedFramework, setSelectedFramework] = useState<'vike-react' | 'vike-vue' | 'vike-solid' | null>(null)
  const [dataHooks, setDataEnv] = useState<'server' | 'client' | 'shared'>('server')

  // Load from localStorage on mount
  useEffect(() => {
    const savedFramework = localStorage.getItem('vike-docs-selected-framework') as
      | 'vike-react'
      | 'vike-vue'
      | 'vike-solid'
      | null
    const savedDataEnv = localStorage.getItem('vike-docs-data-env') as 'server' | 'client' | 'shared' | null

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
              { key: 'server' as const, label: 'Server-only' },
              { key: 'client' as const, label: 'Client-only' },
              { key: 'shared' as const, label: 'Shared (server + client)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDataEnv(key)}
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
  dataHooks: 'server' | 'client' | 'shared',
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
