<template>
  <view class="order-detail">
    <view class="card-box">
      <!-- 订单编号和复制 -->
      <up-cell-group :border="false">
        <up-cell :border="true" right-icon="file-copy" @click="copyOrderNo">
          <template #title>
            <view class="flex-items-center">
              <text class="order-text">
                订单编号:
              </text>
              <text class="order-text">
                {{ orderNo }}
              </text>
              <a-image
                src="https://oss.dcqcjlb.com/51che_java_dev/20250716/file_1752627562814.png"
                width="22rpx"
                height="22rpx"
                style="margin-left: 10rpx; position: relative; top: -4rpx"
              />
            </view>
          </template>
        </up-cell>
      </up-cell-group>

      <!-- 商品信息 -->
      <view class="product-info-list">
        <view
          v-for="(product, idx) in productList"
          :key="idx"
          class="product-info flex"
        >
          <up-image
            :src="product.img"
            width="50"
            height="50"
            shape="square"
            radius="10"
          />
          <view class="ml-20rpx">
            <view class="title line-clamp-1">
              {{ product.name }}
            </view>
            <view class="time">
              {{ product.time }}
            </view>
            <view class="price">
              <text class="price-symbol">
                ¥
              </text>
              {{ product.price }}
            </view>
          </view>
        </view>
      </view>

      <!-- 二维码和核销码 -->
      <view class="qrcode-section flex flex-col items-center">
        <view class="qrcode-wrapper">
          <up-qrcode cid="qrcode" :val="qrcode" :size="160" />
        </view>
        <view class="code mt-10rpx" :class="[status]">
          {{ code }}
        </view>
      </view>
    </view>

    <view class="card-box">
      <!-- 动态信息项循环渲染 -->
      <up-cell-group :border="false">
        <up-cell v-for="(item, idx) in infoList" :key="idx" :title="item.label">
          <template #value>
            <text :style="item.valueStyle">
              {{ item.value }}
            </text>
          </template>
        </up-cell>
      </up-cell-group>
    </view>
    <view class="card-box">
      <!-- 套餐列表 -->
      <view class="package-section">
        <view class="package-title">
          套餐包含
        </view>
        <up-list height="auto">
          <up-list-item v-for="(item, idx) in packageList" :key="idx">
            <view class="package-item w-full flex justify-between">
              <view>{{ item.name }}</view>
              <view>{{ item.price }}元（{{ item.count }}份）</view>
            </view>
          </up-list-item>
        </up-list>
        <view v-if="status === 'used'" class="package-btn">
          <up-button
            :custom-style="{
              width: '30%',
              background: '#D91B1B',
              borderRadius: '100rpx 100rpx 100rpx 100rpx',
              fontSize: '24rpx',
              color: '#ffffff',
              margin: '0px',
            }"
            type="primary"
            size="small"
            @click="onViewCard"
          >
            查看卡券
          </up-button>
        </view>
      </view>
    </view>
    <!-- 按钮 -->
    <view v-if="status === 'unused'" class="btn-section mt-30 flex justify-end">
      <up-button
        :custom-style="{
          width: '30%',
          background: '#F8F8F8',
          borderRadius: '100rpx 100rpx 100rpx 100rpx',
          fontSize: '24rpx',
          color: '#999999',
          margin: '0px',
          borderColor: '#999999',
        }"
        :plain="true"
        size="small"
        @click="onRefund"
      >
        申请退款
      </up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
interface InfoItem {
  label: string;
  value: string;
  valueStyle?: Record<string, any>;
}

const props = defineProps<{
  orderNo: string;
  productList: {
    name: string;
    img: string;
    time: string;
    price: string | number;
  }[];
  qrcode: string;
  code: string;
  status: string; // 这里直接写 string
  infoList: InfoItem[];
  packageList: any[];
}>();

const copyOrderNo = () => {
  uni.setClipboardData({
    data: props.orderNo,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'none' });
    },
  });
};

const onRefund = () => {
  // emit('refund')
};

const onViewCard = () => {
  // emit('view-card')
};
</script>

<style scoped lang="scss">
.order-detail {
  padding: 20rpx;
  background: #f8f8f8;
  .product-info-list {
    .product-info {
      margin: 20rpx 0;
      border-bottom: 1rpx solid #e8e8e8;
      padding: 20rpx 0;
      .title {
        font-weight: 500;
        font-size: 28rpx;
        color: #222222;
      }
      .time {
        font-size: 24rpx;
        color: #999999;
        height: 50rpx;
        line-height: 50rpx;
      }
      .price {
        font-size: 32rpx;
        color: #222222;
      }
    }
  }
  .qrcode-section {
    .qrcode-wrapper {
      margin: 20rpx 0;
    }
    .code {
      margin-top: 10rpx;
      font-size: 32rpx;
      letter-spacing: 8rpx;
      &.used {
        color: #ccc;
        text-decoration: line-through;
      }
      &.unused {
        color: #222;
      }
    }
  }
  .package-section {
    color: #222222;
    .package-title {
      font-weight: 500;
      margin-bottom: 10rpx;
      font-size: 28rpx;
      height: 50rpx;
      line-height: 50rpx;
    }
    .package-item {
      font-size: 24rpx;
      margin-bottom: 16rpx;
    }
    .package-btn {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      box-sizing: border-box;
    }
  }
  .btn-section {
    margin-top: 30rpx;
  }
}
.order-text {
  font-size: 24rpx;
  color: #999999;
}
.price-symbol {
  font-size: 80%;
  color: #222;
  font-weight: normal;
}
.card-box {
  background: #ffffff;
  border-radius: 20rpx 20rpx 20rpx 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
</style>
