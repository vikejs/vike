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
        Fetch data where you (client or server, or both) and when you want (server start, browser start, page render).
      </>
    ),
    advanced: true,
  },
  {
    title: 'HTML streaming',
    icon: Waves,
    content: (
      <>
        Progressive rendering (e.g. via{' '}
        <ExternalLink href="https://github.com/brillout/react-streaming">
          <code>react-streaming</code>
        </ExternalLink>
        ), Web Stream + Node.js Stream
      </>
    ),
    advanced: true,
  },
  {
    title: 'Client-side Routing',
    icon: Navigation,
    content: (
      <>
        Scroll restoration,{' '}
        <Link href="/navigate#history-pushstate">
          doesn&apos;t break <code>history.pushState()</code>
        </Link>
        , and <ExternalLink href="https://github.com/vikejs/vike/issues/2114">supports URL text fragments</ExternalLink>
        .
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
        <Link href="/meta">create your own configs</Link> and{' '}
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
        First-class SSR integration with tools via powerful <Link href="/extensions">extensions</Link>/
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
        <Link href="/render">programmatic URL rewrites</Link>,{' '}
        <Link href="/auth#login-flow">novel authentication flow</Link>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Routing',
    icon: Route,
    content: (
      <>
        Programmatically <Link href="/route-function">define</Link> and <Link href="/guard">protect</Link> routes,
        Filesystem routing with <Link href="/file-structure">domain-driven file structure</Link>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Base URL',
    icon: Link2,
    content: <>Base URL for static assets (CDN deployments) + (different) Base URL for SSR server</>,
    advanced: true,
  },
  {
    title: 'Internationalization (i18n)',
    icon: Languages,
    content: <>Low-level hook +onBeforeRoute for full control over i18n</>,
    advanced: true,
  },
  {
    title: 'Instrumentation',
    icon: Gauge,
    content: <>Hook measurement, slow hook warnings, multi-level error-tracking, ...</>,
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
        <Link href="/prefetchStaticAssets">Links are prefetched</Link> upon mouse hover (or optionally upon entering the
        viewport).
      </>
    ),
  },
  {
    title: 'Asset preloading',
    icon: HardDriveDownload,
    content: (
      <>
        <Link href="/preloading">Assets are preloaded</Link> for quicker pages loads.
      </>
    ),
  },
  {
    title: 'CSP',
    icon: ShieldCheck,
    content: <>PCI DSS compliance</>,
  },
  {
    title: 'Any JavaScript runtime',
    icon: Cpu,
    content: (
      <>
        Works with any JavaScript runtime (Node.js, Bun, Deno, Workers, Electron, Tauri,{' '}
        <ExternalLink href="http://blackboard.sh/electrobun">Electrobun</ExternalLink>, ...)
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
        </Link>
        <br />
        <Link href="/pageContext">
          <code>pageContext.{'{isHistoryNavigation,...}'}</code>
        </Link>
      </>
    ),
  },
  {
    title: 'Fault tolerant',
    icon: Shield,
    content: <>E.g. Vike&apos;s runtime can be loaded twice (needed for some deployment strategies).</>,
  },
  {
    title: 'Infinite loop protections',
    icon: RefreshCcwDot,
    content: <>Infinite URL redirects/rewrites are catched, preventing self-DDoS.</>,
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
    content: <>≥400 warnings/errors guiding DX/performance/security, component stack injected in stack trace.</>,
  },
  {
    title: 'Hackable',
    icon: Wrench,
    content: (
      <>
        Access Vike internals via{' '}
        <Link href="/warning/internals">
          <code>pageContext.dangerouslyUseInternals</code>
        </Link>
        .
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
      </>
    ),
  },
]
