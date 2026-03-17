import React from 'react'
import type { ReactNode } from 'react'
import { Link } from '@brillout/docpress'
import type { LucideIcon } from 'lucide-react'
import {
  Blocks,
  CircleCheckBig,
  CloudSync,
  Cpu,
  DatabaseZap,
  FileStack,
  Gauge,
  GitBranch,
  HardDriveDownload,
  Languages,
  LayoutTemplate,
  Link2,
  MonitorCheck,
  MousePointerClick,
  Navigation,
  RefreshCcwDot,
  Replace,
  Route,
  ServerCog,
  Shield,
  ShieldCheck,
  TriangleAlert,
  Waves,
  Wrench,
} from 'lucide-react'

type Feature = {
  title: string
  content: ReactNode
  icon: LucideIcon
  advanced?: boolean
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="underline decoration-current/30 underline-offset-2" href={href}>
      {children}
    </a>
  )
}

export const features: Feature[] = [
  {
    title: 'Data fetching',
    icon: DatabaseZap,
    content: (
      <>
        Fetch data where you want (client or server, or both) and when you want (server start, browser start, page
        render).
      </>
    ),
    advanced: true,
  },
  {
    title: 'HTML streaming',
    icon: Waves,
    content: (
      <>
        Progressive rendering, for example via{' '}
        <ExternalLink href="https://github.com/brillout/react-streaming">
          <code>react-streaming</code>
        </ExternalLink>
        , Web Stream, and Node.js Stream.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Client-side Routing',
    icon: Navigation,
    content: (
      <>
        Scroll restoration, <Link href="/navigate#history-pushstate">history.pushState()</Link>, and support for{' '}
        <ExternalLink href="https://github.com/vikejs/vike/issues/2114">URL text fragments</ExternalLink>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Config inheritance',
    icon: GitBranch,
    content: (
      <>
        <Link href="/config#inheritance">Apply configs to a single/group/all pages</Link>,{' '}
        <Link href="/meta">create your own configs</Link>, and{' '}
        <ExternalLink href="https://land.vike.dev/#framework-as-a-product">build your own framework</ExternalLink>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Pre-rendering (aka SSG)',
    icon: FileStack,
    content: (
      <>
        <Link href="/prerender#redirects">Redirects</Link>,{' '}
        <Link href="/data#client-js">client-side data fetching</Link>, partial pre-rendering, and ISR.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Server-Side Rendering (SSR)',
    icon: ServerCog,
    content: (
      <>
        First-class SSR integration with tools via powerful <Link href="/extensions">extensions</Link> and{' '}
        <Link href="/hooks">hooks</Link>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Redirections',
    icon: Replace,
    content: (
      <>
        <Link href="/redirect">Programmatic redirections</Link>, <Link href="/redirects">static redirects</Link>,{' '}
        <Link href="/render">programmatic URL rewrites</Link>, and{' '}
        <Link href="/auth#login-flow">a novel authentication flow</Link>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Routing',
    icon: Route,
    content: (
      <>
        Programmatically <Link href="/route-function">define</Link> and <Link href="/guard">protect</Link> routes, plus
        filesystem routing with <Link href="/file-structure">domain-driven file structure</Link>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Base URL',
    icon: Link2,
    content: <>Base URL for static assets (CDN deployments) plus a different Base URL for the SSR server.</>,
    advanced: true,
  },
  {
    title: 'Internationalization (i18n)',
    icon: Languages,
    content: <>Low-level hook <Link href='/i18n'>+onBeforeRoute</Link> for full control over i18n.</>,
    advanced: true,
  },
  {
    title: 'Instrumentation',
    icon: Gauge,
    content: <>Hook measurement, slow hook warnings, multi-level error-tracking, and more.</>,
    advanced: true,
  },
  {
    title: 'Layouts',
    icon: LayoutTemplate,
    content: (
      <>
        <Link href="/Layout">Layouts</Link> and <Link href="/Layout#nested">nested layouts</Link>.
      </>
    ),
  },
  {
    title: 'Link prefetching',
    icon: MousePointerClick,
    content: (
      <>
        <Link href="/prefetchStaticAssets">Links are prefetched</Link> on mouse hover, or optionally when entering the
        viewport.
      </>
    ),
  },
  {
    title: 'Asset preloading',
    icon: HardDriveDownload,
    content: (
      <>
        <Link href="/preloading">Assets are preloaded</Link> for quicker page loads.
      </>
    ),
  },
  {
    title: 'CSP',
    icon: ShieldCheck,
    content: <>PCI DSS compliance.</>,
  },
  {
    title: 'Any JavaScript runtime',
    icon: Cpu,
    content: (
      <>
        Works with any JavaScript runtime: Node.js, Bun, Deno, Workers, Electron, Tauri, and{' '}
        <ExternalLink href="http://blackboard.sh/electrobun">Electrobun</ExternalLink>.
      </>
    ),
  },
  {
    title: 'Rich context objects',
    icon: Blocks,
    content: (
      <>
        <Link href="/globalContext">
          <code>globalContext.{'{pages,config,...}'}</code>
        </Link>{' '}
        and{' '}
        <Link href="/pageContext">
          <code>pageContext.{'{isHistoryNavigation,...}'}</code>
        </Link>
        .
      </>
    ),
  },
  {
    title: 'Fault tolerant',
    icon: Shield,
    content: <>For example, Vike&apos;s runtime can be loaded twice when needed by some deployment strategies.</>,
  },
  {
    title: 'Infinite loop protections',
    icon: RefreshCcwDot,
    content: <>Infinite URL redirects and rewrites are caught, preventing self-DDoS.</>,
  },
  {
    title: 'Conservative browser support',
    icon: MonitorCheck,
    content: (
      <>
        Supports{' '}
        <ExternalLink href="https://github.com/vitejs/vite/tree/main/packages/plugin-legacy">
          <code>@vitejs/plugin-legacy</code>
        </ExternalLink>{' '}
        for legacy browsers.
      </>
    ),
  },
  {
    title: 'Synced deploys',
    icon: CloudSync,
    content: (
      <>
        Frontend <ExternalLink href="https://vike.dev/deploy-sync">automatically synced</ExternalLink> with the SSR
        server.
      </>
    ),
  },
  {
    title: 'Helpful warnings & errors',
    icon: TriangleAlert,
    content: <>400+ warnings and errors guiding DX, performance, and security, with component stacks in traces.</>,
  },
  {
    title: 'Hackable',
    icon: Wrench,
    content: (
      <>
        Access Vike internals via <Link href="/warning/internals">pageContext.dangerouslyUseInternals</Link>.
      </>
    ),
  },
  {
    title: 'Included in Vite CI',
    icon: CircleCheckBig,
    content: (
      <>
        <ExternalLink href="https://github.com/vitejs/vite-ecosystem-ci/blob/main/tests/vike.ts">
          Vike is part of Vite&apos;s CI
        </ExternalLink>
        .
      </>
    ),
  },
]
