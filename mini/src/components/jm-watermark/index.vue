<template>
  <view>
    <view class="copyRightBox">
      <view v-for="(item, index) in 30" :key="index" class="font">
        {{ sytext }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 载入的标签数据
    sytext: String,
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style>
.copyRightBox {
  overflow: hidden;
  width: 100%;
  height: 700px;
  pointer-events: none;
  position: fixed;
  top: 20px;
  z-index: 99999;
  left: 20rpx;
}
.font {
  float: left;
  transform: rotate(-30deg);
  margin-top: 220upx;
  margin-left: 100upx;
  font-size: 34upx;
  color: rgba(100, 0, 0, 0.2);
}
</style>
