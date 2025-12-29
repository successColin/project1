<script lang="ts" setup>
import DoesNotExist from '@/assets/images/404.png'

defineOptions({
  name: 'NotFoundPage',
})
</script>

<template>
  <div class="does-not-exist">
    <el-image :src="DoesNotExist" class="does-not-exist-image" />
    <h4>页面不存在</h4>
  </div>
</template>
<style lang="scss" scoped>
.does-not-exist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - var(--dsrz-header-height) - 62px);
  &-image {
    width: 250px;
  }
}
</style>
