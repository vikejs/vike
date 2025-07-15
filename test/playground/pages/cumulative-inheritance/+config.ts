import { Config } from 'vike/types'

export default {
  // Test basic cumulative behavior (should accumulate)
  basicCumulative: { value: 'root-basic' },
  
  // Test default behavior (should be replaced by children)
  defaultCumulative: {
    value: { content: 'root-default' },
    default: true
  },
  
  // Test inherit behavior (children should not inherit)
  noInheritCumulative: {
    value: { content: 'root-no-inherit' },
    inherit: false
  },
  
  // Test grouped cumulative configs
  groupedCumulative: [
    {
      value: { content: 'root-group-a', type: 'global' },
      group: 'group-a'
    },
    {
      value: { content: 'root-group-b', type: 'global' },
      group: 'group-b'
    },
    {
      value: { content: 'root-group-c-should-be-replaced', type: 'global' },
      group: 'group-c'
    },
    {
      value: { content: 'root-group-d-default', type: 'global' },
      group: 'group-d',
      default: true  // This should be overridden by child non-default value
    }
  ],
  
  meta: {
    basicCumulative: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
    defaultCumulative: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
    noInheritCumulative: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
    groupedCumulative: {
      env: { server: true, client: true, config: true },
      cumulative: true,
    },
  },
} satisfies Config
