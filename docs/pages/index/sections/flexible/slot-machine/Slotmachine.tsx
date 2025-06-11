// WIP

import React from 'react'
import ReactLogo from './logos/react'
import GraphqlLogo from './logos/graphql'
import ElysiaLogo from './logos/elysia'
import ExpressLogo from './logos/express'
import HonoLogo from './logos/hono'
import EdgeLogo from './logos/edge'
import VueLogo from './logos/vue'
import SolidLogo from './logos/solid'
import SpaLogo from './logos/spa'
import SsrLogo from './logos/ssr'
import SsgLogo from './logos/ssg'
import TsrestLogo from './logos/tsrest'
import RestLogo from './logos/rest'
import TrpcLogo from './logos/trpc'
import TelefuncLogo from './logos/telefunc'
import ServerLogo from './logos/server'
import StaticLogo from './logos/static'
import FastifyLogo from './logos/fastify'

type slotMachineGroupType = 'ui' | 'rendering' | 'deployment' | 'backend' | 'data'

type slotMachineRegistryType = {
  id: string
  name: string
  group: slotMachineGroupType
  bgColor: string
  logo: React.JSX.Element
}

const slotMachineRegistry: slotMachineRegistryType[] = [
  {
    id: 'react',
    name: 'React',
    group: 'ui',
    bgColor: '#FFFFFF',
    logo: <ReactLogo />,
  },
  {
    id: 'vue',
    name: 'Vue',
    group: 'ui',
    bgColor: '#FFFFFF',
    logo: <VueLogo />,
  },
  {
    id: 'solid',
    name: 'Solid',
    group: 'ui',
    bgColor: '#E2EFF9',
    logo: <SolidLogo />,
  },
  {
    id: 'spa',
    name: 'SPA',
    group: 'rendering',
    bgColor: '#E2EFF9',
    logo: <SpaLogo />,
  },
  {
    id: 'ssr',
    name: 'SSR',
    group: 'rendering',
    bgColor: '#EEEEEE',
    logo: <SsrLogo />,
  },
  {
    id: 'ssg',
    name: 'SSG',
    group: 'rendering',
    bgColor: '#EEEEEE',
    logo: <SsgLogo />,
  },
  {
    id: 'tsrest',
    name: 'tsRest',
    group: 'data',
    bgColor: '#F3E9F7',
    logo: <TsrestLogo />,
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    group: 'data',
    bgColor: '#F7E9F3',
    logo: <GraphqlLogo />,
  },
  {
    id: 'rest',
    name: 'Rest',
    group: 'data',
    bgColor: '#FFFFFF',
    logo: <RestLogo />,
  },
  {
    id: 'trpc',
    name: 'tRPC',
    group: 'data',
    bgColor: '#E2EFF9',
    logo: <TrpcLogo />,
  },
  {
    id: 'telefunc',
    name: 'Telefunc',
    group: 'data',
    bgColor: '#EEEEEE',
    logo: <TelefuncLogo />,
  },
  {
    id: 'elysia',
    name: 'Elysia',
    group: 'backend',
    bgColor: '#FFFFFF',
    logo: <ElysiaLogo />,
  },
  {
    id: 'fastify',
    name: 'Fastify',
    group: 'backend',
    bgColor: '#EEEEEE',
    logo: <FastifyLogo />,
  },
  {
    id: 'express',
    name: 'Express',
    group: 'backend',
    bgColor: '#FFFFFF',
    logo: <ExpressLogo />,
  },
  {
    id: 'hono',
    name: 'Hono',
    group: 'backend',
    bgColor: 'F7E9E9',
    logo: <HonoLogo />,
  },
  {
    id: 'server',
    name: 'Server',
    group: 'deployment',
    bgColor: '#EEEEEE',
    logo: <ServerLogo />,
  },
  {
    id: 'edge',
    name: 'Edge',
    group: 'deployment',
    bgColor: '#EEEEEE',
    logo: <EdgeLogo />,
  },
  {
    id: 'static',
    name: 'Static',
    group: 'deployment',
    bgColor: '#EEEEEE',
    logo: <StaticLogo />,
  },
]
