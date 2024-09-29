<template>
  <link rel="icon" :href="logoUrl" />
  <link v-if="canonicalUrl" rel="canonical" :href="canonicalUrl" />
</template>

<script lang="ts" setup>
import logoUrl from '../assets/logo.svg'

import { usePageContext } from 'vike-vue/usePageContext'
import { PageContext } from 'vike/types'

const pageContext = usePageContext()

function getCanonicalUrl(pageContext: PageContext): null | string {
  // In general a canonical URL on an error page doesn't make much sense.
  // On the other hand, in the future we might want to support setting a canonical URL on a 404
  // page for handling link deprecation.
  //
  // See also https://vike.dev/render
  if (pageContext.is404 || pageContext.abortStatusCode || pageContext.abortReason) {
    return null
  }
  return new URL(pageContext.urlPathname, pageContext.config.baseCanonicalUrl).toString()
}

const canonicalUrl = getCanonicalUrl(pageContext)
</script>
