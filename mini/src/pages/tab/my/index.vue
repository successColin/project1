<template>
  <view class="page-container">
    <!-- 顶部用户信息区域 -->
    <view class="header-section">
      <view class="user-info-box flex items-center">
        <view class="avatar-box mr-4">
          <u-avatar :src="userInfo.avatar" size="60" />
        </view>
        <view class="info-content flex-1">
          <view class="mb-2 flex items-center">
            <text class="nickname mr-2 text-lg font-bold">
              {{ userInfo.nickname }}
            </text>
            <view
              class="member-tag flex items-center rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white"
            >
              <text>会员</text>
            </view>
          </view>
          <view class="points-info text-sm text-gray-500">
            积分 {{ userInfo.points }}
          </view>
        </view>
        <view class="arrow-right">
          <u-icon name="arrow-right" color="#999" size="16" />
        </view>
      </view>
    </view>

    <!-- 订单卡片 -->
    <view class="order-card mx-4 mt-4 rounded-xl bg-white p-4 shadow-sm">
      <view
        class="card-header mb-4 flex items-center justify-between border-b border-gray-100 pb-2"
      >
        <text class="text-base font-bold">
          我的订单
        </text>
        <view class="flex items-center" @click="goToOrder(0)">
          <text class="mr-1 text-xs text-gray-400">
            全部订单
          </text>
          <u-icon name="arrow-right" color="#ccc" size="12" />
        </view>
      </view>
      <view class="grid-menu flex justify-around">
        <view
          class="grid-item flex flex-col items-center"
          @click="goToOrder(1)"
        >
          <u-icon name="scan" size="28" color="#333" />
          <text class="mt-2 text-xs text-gray-600">
            待核销
          </text>
        </view>
        <view
          class="grid-item flex flex-col items-center"
          @click="goToOrder(2)"
        >
          <u-icon name="chat" size="28" color="#333" />
          <text class="mt-2 text-xs text-gray-600">
            待评价
          </text>
        </view>
        <view
          class="grid-item flex flex-col items-center"
          @click="goToOrder(0)"
        >
          <u-icon name="list" size="28" color="#333" />
          <text class="mt-2 text-xs text-gray-600">
            全部订单
          </text>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view
      class="menu-list mx-4 mt-4 overflow-hidden rounded-xl bg-white shadow-sm"
    >
      <u-cell-group :border="false">
        <u-cell icon="star" title="我的收藏" is-link :border="true" />
        <u-cell icon="home" title="店铺入驻" is-link :border="true" />
        <u-cell icon="server-fill" title="联系客服" is-link :border="true" />
        <u-cell icon="info-circle" title="关于我们" is-link :border="false" />
      </u-cell-group>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-btn mx-4 mb-4 mt-8">
      <u-button
        text="退出登录"
        shape="circle"
        :plain="true"
        @click="handleLogout"
      />
    </view>

    <HomeTabs current-key="tabMy" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HomeTabs from '@/components/HomeTabs/index.vue';

const userInfo = ref({
  avatar: 'https://cdn.uviewui.com/uview/album/1.jpg', // 默认头像
  nickname: '轻舞飞扬',
  points: 1000,
});

const goToOrder = (status: number) => {
  console.log('Navigate to order with status:', status);
  // uni.navigateTo({ url: `/pages/order/list?status=${status}` })
};

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('用户点击确定');
        // 执行退出逻辑
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 100rpx; /* 为底部tab留出空间 */
}

.header-section {
  background-color: #fff;
  padding: 40rpx 30rpx;
  padding-top: calc(40rpx + var(--status-bar-height));
  /* 如果需要背景图或者渐变色可以在这里添加 */
}

.user-info-box {
  .avatar-box {
    border: 2rpx solid #eee;
    border-radius: 50%;
    padding: 2rpx;
  }
}

.order-card {
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.menu-list {
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}
</style>
