<template>
  <div class="home-container">
    <page-scroll
      :request="requestFun"
      scroll-height="calc(100vh - 33px)"
      :is-bottom-height="true"
      custom-bottom-height="30rpx"
      :rows="15"
      :is-pull-refresh="true"
    >
      <template #content="{ list }">
        <!-- 轮播 -->
        <Carousel />
        <!-- 分类广告位 -->
        <ClassifiedAD />
        <!-- 热门商圈 -->
        <BusinessDistrict />
        <!-- 热门店铺 -->
        <PopularStores :list="list" />
      </template>
    </page-scroll>
    <BottomHeight />
    <home-tabs current-key="tabHome" />
  </div>
</template>

<script setup lang="ts">
import BusinessDistrict from './components/BusinessDistrict.vue';
import Carousel from './components/Carousel.vue';
import ClassifiedAD from './components/ClassifiedAD.vue';
import PopularStores from './components/PopularStores.vue';

const requestFun = async () => {
  return new Promise((resolve) => {
    // reject
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: [{}],
        },
      });
    }, 1000);
  });
};
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20rpx;
  box-sizing: border-box;
}
</style>
