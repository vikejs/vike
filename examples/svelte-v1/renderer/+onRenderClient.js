import Layout from './Layout.svelte';

export default function onRenderClient({ pageProps, Page }) {
  const target = document.getElementById('app');

  new Layout({
    target,
    hydrate: true,
    props: {
      pageProps: pageProps,
      Page
    }
  });
}
