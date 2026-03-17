import React from 'react'
import { VikeComponentSize, VikeEcoComponentCategory } from './grid.utils'
import cm from '@classmatejs/react'

type EcoComponent = {
  name: string
  link?: string
  size: VikeComponentSize
}

const ecosystemComponents: Record<VikeEcoComponentCategory, EcoComponent[]> = {
  framework: [
    { name: 'React', link: 'https://reactjs.org/', size: 'big' },
    { name: 'Vue', link: 'https://vuejs.org/', size: 'big' },
    { name: 'Solid', link: 'https://www.solidjs.com/', size: 'big' },
    { name: 'Angular', link: 'https://angular.io/', size: 'small' },
    { name: 'VanJS', link: 'https://vanjs.org/', size: 'small' },
    { name: 'Lynx', link: 'https://lynxjs.org/', size: 'small' },
  ],
  api: [
    { name: 'RPC', link: 'https://en.wikipedia.org/wiki/Remote_procedure_call', size: 'big' },
    { name: 'REST', link: 'https://restfulapi.net/', size: 'big' },
    { name: 'GraphQL', link: 'https://graphql.org/', size: 'big' },
  ],
  deploy: [
    { name: 'Self-hosting', link: 'https://en.wikipedia.org/wiki/Self-hosting_(web_services)', size: 'big' },
    { name: 'Cloudflare', link: 'https://www.cloudflare.com/', size: 'big' },
    { name: 'Vercel', link: 'https://vercel.com/', size: 'big' },
    { name: 'AWS', link: 'https://aws.amazon.com/', size: 'big' },
    { name: 'Netlify', link: 'https://www.netlify.com/', size: 'small' },
    { name: 'Google Cloud', link: 'https://cloud.google.com/', size: 'small' },
    { name: 'Azure', link: 'https://azure.microsoft.com/', size: 'small' },
  ],
  server: [
    { name: 'Hono', link: 'https://hono.dev/', size: 'big' },
    { name: 'Express.js', link: 'https://expressjs.com/', size: 'big' },
    { name: 'Fastify', link: 'https://www.fastify.io/', size: 'small' },
    { name: 'Elysia', link: 'https://elysiajs.com/', size: 'small' },
  ],
}

const EcoComponents = () => {
  return (
    <div className="relative z-10 mb-10">
      <div className="flex gap-1 md:gap-4">
        {Object.entries(ecosystemComponents).map(([category, components]) => (
          <div key={category} className="flex flex-col items-center gap-1 flex-1">
            <BoxOrange className="text-xs text-grey" $type="category">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </BoxOrange>
            <div className="flex-1">
              <ul className="list-none flex flex-wrap gap-1 md:gap-2 justify-center">
                {components.map((component) => (
                  <BoxOrange key={component.name} $type="lib">
                    <div className="bg-linear-to-bl  to-accent/7 absolute inset-0 pointer-events-none select-none" />
                    <a
                      href={component.link}
                      target="_blank"
                      className="py-0.5 px-0.5 md:py-1 md:px-2 w-full text-accent/70 hover:text-accent text-tiny md:text-xs"
                    >
                      {component.name}
                    </a>
                  </BoxOrange>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EcoComponents

export const BoxOrange = cm.li.variants<{ $size?: VikeComponentSize; $type: 'lib' | 'category' }>({
  base: `
  flex
  items-center justify-center
  text-center text-sm
  relative
`,
  variants: {
    $size: {
      big: 'font-medium',
      small: '',
    },
    $type: {
      lib: `
        inset-ring-1
        inset-ring-accent/30
        bg-white
        rounded-field
        `,
      category: `
        mb-3
      `,
    },
  },
  defaultVariants: {
    $size: 'big',
  },
})

