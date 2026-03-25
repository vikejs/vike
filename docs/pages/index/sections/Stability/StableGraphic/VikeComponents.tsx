import cm from '@classmatejs/react'
import React from 'react'
import { splitIntoRows, VikeComponent, VikeComponentSize } from './grid.utils'
import ImageGroup from './ImageGroup'

const bigComponents: VikeComponent[] = (
  [
    {
      name: 'SPA/SSR/SSG',
      link: 'https://vike.dev/SSR-vs-SPA',
    },
    {
      name: 'HTML Streaming',
      link: 'https://vike.dev/stream',
    },
    {
      name: 'Filesystem Routing',
      link: 'https://vike.dev/filesystem-routing',
    },
    {
      name: 'Client Routing',
      link: 'https://vike.dev/client-routing',
    },
    {
      name: 'Data fetching',
      link: 'https://vike.dev/data-fetching',
    },
    {
      name: 'Powerful hooks',
      link: 'https://vike.dev/hooks',
    },
    {
      name: 'Config inheritance',
      link: 'https://vike.dev/config#inheritance',
    },
  ] as const
).map((c) => ({
  ...c,
  // size: 'big',
  size: 'small',
}))

const Code = ({ children }: { children: string }) => <code className="!px-[4px] !py-[2px]">{children}</code>

const smallComponents: VikeComponent[] = (
  [
    {
      name: 'Error handling',
      link: 'https://vike.dev/error-page',
    },
    {
      name: <Code>pageContext</Code>,
      link: 'https://vike.dev/pageContext',
    },
    {
      name: <Code>globalContext</Code>,
      link: 'https://vike.dev/globalContext',
    },
    {
      name: 'URL handling',
      link: 'https://vike.dev/pageContext#urlParsed',
    },
    {
      name: 'CSP',
      link: 'https://vike.dev/csp',
    },
    {
      name: 'Layouts',
      link: 'https://vike.dev/Layout',
    },
    {
      name: 'Route Guards',
      link: 'https://vike.dev/guard',
    },
  ] as const
).map((c) => ({ ...c, size: 'small' }))

// shuffle - start with big then small, then big, then small, etc.
const components = bigComponents.reduce((acc, bigComponent, index) => {
  const smallComponent = smallComponents[index]
  if (smallComponent) {
    acc.push(bigComponent, smallComponent)
  } else {
    acc.push(bigComponent)
  }
  return acc
}, [] as VikeComponent[])

const rowCount = 3

const componentRows = splitIntoRows(components, rowCount)

const VikeComponents = () => {
  return (
    <div className="relative pt-2 md:pt-3">
      <ImageGroup />
      <ul className="relative z-10 list-none flex flex-wrap justify-center gap-1.5 md:gap-2 lg:hidden">
        {components.map((component) => (
          <BoxBlue key={component.link} $size={component.size}>
            <InnerLink href={component.link}>{component.name}</InnerLink>
          </BoxBlue>
        ))}
      </ul>
      <div className="relative z-10 hidden lg:flex lg:flex-col lg:gap-2">
        {componentRows.map((row, rowIndex) => (
          <ul key={rowIndex} className="list-none flex flex-wrap gap-2">
            {row.map((component) => (
              <BoxBlue key={component.link} $size={component.size}>
                <InnerLink href={component.link}>{component.name}</InnerLink>
              </BoxBlue>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default VikeComponents

export const BoxBlue = cm.li.variants<{ $size: VikeComponentSize }>({
  base: `
  inset-ring-1
  inset-ring-secondary/45 hover:inset-ring-secondary
  rounded-[1rem]
  bg-gradient-to-br from-white to-secondary/7 hover:to-secondary/14
  text-base-content/90 hover:text-base-content
  shadow-xs shadow-secondary/10
  flex
  lg:flex-1 lg:basis-0 lg:min-w-max
  items-center justify-center
  text-center text-xs md:text-sm
  relative
`,
  variants: {
    $size: {
      big: 'font-bold',
      small: '',
    },
  },
})

const InnerLink = cm.a`
  text-base-content  
  py-1 px-2
  w-full
`
