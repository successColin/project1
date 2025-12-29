<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter, type RouteLocationMatched } from 'vue-router'

import { useRouteListener } from 'dsrz/hooks/useRouteListener'

defineOptions({
  name: 'LayoutBreadcrumb',
})

const route = useRoute()
const router = useRouter()
const { listenerRouteChange } = useRouteListener()

const breadcrumbs = ref<RouteLocationMatched[]>([])

const getBreadcrumb = () =>
  (breadcrumbs.value = route.matched.filter(
    v => v.meta?.title && v.meta?.breadcrumb !== false,
  ))

const handleLink = (value: RouteLocationMatched) => {
  if (
    ['FullScreenPage', 'LayoutPage'].includes(value.components!.default.name!)
  )
    return
  const { path } = value
  router.push(path)
}

listenerRouteChange(() => getBreadcrumb(), true)
</script>
<template>
  <el-breadcrumb>
    <el-breadcrumb-item v-for="(v, i) in breadcrumbs" :key="i">
      <span v-if="breadcrumbs.length - 1 === i">{{ v.meta?.title }}</span>
      <a v-else @click.prevent="handleLink(v)">{{ v.meta?.title }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
