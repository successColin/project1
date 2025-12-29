<!-- 截屏组件 -->
<template>
  <view class="container">
    <view class="container-cut">
      <BtCropper
        ref="cropper"
        :ratio="cutInd === 0 ? 4 / 3 : 3 / 4"
        :image-src="url"
        @change="onPositionChange"
      />
    </view>
    <view class="container-tip">
      {{
        cutInd === 0 ? "截取横屏" : "截取竖屏"
      }}
    </view>
    <view class="container-footer">
      <view class="container-footer-btn" @click="goBack">
        返回
      </view>
      <view class="container-footer-btn" @click="handleCrop">
        {{
          cutInd === 0 ? "下一步" : "确定"
        }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getUploadConfig } from '@/api/common';
import BtCropper from '../BtCropper/bt-cropper.vue';

defineProps({
  url: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['fileUrl']);
const cutInd = ref(0);
const cutUrlList = ref([]) as any;

const uploadImg = async (config: any, filePath: string) => {
  return new Promise((resolve, reject) => {
    const { dir, host, policy, ossAccessKeyId, signature } = config;
    const arr = filePath.split('.');
    const time = new Date().getTime();
    const num = Math.floor(Math.random() * 100) + 1;
    const url = `${time + num}.${arr[1]}`;
    const formData = {
      key: dir + url,
      policy,
      OssAccessKeyId: ossAccessKeyId,
      signature,
      success_action_status: '200',
    };
    uni.uploadFile({
      url: 'https://51shanky.oss-cn-hangzhou.aliyuncs.com/',
      filePath,
      name: 'file',
      formData,
      success: () => {
        resolve(`${host}${dir}${url}`);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

const cropper = ref();
const handleCrop = () => {
  cropper.value.crop().then(async (path: any) => {
    const config = ((await getUploadConfig()) as any) || {};
    const url = await uploadImg(config, path);
    cutUrlList.value[cutInd.value] = url;
    cutInd.value += 1;
    if (cutInd.value === 2) {
      emit('fileUrl', cutUrlList.value);
      cutInd.value = 0;
    }
  });
};

const goBack = () => {
  cutInd.value--;
  if (cutInd.value < 0) {
    cutInd.value = 0;
    emit('fileUrl', []);
  }
};

const onPositionChange = (ev: any) => {
  console.log('当前裁剪框位置:', ev);
};
</script>

<style lang="scss" scoped>
.container {
  height: 90vh;
  overflow: hidden;
  &-cut {
    height: 75vh;
  }
  &-tip {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #ffffff;
    text-align: center;
    margin: 40rpx 0 20rpx 0;
  }
  &-footer {
    display: flex;
    justify-content: space-evenly;
    &-btn {
      width: 182rpx;
      height: 74rpx;
      border-radius: 35rpx;
      text-align: center;
      line-height: 74rpx;
      border: 1rpx solid #ffffff;
      color: #ffffff;
      margin-top: 40rpx;
    }
  }
}
</style>
