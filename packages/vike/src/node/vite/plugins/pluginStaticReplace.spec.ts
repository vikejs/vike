import { transformStaticReplace, TransformStaticReplaceOptions } from './pluginStaticReplace.js'
import { describe, it, expect } from 'vitest'

const transform = (code: string, options: TransformStaticReplaceOptions) =>
  transformStaticReplace({ code, id: 'fake-id:pluginStaticReplace.spec.ts', options, env: 'server' })

// TODO/ai:
// Move pluginStaticReplace.spec.ts to pluginStaticReplace/pluginStaticReplace.spec.ts
// Define two fixture files:
//  pluginStaticReplace/vue-sfc-dev-fixture-before.js
//  pluginStaticReplace/vue-sfc-dev-fixture-after.js

describe('transformStaticReplace', () => {
  it('Vue', async () => {
    const options: TransformStaticReplaceOptions = {
      rules: [
        {
          env: 'server',
          call: {
            match: {
              function: ['import:vue/server-renderer:ssrRenderComponent'],
              args: {
                0: {
                  object: '$setup',
                  property: 'ClientOnly',
                },
              },
            },
            remove: { arg: 2, prop: 'default' },
          },
        },
      ],
    }

    const input = `import { defineComponent as _defineComponent } from "vue";
import { ClientOnly } from "vike-vue/ClientOnly";
import ClientOnlyComponent from "./ClientOnlyComponent.vue";
const _sfc_main = _defineComponent({
  __name: "+Page",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { get ClientOnly() {
      return ClientOnly;
    }, ClientOnlyComponent };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
import { withCtx as _withCtx, createVNode as _createVNode } from "vue";
import { ssrRenderComponent as _ssrRenderComponent } from "vue/server-renderer";
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(\`<!--[--><h1 data-v-c63e5769>ClientOnly</h1><h2 data-v-c63e5769>Using <code data-v-c63e5769>&lt;ClientOnly&gt;</code> component</h2><h3 data-v-c63e5769>Basic example with fallback</h3>\`);
  _push(_ssrRenderComponent($setup["ClientOnly"], null, {
    fallback: _withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(\`<p data-v-c63e5769\${_scopeId}>Loading client-only component...</p>\`);
      } else {
        return [
          _createVNode("p", null, "Loading client-only component...")
        ];
      }
    }),
    default: _withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(\`<p data-v-c63e5769\${_scopeId}>Some text before</p>\`);
        _push2(_ssrRenderComponent($setup["ClientOnlyComponent"], { msg: "hello" }, null, _parent2, _scopeId));
        _push2(\`<p data-v-c63e5769\${_scopeId}>Some text after</p>\`);
      } else {
        return [
          _createVNode("p", null, "Some text before"),
          _createVNode($setup["ClientOnlyComponent"], { msg: "hello" }),
          _createVNode("p", null, "Some text after")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(\`<h3 data-v-c63e5769>Without fallback</h3>\`);
  _push(_ssrRenderComponent($setup["ClientOnly"], null, {
    default: _withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(_ssrRenderComponent($setup["ClientOnlyComponent"], { msg: "bonjour" }, null, _parent2, _scopeId));
      } else {
        return [
          _createVNode($setup["ClientOnlyComponent"], { msg: "bonjour" })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(\`<!--]-->\`);
}`

    const result = await transform(input, options)

    // Check the transformation happened
    expect(result).toBeTruthy()
    expect(result?.code).toBeDefined()

    const code = result!.code

    // The key transformation: 'default' property should be removed from ClientOnly calls
    // Count how many times 'default: _withCtx' appears - should be 0 after transformation
    const defaultSlotMatches = code.match(/default:\s*_withCtx/g)
    expect(defaultSlotMatches).toBeNull() // All default slots should be removed

    // Verify fallback still exists in first call
    expect(code).toContain('fallback: _withCtx')

    // Verify both ClientOnly components are still called
    const clientOnlyCalls = code.match(/ClientOnly/g)
    expect(clientOnlyCalls).toBeTruthy()
    expect(clientOnlyCalls!.length).toBeGreaterThanOrEqual(4) // imports + 2 calls in code
  })
})
