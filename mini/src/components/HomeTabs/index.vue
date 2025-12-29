<template>
  <div class="homeTabs">
    <div
      v-for="item in arrOptions"
      :key="item.key"
      class="homeTabs__item"
      @click="handleClick(item)"
    >
      <template v-if="item.key === 'tabAdd'">
        <image
          class="homeTabs__item--add"
          lazy-load
          :src="item.btnIcon"
          style="width: 104rpx; height: 104rpx"
        />
      </template>
      <template v-else>
        <image
          lazy-load
          :src="currentKey === item.key ? item.selectedIconPath : item.iconPath"
          style="width: 52rpx; height: 52rpx"
        />
        <div
          class="homeTabs__item--title"
          :class="{ 'homeTabs__item--title--active': currentKey === item.key }"
        >
          {{ item.text }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentKey: {
    type: String,
    default: '',
  },
});

const APP_PLATFORM = import.meta.env.VITE_APP_PLATFORM;
console.log(APP_PLATFORM, import.meta.env);

const arrOptions = ref([]);
if (APP_PLATFORM === 'User') {
  arrOptions.value = [
    {
      key: 'tabHome',
      pagePath: '/pages/tab/home/index',
      iconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/86334c0780e24034bb566f7637cf3d67.png',
      selectedIconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/ea0f34291b3845a49d6a61470b6ec524.png',
      text: '首页',
    },
    {
      key: 'tabDistrict',
      pagePath: '/pages/tab/district/index',
      iconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/094be90980a24b93940d0cf31b84306b.png',
      selectedIconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/b4141861a8a94c6e999f28ed0e0e47de.png',
      text: '商圈',
    },
    {
      key: 'tabOrder',
      pagePath: '/pages/tab/order/index',
      iconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/6d41c8e1be1f44de8b1face333630a86.png',
      selectedIconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/189b8243571a4111a0ea8ba7ad0ff053.png',
      text: '订单',
      isLogin: true,
    },
    {
      key: 'tabMy',
      pagePath: '/pages/tab/my/index',
      iconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/ebb11cbf8acb4a2fb598609b74eae240.png',
      selectedIconPath:
        'https://oss.dcqcjlb.com/51che_java_dev/20251227/4cf04d5aa99941e7b34bd12743d39694.png',
      text: '我的',
    },
  ] as any;
}
else {
  arrOptions.value = [] as any;
}

const handleClick = async (v: any) => {
  if (v.pageTwo) {
    uni.navigateTo({
      url: v.pagePath,
    });
  }
  else {
    uni.switchTab({
      url: v.pagePath,
    });
  }
};
</script>

<style lang="scss" scoped>
.homeTabs {
  position: fixed;
  bottom: calc(constant(safe-area-inset-bottom) + 20rpx);
  bottom: calc(env(safe-area-inset-bottom) + 20rpx);
  left: 10rpx;
  width: 730rpx;
  height: 118rpx;
  background: #ffffff;
  border-radius: 20rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    &--title {
      margin-top: 6rpx;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 20rpx;
      color: #999;
      &--active {
        color: #000;
      }
    }
    &--add {
      position: relative;
      top: -26rpx;
      box-shadow: 0rpx 11rpx 16rpx 5rpx rgba(52, 134, 223, 0.1);
      border-radius: 50%;
    }
  }
}
</style>
