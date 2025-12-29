<template>
  <div class="shop-box">
    <div
      v-for="(item, index) in shopList"
      :key="index"
      class="shop-item"
      @click="handleShopClick(item)"
    >
      <div class="shop-item__left">
        <!-- 使用 uview-plus 图片组件 -->
        <up-image
          :src="item.logo"
          width="160rpx"
          height="160rpx"
          radius="10rpx"
          mode="aspectFill"
        />
      </div>
      <div class="shop-item__right">
        <div class="shop-item__header">
          <span v-if="item.tag" class="shop-tag" :class="item.tagType">{{
            item.tag
          }}</span>
          <span class="shop-name">{{ item.name }}</span>
        </div>
        <div class="shop-item__middle">
          <up-rate
            :model-value="item.score"
            readonly
            size="14"
            gutter="2"
            active-color="#ff9900"
          />
          <span class="shop-score">{{ item.score.toFixed(1) }}分</span>
        </div>
        <div class="shop-item__bottom">
          <span class="shop-sales">销量{{ item.sales }}+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  shopList: {
    type: Array,
    default: () => {
      return [
        {
          id: 1,
          logo: 'https://via.placeholder.com/160x160/cccccc/ffffff?text=Logo', // 占位图
          name: 'xxx店铺（万达店）',
          tag: '直营店',
          tagType: 'direct', // 样式类名
          score: 3.0,
          sales: 3000,
        },
        {
          id: 2,
          logo: 'https://via.placeholder.com/160x160/cccccc/ffffff?text=Logo',
          name: 'xxx店铺（万达店）',
          tag: '精选店',
          tagType: 'selected',
          score: 3.0,
          sales: 3000,
        },
        {
          id: 3,
          logo: 'https://via.placeholder.com/160x160/cccccc/ffffff?text=Logo',
          name: 'xxx店铺（万达店）',
          tag: '',
          tagType: '',
          score: 3.0,
          sales: 8000,
        },
        {
          id: 4,
          logo: 'https://via.placeholder.com/160x160/cccccc/ffffff?text=Logo',
          name: '古城（万达店）',
          tag: '',
          tagType: '',
          score: 3.0,
          sales: 8000,
        },
      ];
    },
  },
});

const emit = defineEmits(['click']);

const handleShopClick = (item: any) => {
  emit('click', item);
};
</script>

<style lang="scss" scoped>
.shop-box {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.shop-item {
  display: flex;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 16rpx;
  &__left {
    margin-right: 20rpx;
    flex-shrink: 0;
  }
  &__right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4rpx 0;
  }
  &__header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .shop-tag {
    font-size: 20rpx;
    padding: 2rpx 8rpx;
    border-radius: 6rpx;
    margin-right: 10rpx;
    color: #fff;
    line-height: 1.2;
    &.direct {
      background-color: #f8c638; // 直营店 黄色
    }
    &.selected {
      background-color: #5faaff; // 精选店 蓝色
    }
  }
  .shop-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    // @include ellipsis(1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 360rpx;
  }
  &__middle {
    display: flex;
    align-items: center;
    margin-top: 10rpx;
    .shop-score {
      font-size: 24rpx;
      color: #666;
      margin-left: 10rpx;
      font-weight: 500;
    }
  }
  &__bottom {
    margin-top: 10rpx;
    .shop-sales {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
