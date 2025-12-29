<template>
  <div class="cover">
    <template v-if="isCut">
      <div
        class="cover__back"
        :style="[{ top: statusBarHeight }]"
        @click="handleiBack"
      >
        <up-icon name="arrow-left" color="#FFFFFF" />
      </div>

      <div :style="[{ marginTop: blankHeight }]" />
      <!-- 图片 -->
      <div class="cover__img" :style="[{ height: imgHeight }]">
        <image :src="showImage" mode="aspectFit" style="height: 100%" />
      </div>
      <!-- 选择封面 -->
      <div class="cover__select">
        <view class="cover__select--title">
          <div>设置封面</div>
          <div
            class="cover__select--title--ok"
            style="font-size: 24rpx"
            @click="goCut"
          >
            下一步
          </div>
        </view>
        <div class="cover__tabs">
          <div
            v-for="(item, i) in list"
            :key="i"
            class="cover__tabs--item"
            :class="current === i ? 'tabselect' : ''"
            @click="handleTabs(i)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="cover__update">
          <div v-if="current === 0">
            <scroll-view
              scroll-x="true"
              :scroll-into-view="scrollTo"
              scroll-with-animation
              @scroll="handleScroll"
            >
              <div style="display: flex; flex-wrap: nowrap">
                <div id="resset" class="cover__update--white" />
                <image
                  v-for="(_item, i) in time"
                  :key="i"
                  class="cover__update--image"
                  :style="[imageStyle]"
                  :src="`${videoUrl}?x-oss-process=video/snapshot,t_${i}000,ar_auto`"
                />
                <div class="cover__update--white" />
              </div>
            </scroll-view>
            <div class="cover__update--line" />
            <div class="cover__update--dec">
              左右滑动可选择封面
            </div>
          </div>
          <div
            v-else-if="coverImg"
            style="display: flex; flex-direction: column; align-items: center"
            @click="uploadImg"
          >
            <image :style="[imageStyle]" :src="coverImg" />
          </div>
        </div>
        <!-- 重置 -->
        <div class="cover__reset">
          <div class="cover__reset--btn" @click="handleReset">
            <image
              src="https://oss.dcqcjlb.com/51che_java_dev/20231207/file_1701913817723.png"
            />
            {{ current === 0 ? "重置" : "点击替换" }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <CutImage :url="showImage" @file-url="getFileUrl" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { getUploadConfig } from '@/api/common';

import { useAppStore } from '@/store';

import CutImage from './components/CutImage/index.vue';

const appStore = useAppStore() as any;
const statusBarHeight = `${appStore.systemInfo.statusBarHeight}px`;

const time = ref(0);
const videoUrl = ref('');
const isCut = ref(true);
const urlParams = ref('?x-oss-process=video/snapshot,t_0,ar_auto');
const imageSize = ref(60);
const current = ref(0);
const coverImg = ref('');
const coverImageType = ref(2); // 1-横屏；2-竖屏
const scrollTo = ref('resset');
const list = ref([
  {
    name: '视频帧',
  },
  {
    name: '相册导入',
  },
]);
const cutUrlList = ref([]);

console.log(1111111111);

onLoad((option: any) => {
  time.value = Math.floor(option.time);
  videoUrl.value = option.url;
});

const imageStyle = computed(() => {
  return {
    width: `${imageSize.value * 2}rpx`,
    height: `${imageSize.value * 2}rpx`,
  };
});

const blankHeight = computed(() => {
  return `calc(${statusBarHeight} + 80rpx)`;
});

const imgHeight = computed(() => {
  return `calc(100vh - 644rpx - ${statusBarHeight} - 80rpx)`;
});

const showImage = computed(() => {
  if (current.value === 1 && coverImg.value) {
    return coverImg.value;
  }
  return videoUrl.value + urlParams.value;
});

const goCut = () => {
  isCut.value = false;
};

const handleOk = () => {
  uni.navigateBack({
    success: () => {
      const params = {
        crossUrl: cutUrlList.value[0],
        verticalUrl: cutUrlList.value[1],
      };
      uni.$emit('getCover', params);
    },
  });
};

const getFileUrl = (e: any) => {
  cutUrlList.value = e;
  isCut.value = true;
  if (e.length > 0) {
    handleOk();
  }
};

const handleiBack = () => {
  uni.navigateBack();
};

const handleScroll = (e: any) => {
  const left = e.detail.scrollLeft;
  const i = Math.floor(left / imageSize.value);
  urlParams.value = `?x-oss-process=video/snapshot,t_${i * 1000},ar_auto`;
};

const uploadImgFun = async (config: any, filePath: string) => {
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
// 上传方法
const uploadImg = () => {
  uni.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    // sourceType: this.sourceType, // 从相册选择
    success: async (res) => {
      const url = res.tempFilePaths[0];
      wx.getImageInfo({
        src: url,
        success(res) {
          const { height, width } = res;
          // 1-横屏；2-竖屏
          if (width / height > 1) {
            coverImageType.value = 1;
          }
          else {
            coverImageType.value = 2;
          }
        },
      });
      const config = ((await getUploadConfig()) as any) || {};
      const newUrl = (await uploadImgFun(config, url)) as string;
      coverImg.value = newUrl;
    },
  });
};

const handleTabs = (i: number) => {
  current.value = i;
  if (i === 1 && coverImg.value === '') {
    // 上传
    uploadImg();
  }
};

const handleReset = () => {
  if (current.value === 0) {
    scrollTo.value = '';
    nextTick(() => {
      scrollTo.value = 'resset';
      urlParams.value = '?x-oss-process=video/snapshot,t_0,ar_auto';
    });
  }
  else {
    uploadImg();
  }
};
</script>

<style lang="scss" scoped>
.cover {
  position: relative;
  height: 100vh;
  background: #111111;
  overflow: hidden;

  &__back {
    position: absolute;
    left: 25rpx;
    padding: 25rpx;
  }

  &__img {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__select {
    // height: 631rpx;
    background: #333333;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    position: fixed;
    width: 100%;
    bottom: 0;

    &--title {
      position: relative;
      height: 110rpx;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;

      &--ok {
        position: absolute;
        right: 50rpx;
      }
    }
  }

  &__tabs {
    display: flex;
    align-items: center;
    justify-content: center;

    &--item {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      padding: 40rpx 50rpx;
      position: relative;
    }
  }

  &__update {
    position: relative;
    height: 240rpx;

    &--image {
      flex-shrink: 0;
    }

    &--dec {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &--line {
      width: 4rpx;
      height: 142rpx;
      background: #ffffff;
      border-radius: 2rpx 2rpx 2rpx 2rpx;
      position: absolute;
      left: 50%;
      top: -11rpx;
    }

    &--white {
      width: 50%;
      flex-shrink: 0;
    }
  }

  &__reset {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 80rpx;

    &--btn {
      display: flex;
      flex-direction: column;
      padding: 0 30rpx;
      justify-content: center;
      align-items: center;
    }

    image {
      width: 44rpx;
      height: 44rpx;
      margin-bottom: 20rpx;
    }
  }
}

.tabselect {
  font-weight: 500;
  color: #ff4d4d;
}

.tabselect::before {
  position: absolute;
  content: "";
  display: bolck;
  width: 23rpx;
  height: 4rpx;
  background-color: #ff4d4d;
  margin-right: 10rpx;
  position: absolute;
  bottom: 28rpx;
  left: 50%;
  transform: translateX(-11.5rpx);
  border-radius: 4rpx;
}
</style>
