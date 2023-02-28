export default {
  passToClient: ['pageProps', 'documentProps', 'someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  prerender: true,
  // the pattern of pages to render
  pagePattern: '**/+Page.tsx',
  // dynamic import for optimization
  // and typesafety <3
  onRenderHtml: () => import('./renderer/onRenderHtml.jsx'),
  onRenderClient: () => import('./renderer/onRenderClient.jsx'),
  // let me use functions in the config directly
  // no need for so much boilerplate
  onPageTransistionStart: () => {
    console.log('Page transition start')
    document.querySelector('body')!.classList.add('page-is-transitioning')
  },
  onPageTransistionEnd: () => {
    console.log('Page transition end')
    document.querySelector('body')!.classList.remove('page-is-transitioning')
  },
  onHydrationEnd: () => {
    console.log('Hydration finished; page is now interactive.')
  }
}
