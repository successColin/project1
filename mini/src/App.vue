<script setup lang="ts">
import { useAppStore, useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { mpUpdate } from '@/utils/index';

onLaunch((options) => {
  const APP_PLATFORM = import.meta.env.VITE_APP_PLATFORM;
  if (
    APP_PLATFORM === 'Merchant'
    && options?.path !== 'pages/tab/homeSJ/index'
  ) {
    uni.reLaunch({
      url: '/pages/tab/homeSJ/index',
    });
  }
  mpUpdate();
  // #ifdef MP-WEIXIN
  if (isLogin()) {
    useUserStore().info();
  }
  // #endif
});
onShow((v: any) => {
  if (v?.referrerInfo?.extraData?.state === 1) {
    uni.$u.toast('支付成功');
    uni.navigateTo({ url: '/pages/roadhelp/index' });
  }
  useAppStore().initSystemInfo();
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/* 每个页面公共css */
@import "uview-plus/index.scss";
@import "@/static/styles/common.scss";
</style>
