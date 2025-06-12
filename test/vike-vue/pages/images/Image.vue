<template>
  <img :src v-bind="otherAttrs" />

  <Config
    :title="`Image created by ${ author }`"
    :description="`Image at address ${ src } was created by ${ author }`"
    :Head="headTag"
  />
  <Head>
    <meta property="og:image" :content="src" />
  </Head>
</template>

<style scoped>
img {
  height: 48px;
  vertical-align: middle;
  margin-left: 10px;
}
</style>

<script lang="ts" setup>
import { useAttrs, h } from 'vue'
import { useConfig } from 'vike-vue/useConfig'
import { Config } from 'vike-vue/Config'
import { Head } from 'vike-vue/Head'

defineOptions({
  name: 'Image',
  inheritAttrs: false,
})

const { src, author, ...otherAttrs } = useAttrs() as { src: string; author: string }

const config = useConfig()
config({
  Head: h('script', {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org/',
      contentUrl: { src },
      creator: {
        '@type': 'Person',
        name: author,
      },
    }),
  }),
})

const headTag = h('meta', { property: 'og:author', content: author })
</script>
