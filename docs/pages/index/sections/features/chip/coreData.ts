export { coreData }

type CoreDataType = {
  title: string
  href: string
  posColLg: string
  posRowLg: string
}

const top: CoreDataType[] = [
  {
    title: 'Client-side pages (SPA)',
    href: '/spa',
    posColLg: '1 / span 3',
    posRowLg: '1 / span 3',
  },
  {
    title: 'Server-side pages (SSR)',
    href: '/ssr',
    posColLg: '4 / span 3',
    posRowLg: '1 / span 3',
  },
  {
    title: 'Pre-rendered pages (SSG)',
    href: '/pre-rendering',
    posColLg: '7 / span 3',
    posRowLg: '1 / span 3',
  },
]

const bot: CoreDataType[] = [
  {
    title: 'Routing',
    href: '/routing',
    posColLg: '1 / span 2',
    posRowLg: '7 / span 1',
  },
  {
    title: 'Type-safe routes',
    href: '/routing#typescript',
    posColLg: '3 / span 4',
    posRowLg: '7 / span 1',
  },
  {
    title: 'Route Guards',
    href: '/guard',
    posColLg: '7 / span 3',
    posRowLg: '7 / span 1',
  },
  {
    title: 'Layouts',
    href: '/Layout',
    posColLg: '1 / span 2',
    posRowLg: '8 / span 1',
  },
  {
    title: 'Nested layouts',
    href: '/Layout#nested',
    posColLg: '3 / span 4',
    posRowLg: '8 / span 1',
  },
  {
    title: 'Streaming',
    href: '/streaming',
    posColLg: '7 / span 3',
    posRowLg: '8 / span 1',
  },
  {
    title: 'Data Fetching',
    href: '/data-fetching',
    posColLg: '1 / span 3',
    posRowLg: '9 / span 1',
  },
  {
    title: 'Pre-fetching',
    href: '/prefetch',
    posColLg: '4 / span 3',
    posRowLg: '9 / span 1',
  },
  {
    title: 'Pre-loading',
    href: '/preloading',
    posColLg: '7 / span 3',
    posRowLg: '9 / span 1',
  },
]

const coreData: CoreDataType[] = [...top, ...bot]
