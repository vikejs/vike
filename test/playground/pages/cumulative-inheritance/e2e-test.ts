export { testCumulativeInheritance }

import { expect, test } from '@brillout/test-e2e'
import { retrievePageContext } from '../config-meta/retrievePageContext'

function testCumulativeInheritance() {
  test('Cumulative inheritance with default, inherit, and group controls', async () => {
    // Test root page - should have all root values
    expect(await retrievePageContext('/cumulative-inheritance')).to.deep.equal({
      basicCumulative: ['root-basic'],
      defaultCumulative: [{ content: 'root-default' }],
      noInheritCumulative: [{ content: 'root-no-inherit' }],
      groupedCumulative: [
        { content: 'root-group-a', type: 'global' },
        { content: 'root-group-b', type: 'global' },
        { content: 'root-group-c-should-be-replaced', type: 'global' },
        { content: 'root-group-d-default', type: 'global' }
      ],
    })

    // Test child page - should demonstrate inheritance controls
    expect(await retrievePageContext('/cumulative-inheritance/child')).to.deep.equal({
      // Basic cumulative: child value + inherited parent value (normal accumulation)
      basicCumulative: ['child-basic', 'root-basic'],

      // Default cumulative: child non-default replaces parent default
      defaultCumulative: [{ content: 'child-replaces-default' }],

      // No inherit: child value only, no inheritance from parent
      noInheritCumulative: [{ content: 'child-no-inherit' }],

      // Grouped cumulative:
      // - group-a: child + parent (normal inheritance within group)
      // - group-b: only parent (no child defined for this group)
      // - group-c: only child (child has inherit=false, so no parent inheritance)
      // - group-d: only child (child non-default overrides parent default)
      groupedCumulative: [
        { content: 'child-group-a', type: 'specific' },
        { content: 'root-group-a', type: 'global' },
        { content: 'root-group-b', type: 'global' },
        { content: 'child-group-c-no-inherit', type: 'specific' },
        { content: 'child-group-d-overrides-default', type: 'specific' }
      ],
    })
  })
}
