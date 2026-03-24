import React, { useEffect, useState } from 'react'
import { ecoComponentCategoryNames, VikeComponentSize, VikeEcoComponentCategory } from './grid.utils'
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
    { name: 'REST', link: 'https://en.wikipedia.org/wiki/REST', size: 'big' },
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

const MUTED_COMPONENT_RATIO = 0.3
const MUTED_OPACITY = 0.5
const TRANSITION_DURATION = 1100
const TRANSITION_OVERLAP = 160
const TRANSITION_STYLE = `opacity ${TRANSITION_DURATION}ms linear`
const INITIAL_UPDATE_STAGGER = 550

type CategoryDecorations = Record<VikeEcoComponentCategory, Record<string, number>>

const EcoComponents = () => {
  const [decorations, setDecorations] = useState<CategoryDecorations>(() => createCategoryDecorations(1))

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReducedMotion.matches) return

    const globalRandom = createPseudoRandomNumberGenerator(Math.floor(Math.random() * 2 ** 31))
    const timeoutIds: number[] = []

    objectEntries(ecosystemComponents).forEach(([category, components], index) => {
      const categoryRandom = createPseudoRandomNumberGenerator(Math.floor(globalRandom() * 2 ** 31))
      const componentNames = components.map((component) => component.name)

      const scheduleNextUpdate = (delay: number) => {
        const timeoutId = window.setTimeout(() => {
          setDecorations((currentDecorations) => ({
            ...currentDecorations,
            [category]: transferComponentOpacity(
              currentDecorations[category] ??
                createComponentDecorations(componentNames, Math.floor(globalRandom() * 2 ** 31)),
              componentNames,
              categoryRandom,
            ),
          }))

          scheduleNextUpdate(Math.max(1, TRANSITION_DURATION - TRANSITION_OVERLAP))
        }, delay)

        timeoutIds.push(timeoutId)
      }

      scheduleNextUpdate(INITIAL_UPDATE_STAGGER * (index + 1) + Math.floor(categoryRandom() * INITIAL_UPDATE_STAGGER))
    })

    return () => {
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
    }
  }, [])

  return (
    <div className="relative z-10 mb-10">
      <div className="md:-mt-4 flex gap-1 md:gap-4">
        {objectEntries(ecosystemComponents).map(([category, components]) => (
          <div key={category} className="flex flex-col items-center gap-1 flex-1">
            <BoxOrange className="text-xs text-grey" $type="category">
              {ecoComponentCategoryNames[category]}
            </BoxOrange>
            <div className="flex-1">
              <ul className="list-none flex flex-wrap gap-1 md:gap-2 justify-center">
                {components.map((component) => {
                  const opacity = decorations[category]?.[component.name] ?? 1

                  return (
                    <BoxOrange
                      key={component.name}
                      $type="lib"
                      style={{
                        opacity,
                        transition: TRANSITION_STYLE,
                      }}
                    >
                      <div className="bg-linear-to-bl  to-accent/7 absolute inset-0 pointer-events-none select-none" />
                      <a
                        href={component.link}
                        target="_blank"
                        className="py-0.5 px-0.5 md:py-1 md:px-2 w-full text-accent/70 hover:text-accent text-tiny md:text-xs"
                      >
                        {component.name}
                      </a>
                    </BoxOrange>
                  )
                })}
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

// https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type/75337277#75337277
/** Same as Object.entries() but with type inference */
function objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as any
}

function createCategoryDecorations(seed: number): CategoryDecorations {
  const random = createPseudoRandomNumberGenerator(seed)

  return Object.fromEntries(
    objectEntries(ecosystemComponents).map(([category, components]) => [
      category,
      createComponentDecorations(
        components.map((component) => component.name),
        Math.floor(random() * 2 ** 31),
      ),
    ]),
  ) as CategoryDecorations
}

function createComponentDecorations(componentNames: string[], seed: number): Record<string, number> {
  const random = createPseudoRandomNumberGenerator(seed)
  const shuffledNames = [...componentNames]

  for (let index = shuffledNames.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffledNames[index], shuffledNames[swapIndex]] = [shuffledNames[swapIndex], shuffledNames[index]]
  }

  const mutedNames = new Set(
    shuffledNames.slice(0, Math.max(1, Math.round(componentNames.length * MUTED_COMPONENT_RATIO))),
  )

  return Object.fromEntries(
    componentNames.map((componentName) => [componentName, mutedNames.has(componentName) ? MUTED_OPACITY : 1]),
  )
}

function transferComponentOpacity(
  currentDecorations: Record<string, number>,
  componentNames: string[],
  random: () => number,
): Record<string, number> {
  const mutedNames = componentNames.filter((componentName) => currentDecorations[componentName] === MUTED_OPACITY)
  const activeNames = componentNames.filter((componentName) => currentDecorations[componentName] !== MUTED_OPACITY)

  if (mutedNames.length === 0 || activeNames.length === 0) {
    return currentDecorations
  }

  const nextMutedNames = new Set<string>()
  const shuffledActiveNames = [...activeNames]

  for (let index = shuffledActiveNames.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffledActiveNames[index], shuffledActiveNames[swapIndex]] = [
      shuffledActiveNames[swapIndex],
      shuffledActiveNames[index],
    ]
  }

  shuffledActiveNames.slice(0, mutedNames.length).forEach((componentName) => {
    nextMutedNames.add(componentName)
  })

  const nextDecorations = { ...currentDecorations }
  componentNames.forEach((componentName) => {
    nextDecorations[componentName] = nextMutedNames.has(componentName) ? MUTED_OPACITY : 1
  })

  return nextDecorations
}

function createPseudoRandomNumberGenerator(seed: number) {
  let current = seed

  return () => {
    current += 0x6d2b79f5
    let t = current
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
