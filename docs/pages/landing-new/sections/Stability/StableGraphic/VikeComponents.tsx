import cm from '@classmatejs/react'
import React from 'react'
import { splitIntoRows, VikeComponent, VikeComponentSize } from './grid.utils'
import { H4Headline, H5Headline } from '../../../components/Headline'
import vikeLogo from '../../../../../assets/logo/vike.svg'

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

const Box = cm.li.variants<{ $size: VikeComponentSize }>({
  base: `
  inset-ring-1
  inset-ring-secondary/50 hover:inset-ring-secondary
  rounded-field
  bg-gradient-to-bl to-secondary/7 hover:to-secondary/12
  text-base-content/90 hover:text-base-content
  flex
  lg:flex-1 lg:basis-0 lg:min-w-max
  items-center justify-center
  text-center text-xs md:text-sm
  relative
`,
  variants: {
    $size: {
      big: 'font-medium',
      small: '',
    },
  },
})

const InnerLink = cm.a`
  text-base-content  
  py-1 px-2
  w-full
`

const VikeComponents = () => {
  return (
    <div className="p-3">
      <ul className="list-none flex flex-wrap gap-1 lg:hidden">
        {components.map((component) => (
          <Box key={component.name} $size={component.size}>
            <InnerLink href={component.link}>{component.name}</InnerLink>
          </Box>
        ))}
      </ul>

      <div className="hidden lg:flex lg:flex-col lg:gap-1.5">
        {componentRows.map((row, rowIndex) => (
          <ul key={rowIndex} className="list-none flex flex-wrap gap-1.5">
            {row.map((component) => (
              <Box key={component.name} $size={component.size}>
                <InnerLink href={component.link}>{component.name}</InnerLink>
              </Box>
            ))}
          </ul>
        ))}
      </div>
      <div className="flex gap-2 items-center mb-4">
        <img src={vikeLogo} alt="" className="h-auto w-5" />
        <H5Headline as="h3">Vike's components</H5Headline>
      </div>
    </div>
  )
}

export default VikeComponents
