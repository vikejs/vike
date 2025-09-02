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

// Core hooks (always exist - based on configDefinitionsBuiltIn)
const routing = { name: 'Routing', href: '/routing' }
const onRenderHtml = { name: 'onRenderHtml', href: '/onRenderHtml' }
const onRenderClient = { name: 'onRenderClient', href: '/onRenderClient' }

// Built-in hooks (from HookNamePage and HookNameGlobal types)
const onCreateGlobalContext = { name: 'onCreateGlobalContext', href: '/onCreateGlobalContext' }
const onBeforeRoute = { name: 'onBeforeRoute', href: '/onBeforeRoute' }
const onCreatePageContext = { name: 'onCreatePageContext', href: '/onCreatePageContext' }
const guard = { name: 'guard', href: '/guard' }
const data = { name: 'data', href: '/data' }
const onData = { name: 'onData', href: '/onData' }
const onBeforeRender = { name: 'onBeforeRender', href: '/onBeforeRender' }
const route = { name: 'route', href: '/route-function' }
const onHydrationEnd = { name: 'onHydrationEnd', href: '/onHydrationEnd' }
const onPageTransitionStart = { name: 'onPageTransitionStart', href: '/onPageTransitionStart' }
const onPageTransitionEnd = { name: 'onPageTransitionEnd', href: '/onPageTransitionEnd' }
const onBeforePrerenderStart = { name: 'onBeforePrerenderStart', href: '/onBeforePrerenderStart' }

// Framework-provided hooks (not in built-in types - provided by extensions)
const onCreateApp = { name: 'onCreateApp', href: '/onCreateApp', providedBy: ['vike-vue'] as const }
const onBeforeRenderHtml = {
  name: 'onBeforeRenderHtml',
  href: '/onBeforeRenderHtml',
  providedBy: ['vike-react', 'vike-vue'] as const,
}
const onAfterRenderHtml = {
  name: 'onAfterRenderHtml',
  href: '/onAfterRenderHtml',
  providedBy: ['vike-react', 'vike-vue'] as const,
}
const onBeforeRenderClient = {
  name: 'onBeforeRenderClient',
  href: '/onBeforeRenderClient',
  providedBy: ['vike-react', 'vike-vue'] as const,
}
const onAfterRenderClient = {
  name: 'onAfterRenderClient',
  href: '/onAfterRenderClient',
  providedBy: ['vike-react', 'vike-vue', 'vike-solid'] as const,
}



