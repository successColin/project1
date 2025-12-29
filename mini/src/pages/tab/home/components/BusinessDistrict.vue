<template>
  <div class="business-district">
    <div class="section-header">
      <div class="section-title">
        热门商圈
      </div>
    </div>
    <shop-area />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.business-district {
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
  position: relative;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
</style>
