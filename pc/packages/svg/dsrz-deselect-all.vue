<script lang="ts" setup>
/**
 * 取消全选Icon
 */
defineOptions({
  label: '取消全选',
  name: 'DsrzDeselectAll',
})
</script>
<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 6.5V6C19 4.89543 18.1046 4 17 4H6C4.89543 4 4 4.89543 4 6V17C4 18.1046 4.89543 19 6 19V19"
      stroke="currentColor"
    />
    <rect
      x="6.5"
      y="6.5"
      width="14"
      height="14"
      rx="1.5"
      stroke="currentColor"
    />
  </svg>
</template>
<style lang="scss" scoped>
svg {
  width: auto;
  height: auto;
}
</style>
