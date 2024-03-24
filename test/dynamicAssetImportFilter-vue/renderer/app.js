export { createApp }

import { createSSRApp, defineAsyncComponent, defineComponent, h, markRaw, reactive } from 'vue'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'

function createApp(pageContext) {

  const { Page } = pageContext

  let rootComponent
  const PageWithShell = defineComponent({
    data: () => ({
      Page: markRaw(Page)
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default: () => {
            return h(this.Page)
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithShell)

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.ts`
  Object.assign(app, {
    changePage: (pageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `+onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make pageContext available from any Vue component
  setPageContext(app, pageContextReactive)

  //
  // Dynamically load components
  //
  pageContext.loadedComponents = new Set();

  const components = getAsyncComponentImports();

  for (const [name, ci] of components) {
    app.component(name, defineAsyncComponent(async () => {
        pageContext.loadedComponents.add(ci.path);
        return ci.import();
    }));
  }

  return app
}

function getAsyncComponentImports() {
  const rawComponents = import.meta.glob('/components/**/*.vue');
  const components = new Map();

  for (const path in rawComponents) {
      const name = basename(path);
      components.set(name, {
          path: path,
          import: rawComponents[path],
      });
  }

  return components
}

function basename(str) {
  let base = new String(str).substring(str.lastIndexOf('/') + 1);
  if (base.lastIndexOf('.') != -1) {
      base = base.substring(0, base.lastIndexOf('.'));
  }
  return base;
}
