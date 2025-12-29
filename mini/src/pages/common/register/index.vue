<template>
  <div class="register">
    <div class="register__box">
      <div class="register__box__title">
        设置头像
      </div>
      <view class="register__box__headCustom flex">
        <button
          class="checkPhoto"
          openType="chooseAvatar"
          @chooseavatar="handleAvatar"
        >
          <image
            v-if="!dataList.avatar"
            src="https://oss.dcqcjlb.com/51che_java_dev/20250610/cccb05de46db40b2a94e06e5fa9a9e3f.png"
            mode="widthFix"
          />
          <image v-else :src="dataList.avatar" mode="widthFix" />
        </button>
      </view>
      <div class="register__box__line" />
      <div class="register__box__title">
        设置昵称
      </div>
      <input
        v-model="dataList.nickname"
        class="register__box__name"
        type="text"
        placeholder="请设置昵称"
        placeholder-style="text-align: center;color: #999;"
      >
      <div class="register__box__lineOther" />
    </div>

    <div class="register__footer">
      <div class="register__footer__btn" @click="handleSubmit">
        立即登录
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import { nimLogin } from '@/utils';
import { uploadAvatarFun } from '@/utils/common';

const dataList = reactive({
  avatar: '',
  nickname: '',
}) as any;

const phoneCode = ref('');
const openCode = ref('');
const isback = ref(0);
onLoad((options: any) => {
  console.log(options, 'options');
  if (options.phoneCode) {
    phoneCode.value = options.phoneCode;
  }
  if (options.openCode) {
    openCode.value = options.openCode;
  }
  if (options.back) {
    isback.value = Number(options.back);
  }
});

const handleAvatar = async (val: any) => {
  console.log(val, 'vvvvvvvvvvv');
  const url = await uploadAvatarFun(val.detail.avatarUrl);
  dataList.avatar = url;
};
const userStore = useUserStore();
console.log(userStore);
const handleSubmit = async () => {
  if (!dataList.avatar) return uni.$u.toast('请选择头像');
  if (!dataList.nickname) return uni.$u.toast('请填写用户昵称');
  try {
    const { source, scene, sceneId, invitenId } = userStore.shareObj || {};
    await userStore.login({
      grant_type: 'wechat',
      phoneCode: phoneCode.value,
      // #ifdef MP-WEIXIN
      appid: uni.getAccountInfoSync().miniProgram.appId,
      // #endif
      avatar: dataList.avatar,
      nickname: dataList.nickname,
      openCode: openCode.value,
      source,
      scene,
      sceneId,
      invitenId,
    });
    await userStore.info();
    nimLogin();
    // uni.navigateBack({
    //   delta: 2,
    // });
    if (isback.value && isback.value === 1) {
      uni.navigateBack({
        delta: 2,
      });
    }
    else {
      uni.switchTab({
        url: '/pages/tab/home/index',
      });
    }
  }
  catch (error) {
    uni.$u.toast(error);
  }
  // uni.login({
  //   provider: 'weixin',
  //   onlyAuthorize: true,
  //   success: async ({ code }: any) => {
  //   },
  // });
};
</script>

<style lang="scss" scoped>
.register {
  height: 100vh;
  overflow: hidden;
  position: relative;
  &__box {
    margin: 10rpx;
    background: #ffffff;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0;
    &__title {
      font-weight: 500;
      font-size: 28rpx;
      color: #000000;
      text-align: center;
      padding-bottom: 80rpx;
    }
    &__headCustom {
      .checkPhoto {
        width: 160rpx;
        height: 160rpx;
        display: inline-flex;
        padding: 0;
        border-radius: 50%;
        border: none;
        outline: none;
        margin-bottom: 80rpx;
        imgae {
          width: 100%;
          height: 100%;
        }
      }
      .checkPhoto::after {
        border: none;
      }
    }
    &__line {
      width: 680rpx;
      border-top: 2rpx dashed #e8e8e8;
      display: flex;
      padding-bottom: 80rpx;
    }
    &__name {
      text-align: center;
      font-weight: 500;
      font-size: 24rpx;
      width: 100%;
      padding-bottom: 30rpx;
    }
    &__lineOther {
      border-bottom: 2rpx solid #e8e8e8;
      display: flex;
      // padding-bottom: 30rpx;
      width: 680rpx;
    }
  }
  &__footer {
    position: absolute;
    bottom: calc(constant(safe-area-inset-bottom) + 20rpx);
    bottom: calc(env(safe-area-inset-bottom) + 20rpx);
    width: 100%;
    &__btn {
      width: 600rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: #d91b1b;
      border-radius: 100rpx;
      text-align: center;
      font-weight: 500;
      color: #fff;
      font-size: 28rpx;
      background: #d91b1b;
      color: #fff;
      margin: 30rpx auto;
    }
  }
}
</style>