const firstRenderHooks: HookInfo[] = [
  // Server-side hooks (based on renderPageNominal execution order)
  ...(
    [
      onCreateGlobalContext,
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

  // Client-side hooks (hydration/first render based on renderPageClientSide)
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
function HooksLifecycle() {
  const [selectedFramework, setSelectedFramework] = useState<'vike-react' | 'vike-vue' | 'vike-solid' | null>(null)
  const [selectedHooks, setSelectedHooks] = useState<Set<string>>(new Set([
    '+data.js',
    'onRenderHtml',
    'onRenderClient',
    'onCreatePageContext',
  ]))

  // Load from localStorage on mount
  useEffect(() => {
    const savedFramework = localStorage.getItem(vikeDocsSelectedFramework) as
      | 'vike-react'
      | 'vike-vue'
      | 'vike-solid'
      | null
    const savedHooks = localStorage.getItem('vike-docs:selected-hooks')

    if (savedFramework) setSelectedFramework(savedFramework)
    if (savedHooks) {
      try {
        const hooksArray = JSON.parse(savedHooks)
        setSelectedHooks(new Set(hooksArray))
      } catch (e) {
        // Fallback to default
        setSelectedHooks(new Set([
          '+data.js',
          'onRenderHtml',
          'onRenderClient',
          'onCreatePageContext',
        ]))
      }
    }
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
    localStorage.setItem('vike-docs:selected-hooks', JSON.stringify(Array.from(selectedHooks)))
  }, [selectedHooks])

  // Define all available hooks (based on comprehensive codebase analysis)
  const allHooks = [
    // + file hooks with environment variants (these are file patterns, not hook names)
    '+data.js',
    '+data.client.js',
    '+data.shared.js',
    '+onBeforeRender.js',
    '+onBeforeRender.client.js',
    '+onBeforeRender.shared.js',
    '+guard.js',
    '+guard.client.js',
    '+guard.shared.js',
    '+route.js',
    '+onData.js',

    // Built-in hooks (from HookNamePage and HookNameGlobal types)
    'onHydrationEnd',
    'onBeforePrerenderStart',
    'onBeforeRender',
    'onPageTransitionStart',
    'onPageTransitionEnd',
    'onRenderHtml',
    'onRenderClient',
    'guard',
    'data',
    'onData',
    'route',
    'onBeforeRoute',
    'onCreatePageContext',
    'onCreateGlobalContext',

    // Framework-provided hooks (not in built-in types)
    'onCreateApp',
    'onBeforeRenderHtml',
    'onAfterRenderHtml',
    'onBeforeRenderClient',
    'onAfterRenderClient',
  ]

  // Preset functions
  const selectAll = () => setSelectedHooks(new Set(allHooks))
  const selectNone = () => setSelectedHooks(new Set())
  const selectStandard = () => setSelectedHooks(new Set([
    '+data.js',
    'onRenderHtml',
    'onRenderClient',
    'onCreatePageContext',
  ]))

  // Toggle hook selection
  const toggleHook = (hook: string) => {
    const newSelection = new Set(selectedHooks)
    if (newSelection.has(hook)) {
      newSelection.delete(hook)
    } else {
      newSelection.add(hook)
    }
    setSelectedHooks(newSelection)
  }

  function getFilteredHooks(phase: 'first-render' | 'client-navigation') {
    const hooks = phase === 'first-render' ? firstRenderHooks : clientNavigationHooks
    return hooks.filter((hook) => shouldShowHook(hook, selectedHooks, selectedFramework))
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
            Hook Selection
          </label>

          {/* Preset buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={selectStandard}
              style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Standard
            </button>
            <button
              onClick={selectAll}
              style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              All
            </button>
            <button
              onClick={selectNone}
              style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#dc3545',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              None
            </button>
          </div>

          {/* Hook checkboxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {allHooks.map((hook) => (
              <label key={hook} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedHooks.has(hook)}
                  onChange={() => toggleHook(hook)}
                  style={{ cursor: 'pointer' }}
                />
                <code style={{ fontSize: '0.9em' }}>{hook}</code>
              </label>
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
  selectedHooks: Set<string>,
  selectedFramework: 'vike-react' | 'vike-vue' | 'vike-solid' | null,
) {
  function checkFramework() {
    // Framework filter
    if (hook.providedBy && !selectedFramework) return false
    if (hook.providedBy && selectedFramework && !hook.providedBy.includes(selectedFramework)) return false
    return true
  }

  // Always show these core hooks (they always exist in every Vike app)
  if (hook.name === 'Routing' || hook.name === 'onRenderHtml' || hook.name === 'onRenderClient') {
    return checkFramework()
  }

  // Check if this hook is selected
  const hookName = hook.name

  // For data hooks, check all variants
  if (hookName === 'data') {
    const hasDataJs = selectedHooks.has('+data.js')
    const hasDataClient = selectedHooks.has('+data.client.js')
    const hasDataShared = selectedHooks.has('+data.shared.js')
    const hasDataFunction = selectedHooks.has('data')

    // Show if any data variant is selected and matches the hook's environment
    if (hook.hooksEnv) {
      if (hook.hooksEnv.includes('server') && (hasDataJs || hasDataFunction)) return checkFramework()
      if (hook.hooksEnv.includes('client') && (hasDataClient || hasDataFunction)) return checkFramework()
      if (hook.hooksEnv.includes('shared') && (hasDataShared || hasDataFunction)) return checkFramework()
      return false
    }
    return (hasDataJs || hasDataFunction) && checkFramework()
  }

  if (hookName === 'onBeforeRender') {
    const hasOnBeforeRenderJs = selectedHooks.has('+onBeforeRender.js')
    const hasOnBeforeRenderClient = selectedHooks.has('+onBeforeRender.client.js')
    const hasOnBeforeRenderShared = selectedHooks.has('+onBeforeRender.shared.js')
    const hasOnBeforeRenderFunction = selectedHooks.has('onBeforeRender')

    // Show if any onBeforeRender variant is selected and matches the hook's environment
    if (hook.hooksEnv) {
      if (hook.hooksEnv.includes('server') && (hasOnBeforeRenderJs || hasOnBeforeRenderFunction)) return checkFramework()
      if (hook.hooksEnv.includes('client') && (hasOnBeforeRenderClient || hasOnBeforeRenderFunction)) return checkFramework()
      if (hook.hooksEnv.includes('shared') && (hasOnBeforeRenderShared || hasOnBeforeRenderFunction)) return checkFramework()
      return false
    }
    return (hasOnBeforeRenderJs || hasOnBeforeRenderFunction) && checkFramework()
  }

  if (hookName === 'guard') {
    const hasGuardJs = selectedHooks.has('+guard.js')
    const hasGuardClient = selectedHooks.has('+guard.client.js')
    const hasGuardShared = selectedHooks.has('+guard.shared.js')
    const hasGuardFunction = selectedHooks.has('guard')

    // Show if any guard variant is selected and matches the hook's environment
    if (hook.hooksEnv) {
      if (hook.hooksEnv.includes('server') && (hasGuardJs || hasGuardFunction)) return checkFramework()
      if (hook.hooksEnv.includes('client') && (hasGuardClient || hasGuardFunction)) return checkFramework()
      if (hook.hooksEnv.includes('shared') && (hasGuardShared || hasGuardFunction)) return checkFramework()
      return false
    }
    return (hasGuardJs || hasGuardFunction) && checkFramework()
  }

  // For other hooks, check if they're selected
  if (!selectedHooks.has(hookName)) return false

  return checkFramework()
}

function getEnvColor(text: string) {
  if (text.includes('server')) return '#d110ff'
  if (text.includes('client')) return '#3acd3a'
  return '#888'
}

function TextEnv2({ children }: { children: any }) {
  return <TextEnv style={{ fontWeight: 600, color: getEnvColor(children) }}>{children}</TextEnv>
}
