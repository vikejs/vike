type ioDataType = {
  title: string
  side: 'left' | 'right'
  group: (typeof ioGroups)[number]['name']
}

type ioDataGroupType = {
  name: 'ui' | 'rendering' | 'data' | 'server' | 'deployment' | 'backend'
  color: string
}

export const ioGroups: ioDataGroupType[] = [
  {
    name: 'ui',
    color: '#359DBE',
  },
  {
    name: 'rendering',
    color: '#9C35BE',
  },
  {
    name: 'data',
    color: '#3577BE',
  },
  {
    name: 'deployment',
    color: '#6A35BE',
  },
  {
    name: 'server',
    color: '#354CBE',
  },
  {
    name: 'backend',
    color: '#359DBE',
  },
]

export const ioData: ioDataType[] = [
  {
    title: 'react',
    side: 'left',
    group: 'ui',
  },
  {
    title: 'vue',
    side: 'left',
    group: 'ui',
  },
  {
    title: 'solid',
    side: 'left',
    group: 'ui',
  },
  {
    title: 'ssr',
    side: 'left',
    group: 'rendering',
  },
  {
    title: 'ssg',
    side: 'left',
    group: 'rendering',
  },
  {
    title: 'spa',
    side: 'left',
    group: 'rendering',
  },
  {
    title: 'mpa',
    side: 'left',
    group: 'rendering',
  },
  {
    title: 'tanstack query',
    side: 'left',
    group: 'data',
  },
  {
    title: 'trpc',
    side: 'left',
    group: 'data',
  },
  {
    title: 'telefunc',
    side: 'left',
    group: 'data',
  },
  {
    title: 'apollo',
    side: 'left',
    group: 'data',
  },
  {
    title: 'relay',
    side: 'left',
    group: 'data',
  },
  {
    title: 'aws',
    side: 'right',
    group: 'deployment',
  },
  {
    title: 'digitalocean',
    side: 'right',
    group: 'deployment',
  },
  {
    title: 'cloudflare',
    side: 'right',
    group: 'deployment',
  },
  {
    title: 'vercel',
    side: 'right',
    group: 'deployment',
  },
  {
    title: 'netlify',
    side: 'right',
    group: 'deployment',
  },
  {
    title: 'github pages',
    side: 'right',
    group: 'deployment',
  },
  {
    title: 'node.js',
    side: 'right',
    group: 'backend',
  },
  {
    title: 'bun',
    side: 'right',
    group: 'backend',
  },
  {
    title: 'deno',
    side: 'right',
    group: 'backend',
  },
  {
    title: 'express.js',
    side: 'right',
    group: 'server',
  },
  {
    title: 'hono',
    side: 'right',
    group: 'server',
  },
  {
    title: 'fastify',
    side: 'right',
    group: 'server',
  },
  {
    title: 'elysia',
    side: 'right',
    group: 'server',
  },
  {
    title: 'java',
    side: 'right',
    group: 'server',
  },
  {
    title: 'ruby on rails',
    side: 'right',
    group: 'server',
  },
  {
    title: 'laravel',
    side: 'right',
    group: 'server',
  },
]
