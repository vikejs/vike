import { Config } from 'vike/types'

export default {
  // Test basic cumulative behavior (should add to parent)
  basicCumulative: { value: 'child-basic' },
  
  // Test default behavior (should replace parent default)
  defaultCumulative: {
    value: { content: 'child-replaces-default' }
  },
  
  // Test inherit behavior (should not inherit from parent)
  noInheritCumulative: {
    value: { content: 'child-no-inherit' },
    inherit: false
  },
  
  // Test grouped cumulative configs with various inheritance behaviors
  groupedCumulative: [
    {
      value: { content: 'child-group-a', type: 'specific' },
      group: 'group-a'
    },
    {
      value: { content: 'child-group-c-no-inherit', type: 'specific' },
      group: 'group-c',
      inherit: false  // This should NOT inherit parent values for group-c
    },
    {
      value: { content: 'child-group-d-overrides-default', type: 'specific' },
      group: 'group-d'  // This should override the parent's default value
    }
  ],
} satisfies Config
