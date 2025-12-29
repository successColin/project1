<script setup lang="ts">
import LayoutRouterView from '@/components/router/index.vue'
import useAppStore from '@/stores/modules/app'

defineOptions({
  name: 'LayoutRouterView',
})

const props = defineProps({
  number: {
    type: Number,
    default: 2,
  },
})

const appStore = useAppStore()
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive :include="appStore.globalConfig.cachedViews">
      <component
        v-if="route.matched.length === props.number"
        :is="Component"
        :key="route.path"
      />
      <LayoutRouterView
        v-else-if="route.matched.length >= props.number + 1"
        :number="props.number + 1"
      />
    </KeepAlive>
  </RouterView>
</template>

<style scoped></style>
