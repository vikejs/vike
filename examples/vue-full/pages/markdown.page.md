<script lang="ts" setup>
import Counter from '../components/Counter.vue'
</script>
<script>
export const documentProps = {
  title: 'Some Markdown Page'
}
</script>

# Markdown

This page is written in _Markdown_.

To enable Markdown add `vite-plugin-md` to your `vite.config.js`.

Interactive components can be included in the Markdown. <Counter/>
