<template>
  <up-popup
    :show="show"
    mode="center"
    :custom-style="customStyle"
    :safe-area-inset-bottom="false"
  >
    <view class="popup">
      <view v-if="title" class="popup-title">
        {{ title }}
      </view>
      <view v-if="content" class="popup-content">
        {{ content }}
      </view>
      <slot name="content" />
      <view v-if="showBtn" class="popup-btn_div flex justify-center">
        <template v-if="!onlyConfirm">
          <view class="popup-cancel popup-btn" @click="emit('cancel')">
            {{ cancelTxt }}
          </view>
          <view class="popup-btn popup-confirm" @click="emit('confirm')">
            {{ confirmTxt }}
          </view>
        </template>
        <view
          v-else
          class="popup-btn popup-confirm_one"
          @click="emit('confirm')"
        >
          {{ confirmTxt }}
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
const props = defineProps({
  widthHeight: {
    type: Array<string>,
    default: ['584rpx', '408rpx'],
  },
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  cancelTxt: {
    type: String,
    default: '取消',
  },
  confirmTxt: {
    type: String,
    default: '保存',
  },
  showBtn: {
    type: Boolean,
    default: true,
  },
  onlyConfirm: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const customStyle = {
  width: props.widthHeight[0],
  height: props.widthHeight[1],
  borderRadius: '20rpx',
};
</script>

<style lang="scss" scoped>
.popup {
  padding: 40rpx;
  display: flex;
  flex-direction: column;

  &-title {
    font-weight: 500;
    font-size: 36rpx;
    color: #222222;
  }

  &-content {
    margin-top: 40rpx;
    font-weight: 500;
    font-size: 24rpx;
    color: #222222;
    line-height: 1.6;
  }

  &-btn_div {
    margin-top: 40rpx;
  }

  &-btn {
    // width: 240rpx;
    flex: 1;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 16rpx;
    text-align: center;
    font-weight: 500;
    font-size: 24rpx;
    color: #ffffff;
  }

  &-cancel {
    background: #999999;
    margin-right: 40rpx;
  }

  &-confirm {
    background: #d91b1b;
  }

  &-confirm_one {
    background: #d91b1b;
    width: 330rpx;
  }
}
</style>
