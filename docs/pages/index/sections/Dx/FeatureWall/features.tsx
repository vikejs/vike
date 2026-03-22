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
      <>Fetch data anywhere (client, server, or both) and anytime (server start, browser start, or page render).</>
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
        ), Web Stream & Node.js Stream.
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
        , <ExternalLink href="https://github.com/vikejs/vike/issues/2114">supports URL text fragments</ExternalLink>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Config inheritance',
    icon: GitBranch,
    content: (
      <>
        <Link href="/config#inheritance">Apply configs to single/group/all pages</Link>,{' '}
        <Link href="/meta">create your own configs</Link>,{' '}
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
        <Link href="/data#client-js">client-side data fetching</Link>, partial pre-rendering, ISR.
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
        <Link href="/redirect">Programmatic redirects</Link>, <Link href="/redirects">static redirects</Link>,{' '}
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
        Filesystem Routing with <Link href="/file-structure">domain-driven file structure</Link>.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Base URL',
    icon: Link2,
    content: <>Base URL for static assets (CDN deployment), Base URL for SSR server.</>,
    advanced: true,
  },
  {
    title: 'Internationalization (i18n)',
    icon: Languages,
    content: (
      <>
        Low-level hook{' '}
        <Link href="/onBeforeRoute">
          <code>+onBeforeRoute</code>
        </Link>{' '}
        for full control over i18n.
      </>
    ),
    advanced: true,
  },
  {
    title: 'Instrumentation',
    icon: Gauge,
    content: <>Hook measurement, slow hook warnings, deep error tracking.</>,
    advanced: true,
  },
  {
    title: 'Layouts',
    icon: LayoutTemplate,
    content: (
      <>
        <Link href="/Layout">Layouts</Link> & <Link href="/Layout#nested">nested layouts</Link>.
      </>
    ),
  },
  {
    title: 'Link prefetching',
    icon: MousePointerClick,
    content: (
      <>
        <Link href="/prefetchStaticAssets">Links are prefetched</Link> upon mouse hover, or upon entering the viewport.
      </>
    ),
  },
  {
    title: 'Asset preloading',
    icon: HardDriveDownload,
    content: (
      <>
        <Link href="/preloading">Assets are preloaded</Link> for faster page loads.
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
        Node.js, Bun, Deno, Workers, Electron, Tauri,{' '}
        <ExternalLink href="http://blackboard.sh/electrobun">Electrobun</ExternalLink>, ...
      </>
    ),
  },
  {
    title: 'Rich context objects',
    icon: Blocks,
    content: (
      <div className="text-xs leading-5.5">
        <Link href="/globalContext">
          <code>globalContext.{'{pages,config,...}'}</code>
        </Link>
        <br />
        <Link href="/pageContext">
          <code>pageContext.{'{isHistoryNavigation,...}'}</code>
        </Link>
      </div>
    ),
  },
  {
    title: 'Fault tolerant',
    icon: Shield,
    content: <>E.g. Vike&apos;s runtime can be loaded twice.</>,
  },
  {
    title: 'Infinite loop protections',
    icon: RefreshCcwDot,
    content: <>E.g. infinite redirects are detected to prevent self-DDoS.</>,
  },
  {
    title: 'Conservative browser support',
    icon: MonitorCheck,
    content: (
      <>
        Supports legacy browsers via{' '}
        <ExternalLink href="https://github.com/vitejs/vite/tree/main/packages/plugin-legacy">
          <code>@vitejs/plugin-legacy</code>
        </ExternalLink>
        .
      </>
    ),
  },
  {
    title: 'Skew protection',
    icon: CloudSync,
    content: (
      <>
        <ExternalLink href="https://vike.dev/deploy-sync">Automatically synced</ExternalLink> frontend with SSR server
        that works with any deployment provider/strategy.
      </>
    ),
  },
  {
    title: 'Helpful warnings & errors',
    icon: TriangleAlert,
    content: <>≥400 warnings/errors that assist DX/performance/security, component stack injected in stack trace.</>,
  },
  {
    title: 'Hackable',
    icon: Wrench,
    content: (
      <>
        Access Vike internals via{' '}
        <span className="text-xs">
          <Link href="/warning/internals">
            <code>pageContext.dangerouslyUseInternals</code>.
          </Link>
        </span>
      </>
    ),
  },
  {
    title: "Part of Vite's CI",
    icon: CircleCheckBig,
    content: (
      <>
        <ExternalLink href="https://github.com/vitejs/vite-ecosystem-ci/blob/main/tests/vike.ts">
          Vite tests changes against Vike's CI.
        </ExternalLink>
      </>
    ),
  },
]
