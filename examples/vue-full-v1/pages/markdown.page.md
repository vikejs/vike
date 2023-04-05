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

Interactive components can be included in the Markdown. <Counter/>
