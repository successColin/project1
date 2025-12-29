<template>
  <movable-area>
    <movable-view :x="x" :y="y" direction="all">
      <slot />
    </movable-view>
  </movable-area>
</template>

<script setup lang="ts">
defineProps({
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss" scoped>
movable-area {
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
  top: 0;

  movable-view {
    position: absolute;
    width: 120rpx;
    height: 120rpx;
    display: inline-block;
    pointer-events: auto;
    image {
      width: 120rpx;
      height: 120rpx;
      position: relative;
      // z-index: 99;
    }
  }
}
</style>
