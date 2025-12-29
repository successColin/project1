<template>
  <view class="loginEle">
    <div class="loginEle__login flex-c-c">
      <a-image width="200rpx" height="200rpx" :src="appInfo.avatar" />
      <div class="loginEle__login--title">
        {{ appInfo.simpleName }}
      </div>
    </div>
    <div class="loginEle__agreement">
      <view style="position: absolute; top: -50rpx; left: 90rpx; z-index: 999">
        <image
          v-if="isAgree" style="width: 250rpx; height: 54rpx"
          src="https://oss.dcqcjlb.com/51che_java_dev/20250825/85b5bdc89e0f46e3b3236ba30a06cf2e.png"
        />
      </view>
      <div style="display: flex; align-items: baseline;margin: 20rpx;">
        <up-checkbox-group v-model="isOk" placement="column" @change="checkboxChange">
          <up-checkbox style="transform: scale(0.7)" active-color="#d91b1b" :name="true" />
        </up-checkbox-group>
        <div style="line-height: 38rpx;">
          <span>已阅读并同意授权{{ `${appInfo.appName}、` }}51车俱乐部获得本人个人信息，以便提供更好的服务，详见</span>
          <span style="color: #d91b1b" @click="lookAgree(1)">《用户协议》</span>
          和<span style="color: #d91b1b" @click="lookAgree(2)">《隐私政策》</span>
        </div>
      </div>
    </div>
    <div class="loginEle__btn">
      <button v-if="!isOk.length" class="loginEle__btn--color" @click="beforeGetPhone">
        手机号快捷登录
      </button>
      <button v-else class="loginEle__btn--color" openType="getPhoneNumber" @getphonenumber="getPhoneNumber">
        手机号快捷登录
      </button>
      <div class="loginEle__btn__no" @click="handleBack">
        暂不登录
      </div>
    </div>
  </view>
</template>

<script setup lang="ts">
import { getAppinfo } from '@/api/home';
import { useUserStore } from '@/store';
import { nimLogin } from '@/utils';

const userStore = useUserStore();

const isOk = ref([]);
const isAgree = ref(false);
const isback = ref(0);
onLoad((options: any) => {
  isback.value = Number(options.back);
  console.log(isback.value, typeof (isback.value), 'isback.value');
});
const checkboxChange = (val: any) => {
  if (val[0]) {
    isAgree.value = false;
  }
  else {
    isAgree.value = true;
  }
};

const beforeGetPhone = () => {
  if (!isOk.value.length) {
    isAgree.value = true;
  }
};
const lookAgree = (type: number) => {
  uni.navigateTo({
    url: `/pages/my/set/components/agreement?type=${type}`,
  });
  // const externalUrl = ref('');
  // externalUrl.value = type === 1 ? 'https://h5.51chejlb.com/saas4sprotocol/user_service.html' : 'https://h5.51chejlb.com/saas4sprotocol/user_privacy.html';
  // uni.navigateTo({
  //   url: `/pages/my/webview/index?url=${encodeURIComponent(externalUrl.value)}`,
  // });
};
const getPhoneNumber = (val: any) => {
  console.log('111111111111111');
  // if (!isOk.value.length) return (isAgree.value = true);
  const phoneCode = val.detail.code;
  if (!phoneCode) return;
  uni.login({
    provider: 'weixin',
    onlyAuthorize: true,
    success: async ({ code }: any) => {
      try {
        const isNew = (await userStore.isNewUser({
          code: phoneCode,
        })) as any;
        console.log('======>>>', isNew);
        if (isNew) {
          const res = await userStore.login({
            grant_type: 'wechat',
            phoneCode,
            // #ifdef MP-WEIXIN
            appid: uni.getAccountInfoSync().miniProgram.appId,
            // #endif
            openCode: code,
          });
          console.log(res);

          await userStore.info();
          nimLogin();
          // uni.navigateBack();

          if (isback.value === 1) {
            console.log('111111111111>>>');

            uni.navigateBack();
          }
          else {
            console.log('2222222222>>>>');

            uni.switchTab({
              url: '/pages/tab/home/index',
            });
          }
        }
        else {
          // uni.navigateTo({
          //   url: `/pages/common/register/index?phoneCode=${phoneCode}&openCode=${code}&back=${isback.value}`,
          // });
        }
      }
      catch (error) {
        uni.$u.toast(error);
      }
    },
  });
};

const handleBack = () => {
  uni.navigateBack();
};

const appInfo = reactive({}) as any;
const getInfo = async () => {
  const res = await getAppinfo();
  Object.assign(appInfo, res);
};
getInfo();
</script>

<style lang="scss" scoped>
.loginEle {
  height: 100vh;
  background: url("https://oss.dcqcjlb.com/51che_java_dev/20250603/cdf9c6afd5bd43c1ba667f896c36e28e.png") no-repeat;
  background-size: 100% 100%;

  &__login {
    padding-top: 25vh;
    flex-direction: column;
    font-weight: 500;
    font-size: 36rpx;
    color: #222222;

    &--title {
      margin-top: 32rpx;
    }
  }

  &__agreement {
    margin-top: 20vh;
    position: relative;
  }

  &__btn {
    &--color {
      width: 500rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: #d91b1b;
      border-radius: 40rpx;
      text-align: center;
      margin: auto;
      margin-top: 7vh;
      font-weight: 500;
      font-size: 28rpx;
      color: #ffffff;

      &::after {
        border: 0;
      }
    }

    &__no {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 28rpx;
      color: #999999;

      margin: 30rpx 0;
    }

    // .otherBtn {
    //   background: #f8f8f8;
    //   font-family: PingFang SC;
    //   color: #999999;
    // }
  }
}
</style>
