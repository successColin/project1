<template>
  <up-popup
    :safe-area-inset-bottom="false"
    :round="10"
    :show="show"
    mode="center"
    :close-on-click-overlay="true"
    @close="closepop"
  >
    <view class="pop-card">
      <span class="pop-card-title">实名认证</span>
      <view class="pop-card-content">
        应国家法规对于账号实名的要求，进行当前操作前，请您先完成实名认证，之后您可以使用发帖。评论等功能。
      </view>
      <view class="pop-card-input" style="margin-top: 50rpx;">
        <span class="pop-card-input-title">真实姓名</span>
        <up-input
          v-model="data.name"
          border="none"
          input-align="right"
          font-size="24rpx"
          placeholder="请填写姓名"
        />
      </view>
      <view class="pop-card-input" style="margin-top: 35rpx;">
        <span class="pop-card-input-title">身份证号</span>
        <up-input
          v-model="data.idCard"
          border="none"
          input-align="right"
          font-size="24rpx"
          placeholder="请填写身份证号"
        />
      </view>
      <span class="pop-card-button" @click="OnrealNameIdMatch">提交</span>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { realNameAdd } from '@/api/user';

import { useUserStore } from '@/store';

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);
const data = reactive({
  name: '',
  idCard: '',
});
// const radiovalue1 = ref(false);

const OnrealNameIdMatch = async () => {
  if (!data.name) {
    uni.showToast({
      icon: 'none',
      title: '请填写姓名',
    });
    return false;
  }
  if (!data.idCard) {
    uni.showToast({
      icon: 'none',
      title: '请填写身份证号',
    });
    return false;
  }
  //   if (!radiovalue1.value) {
  //     uni.showToast({
  //       icon: "none",
  //       title: "请同意并阅读个人信息保护声明",
  //     });
  //     return false;
  //   }

  await realNameAdd({
    realName: data.name,
    idCard: data.idCard,
  });
  uni.showToast({
    icon: 'none',
    title: '认证成功',
  });
  // userStore.setInfo({ realAuth: true });
  useUserStore().info();

  emit('close');
};
// const OnPushPrivacyPolicy = () => {
//   // uni.navigateTo({
//   //   url: '/pages/common/webview/index?url=https://h5.dcqcjlb.com/protocol/user_vehicle_consultation.html',
//   // });
//   uni.navigateTo({ url: "/pages/common/doc/personalInformationStatement" });
// };
const closepop = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.pop-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 584rpx;
  height: 528rpx;
  background-image: url('https://oss.dcqcjlb.com/51che_java_dev/20250930/1759215606332.png');
  background-size: 100% 100%;
  &-title {
    width: 504rpx;
    height: 48rpx;
    font-family: OPPOSans, OPPOSans;
    font-weight: 500;
    font-size: 46rpx;
    line-height: 48rpx;
    color: #222222;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-top: 40rpx;
  }
  &-content {
    width: 504rpx;
    height: 96rpx;
    font-family: OPPOSans, OPPOSans;
    font-weight: 500;
    font-size: 24rpx;
    line-height: 41rpx;
    color: #666666;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-top: 30rpx;
  }
  &-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 504rpx;
    height: 32rpx;
    &-title {
      width: 123rpx;
      height: 41rpx;
      font-family: OPPOSans, OPPOSans;
      font-weight: 500;
      font-size: 24rpx;
      line-height: 41rpx;
      color: #222222;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
  &-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 504rpx;
    height: 80rpx;
    background: #d91b1b;
    border-radius: 21rpx;
    font-family: OPPOSans, OPPOSans;
    font-weight: 500;
    font-size: 24rpx;
    color: #ffffff;
    text-align: right;
    font-style: normal;
    text-transform: none;
    margin-bottom: 20px;
    margin-top: 45rpx;
  }
}
</style>
