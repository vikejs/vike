<script>
  export let Page;
  export let pageProps;
</script>

<div class="layout">
  <nav class="sidebar">
    <a class="nav-item" href="/">
      Home
    </a>
    <a class="nav-item" href="/about">
      About
    </a>
  </nav>

  <div class="content">
    <svelte:component this={Page} {...pageProps} />
  </div>
</div>

<style>
  :global(body) {
    font-family: sans-serif;
    margin: 0;
  }

  :global(*),
  :global(*::before)
  :global(*::after) {
    box-sizing: border-box;
  }

  :global(a) {
    text-decoration: none;
  }

  .layout {
    display: flex;
    margin: auto;
    max-width: 900px;
  }

  .sidebar {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    line-height: 1.8em;
    padding: 42px 20px 20px 20px;
  }

  .nav-item {
    padding: 3px;
  }

  .content {
    border-left: 2px solid #eee;
    min-height: 100vh;
    padding: 20px 20px 50px 20px;
  }
</style>
