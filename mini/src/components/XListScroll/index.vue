<template>
  <scroll-view scroll-x="true">
    <view class="flex">
      <slot />
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
defineProps({
  list: {
    type: Array,
    default: () => [] as any,
  },
});
</script>

<style lang="scss" scoped></style>
