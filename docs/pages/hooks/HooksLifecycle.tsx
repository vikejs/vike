export { HooksLifecycle }

import React, { useState, useEffect } from 'react'
import { Link } from '@brillout/docpress'
import { TextEnv } from './TextEnv'
import { Box } from '../../components'

interface HookInfo {
  name: string
  href: string
  env: 'server' | 'client'
  providedBy?: ('vike-react' | 'vike-vue' | 'vike-solid')[]
  hooksEnv?: ('server' | 'client' | 'shared')[]
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
      { ...guard, hooksEnv: ['server', 'shared'] },
      { ...data, hooksEnv: ['server', 'shared'] },
      { ...onData, hooksEnv: ['server', 'shared'] },
      { ...onBeforeRender, hooksEnv: ['server', 'shared'] },
      onBeforeRenderHtml,
      onRenderHtml,
      onAfterRenderHtml,
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'server' }) satisfies HookInfo),

  // Client-side hooks
  ...(
    [
      onCreatePageContext,
      { ...guard, hooksEnv: ['client'] },
      { ...data, hooksEnv: ['client'] },
      { ...onData, hooksEnv: ['client'] },
      { ...onBeforeRender, hooksEnv: ['client'] },
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
      { ...guard, hooksEnv: ['client'] },
      { ...data, hooksEnv: ['client'] },
      { ...onData, hooksEnv: ['client'] },
      { ...onBeforeRender, hooksEnv: ['client'] },
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'client' }) satisfies HookInfo),

  // Server-side hooks (for data fetching)
  ...(
    [
      { ...onBeforeRoute, hooksEnv: ['server', 'shared'] },
      { ...routing, hooksEnv: ['server', 'shared'] },
      { ...onCreatePageContext, hooksEnv: ['server', 'shared'] },
      { ...guard, hooksEnv: ['server', 'shared'] },
      { ...data, hooksEnv: ['server', 'shared'] },
      { ...onBeforeRender, hooksEnv: ['server', 'shared'] },
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'server' }) satisfies HookInfo),

  // Client-side hooks (second part)
  ...(
    [
      { ...onData, hooksEnv: ['server', 'shared'] },
      onRenderClient,
      onCreateApp,
      onBeforeRenderClient,
      onAfterRenderClient,
      onPageTransitionEnd,
    ] satisfies Omit<HookInfo, 'env'>[]
  ).map((hook) => ({ ...hook, env: 'client' }) satisfies HookInfo),
]

const vikeDocsSelectedFramework = 'vike-docs:selected-framework'
const vikeDocsHooksEnv = 'vike-docs:hooks-env'
function HooksLifecycle() {
  const [selectedFramework, setSelectedFramework] = useState<'vike-react' | 'vike-vue' | 'vike-solid' | null>(null)
  const [hooksEnv, setDataEnv] = useState<'server' | 'client' | 'shared'>('server')

  // Load from localStorage on mount
  useEffect(() => {
    const savedFramework = localStorage.getItem(vikeDocsSelectedFramework) as
      | 'vike-react'
      | 'vike-vue'
      | 'vike-solid'
      | null
    const savedDataEnv = localStorage.getItem(vikeDocsHooksEnv) as 'server' | 'client' | 'shared' | null

    if (savedFramework) setSelectedFramework(savedFramework)
    if (savedDataEnv) setDataEnv(savedDataEnv)
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    if (selectedFramework) {
      localStorage.setItem(vikeDocsSelectedFramework, selectedFramework)
    } else {
      localStorage.removeItem(vikeDocsSelectedFramework)
    }
  }, [selectedFramework])

  useEffect(() => {
    localStorage.setItem(vikeDocsHooksEnv, hooksEnv)
  }, [hooksEnv])

  function getFilteredHooks(phase: 'first-render' | 'client-navigation') {
    const hooks = phase === 'first-render' ? firstRenderHooks : clientNavigationHooks
    return hooks.filter((hook) => shouldShowHook(hook, hooksEnv, selectedFramework))
  }

  function renderHooksList(phase: 'first-render' | 'client-navigation', title: string) {
    const hooks = getFilteredHooks(phase)

    return (
      <LifecycleBox>
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
      </LifecycleBox>
    )
  }

  return (
    <div>
      <LifecycleBox>
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
                {framework}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            <Link href="#environment">Hooks environment</Link>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'server' as const, label: 'Server-only' },
              { key: 'client' as const, label: 'Client-only' },
              { key: 'shared' as const, label: 'Server & client' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDataEnv(key)}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: hooksEnv === key ? '#007bff' : 'white',
                  color: hooksEnv === key ? 'white' : 'black',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </LifecycleBox>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        <div>
          <LifecycleBox>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>Server start</h4>
            <ol>
              <li>
                <Link href="/onCreateGlobalContext#lifecycle">
                  <code>onCreateGlobalContext()</code>
                </Link>
              </li>
            </ol>
          </LifecycleBox>
          {renderHooksList('first-render', 'First Render')}
        </div>
        <div>{renderHooksList('client-navigation', 'Client-side Navigation')}</div>
      </div>
    </div>
  )
}

function LifecycleBox({
  style,
  children,
}: {
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <Box
      style={{
        padding: '10px 20px',
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </Box>
  )
}

function shouldShowHook(
  hook: HookInfo,
  hooksEnv: 'server' | 'client' | 'shared',
  selectedFramework: 'vike-react' | 'vike-vue' | 'vike-solid' | null,
) {
  // If hook has hooksEnv specified, it must include the current hooksEnv
  // If no hooksEnv specified, always show (hooks like onRenderClient, onPageTransitionStart, etc.)
  if (hook.hooksEnv && !hook.hooksEnv.includes(hooksEnv)) return false

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
