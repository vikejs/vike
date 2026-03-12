import cm from '@classmatejs/react'
import React from 'react'

type VikeComponentSize = 'big' | 'small'

type VikeComponent = {
  name: string
  link: string
  size: VikeComponentSize
}

/*

- Big
  - [SPA/SSR/SSG](https://vike.dev/SSR-vs-SPA)
  - [HTML Streaming](https://vike.dev/stream)
  - [Filesystem Routing](https://vike.dev/filesystem-routing)
  - [Client Routing](https://vike.dev/client-routing)
  - [Data fetching](https://vike.dev/data-fetching)
  - [Powerful hooks](https://vike.dev/hooks)
  - [Config inheritance](https://vike.dev/config#inheritance)
- Small
  - [Error handling](https://vike.dev/error-page)
  - [`pageContext`](https://vike.dev/pageContext)
  - [`globalContext`](https://vike.dev/globalContext)
  - [URL handling](https://vike.dev/pageContext#urlParsed)
  - [CSP](https://vike.dev/csp)
  - [Layouts](https://vike.dev/Layout)
  - [Route Guards](https://vike.dev/guard)

*/

const bigComponents: VikeComponent[] = [
  {
    name: 'SPA/SSR/SSG',
    link: 'https://vike.dev/SSR-vs-SPA',
    size: 'big',
  },
  {
    name: 'HTML Streaming',
    link: 'https://vike.dev/stream',
    size: 'big',
  },
  {
    name: 'Filesystem Routing',
    link: 'https://vike.dev/filesystem-routing',
    size: 'big',
  },
  {
    name: 'Client Routing',
    link: 'https://vike.dev/client-routing',
    size: 'big',
  },
  {
    name: 'Data fetching',
    link: 'https://vike.dev/data-fetching',
    size: 'big',
  },
  {
    name: 'Powerful hooks',
    link: 'https://vike.dev/hooks',
    size: 'big',
  },
  {
    name: 'Config inheritance',
    link: 'https://vike.dev/config#inheritance',
    size: 'big',
  },
]

const smallComponents: VikeComponent[] = [
  {
    name: 'Error handling',
    link: 'https://vike.dev/error-page',
    size: 'small',
  },
  {
    name: '`pageContext`',
    link: 'https://vike.dev/pageContext',
    size: 'small',
  },
  {
    name: '`globalContext`',
    link: 'https://vike.dev/globalContext',
    size: 'small',
  },
  {
    name: 'URL handling',
    link: 'https://vike.dev/pageContext#urlParsed',
    size: 'small',
  },
  {
    name: 'CSP',
    link: 'https://vike.dev/csp',
    size: 'small',
  },
  {
    name: 'Layouts',
    link: 'https://vike.dev/Layout',
    size: 'small',
  },
  {
    name: 'Route Guards',
    link: 'https://vike.dev/guard',
    size: 'small',
  },
]

// map tailwind col-span to constants
export const UiColSpan = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
} as const

const minColSpan = 3
const maxColSpan = 6

const components = [...bigComponents, ...smallComponents]

const Box = cm.li.variants<{ $size: VikeComponentSize }>({
  base: `
  border-2 border-primary rounded-box
  p-4
  mb-4
`,
  variants: {
    $size: {
      big: 'text-lg',
      small: 'text-sm',
    },
  },
})

const VikeComponents = () => {
  return (
    <ul className="list-none grid grid-cols-12">
      {components.map((component) => (
        <Box key={component.name} $size={component.size}>
          <a href={component.link} target="_blank">
            {component.name}
          </a>
        </Box>
      ))}
    </ul>
  )
}

export default VikeComponents
