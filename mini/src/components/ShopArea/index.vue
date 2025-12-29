<template>
  <div class="district-list">
    <div
      v-for="(item, index) in districtList"
      :key="index"
      class="district-card"
    >
      <!-- 商圈大图 -->
      <div class="district-image-wrapper">
        <up-image
          :src="item.image"
          width="100%"
          height="320rpx"
          radius="16rpx 16rpx 0 0"
          mode="aspectFill"
        />
      </div>

      <div class="district-info">
        <!-- 名称 -->
        <div class="district-name">
          {{ item.name }}
        </div>
        <!-- 地址 -->
        <div class="district-address">
          <up-icon name="map" size="14" color="#999" />
          <span class="address-text">{{ item.address }}</span>
        </div>

        <!-- 店铺横向滚动 -->
        <scroll-view class="shop-scroll" scroll-x enable-flex>
          <div class="shop-wrapper">
            <div
              v-for="(shop, shopIndex) in item.shops"
              :key="shopIndex"
              class="shop-item"
            >
              <up-image
                :src="shop.image"
                width="120rpx"
                height="120rpx"
                radius="8rpx"
                mode="aspectFill"
              />
              <div class="shop-name">
                {{ shop.name }}
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 假数据
const districtList = ref([
  {
    id: 1,
    image: 'https://via.placeholder.com/700x320/eeeeee/999999?text=Wanda+Plaza',
    name: '西安大明宫万达',
    address: '陕西省西安市未央区太华北路369号',
    shops: [
      {
        id: 1,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop1',
        name: 'xxx店铺',
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop2',
        name: 'xxx店铺',
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop3',
        name: 'xxx店铺',
      },
      {
        id: 4,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop4',
        name: 'xxx店铺',
      },
      {
        id: 5,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop5',
        name: 'xxx店铺',
      },
      {
        id: 6,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop4',
        name: 'xxx店铺',
      },
      {
        id: 7,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop5',
        name: 'xxx店铺',
      },
      {
        id: 8,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop4',
        name: 'xxx店铺',
      },
      {
        id: 9,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop5',
        name: 'xxx店铺',
      },
    ],
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/700x320/eeeeee/999999?text=Saga+Mall',
    name: '小寨赛格',
    address: '西安市雁塔区长安中路123号',
    shops: [
      {
        id: 1,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop1',
        name: 'xxx店铺',
      },
      {
        id: 2,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop2',
        name: 'xxx店铺',
      },
      {
        id: 3,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop3',
        name: 'xxx店铺',
      },
      {
        id: 4,
        image: 'https://via.placeholder.com/140x140/dddddd/555555?text=Shop4',
        name: 'xxx店铺',
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
.district-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.district-card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  padding-bottom: 20rpx;
}

.district-info {
  padding: 20rpx;
}

.district-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.district-address {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .address-text {
    font-size: 24rpx;
    color: #999;
    margin-left: 8rpx;
  }
}

.shop-scroll {
  width: 100%;
  white-space: nowrap;
}

.shop-wrapper {
  display: flex;
  gap: 20rpx;
  padding-right: 20rpx; // 确保最后一个元素后有间距
}

.shop-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  flex-shrink: 0;

  .shop-name {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #333;
    width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
