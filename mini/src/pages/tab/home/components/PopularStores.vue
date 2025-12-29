<template>
  <div class="section-header">
    <div class="section-title">
      热门店铺
    </div>
  </div>
  <shop-box @click="handleClick" />
</template>

<script setup lang="ts">
const handleClick = (item: any) => {
  console.log('click shop', item);
};
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 28rpx;
    background-color: #f8c638; // 类似图2中左边的黄色装饰条，如果有的话。或者直接去掉
    border-radius: 4rpx;
    display: none; // 图2看起来没有左侧竖条，只是文字
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
</style>
