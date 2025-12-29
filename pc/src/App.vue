<script setup lang="ts">
import useAppStore from './stores/modules/app'

const {
  globalConfig: { watermark },
} = useAppStore()
</script>

<template>
  <el-watermark v-bind="watermark" >
    <RouterView />
  </el-watermark>
</template>

<style scoped></style>
