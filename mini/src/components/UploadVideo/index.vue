<template>
  <!-- :maxCount="1" -->
  <up-upload
    width="80"
    height="80"
    :max-count="maxCount"
    :disabled="disabled"
    :file-list="fileList"
    :compressed="false"
    :deletable="false"
    accept="video"
    multiple
    :preview-image="previewImage"
    :get-video-thumb="true"
    @after-read="afterRead"
    @delete="handleDelete"
  >
    <template #trigger>
      <slot>
        <a-image
          src="https://oss.dcqcjlb.com/51che_java_dev/20230819/file_1692435279788.png"
          mode="widthFix"
          height="160rpx"
          width="160rpx"
        />
      </slot>
    </template>
  </up-upload>

  <!-- 上传进度百分比 -->
  <up-modal :show="showPer" title="上传进度" :show-confirm-button="false">
    <div>
      <view>预计上传时间: {{ totalPercentage }}s</view>
      <view style="margin-top: 20rpx">
        上传进度:
        <text style="font-size: 32rpx; margin-left: 10rpx; color: #d91b1b">
          {{ percentage }}%
        </text>
      </view>
      <view
        class="addimgarticle__btn"
        :style="[
          percentage === 100 && list.length
            ? { background: '#D91b1b', color: '#ffffff' }
            : '',
        ]"
        @click="handleJump"
      >
        设置封面
      </view>
    </div>
  </up-modal>
</template>

<script setup lang="ts">
import { getUploadConfig } from '@/api/common';
import { useLoading } from '@/hooks';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: () => {},
  },
  isVideoCover: {
    type: Boolean,
    default: false,
  },
  previewImage: {
    type: Boolean,
    default: true,
  },
  minTime: {
    type: Number,
    default: 15,
  },
  isOk: {
    type: Boolean,
    default: true,
  },
  coverImageTransverse: {
    type: String,
    default: '',
  },
  coverImageVertical: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  time: {
    type: Number,
  },
  videoType: {
    type: Number,
  },
  maxCount: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits([
  'update:list',
  'update:isOk',
  'update:coverImageTransverse',
  'update:coverImageVertical',
  'update:videoUrl',
  'update:time',
  'update:videoType',
]);

const { showLoading, hideLoading } = useLoading();
const videoTime = ref(0);
const percentage = ref(0);
const totalPercentage = ref(0);
const showPer = ref(false);

const uploadVideo = async (config: any, filePath: string) => {
  if (!props.isVideoCover) {
    showLoading('上传中');
  }
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
    uni
      .uploadFile({
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
      })
      .onProgressUpdate((res) => {
        percentage.value = res.progress < 99 ? res.progress : 99;
        totalPercentage.value = Math.trunc(
          res.totalBytesExpectedToSend / 1000000,
        );
      });
  }).finally(() => {
    hideLoading();
  });
};

const afterRead = async (event: any) => {
  console.log(event);
  const item = event.file[0];
  videoTime.value = item.duration;
  if (item.size / 1024 / 1024 > 500)
    return uni.$u.toast('视频大小不能超过500mb');
  if (item.duration > 600) return uni.$u.toast('请将视频控制在10分钟内');
  if (item.duration < props.minTime)
    return uni.$u.toast(`视频需大于${props.minTime}s`);
  // emit("update:list", []);
  if (props.isVideoCover) {
    showPer.value = true;
  }
  const config = ((await getUploadConfig()) as any) || {};
  const url = await uploadVideo(config, item.url);
  percentage.value = 100;
  emit('update:list', [url]);
  const videoType = item.height > item.width ? 2 : 1;
  emit('update:videoType', videoType);
};

const fileList = computed(() => {
  return props.list.map((v) => {
    return {
      url: v,
      status: 'success',
      type: 'video',
      isVideo: true,
      thumb: `${v}?x-oss-process=video/snapshot,t_1000,m_fast`,
      deletable: !props.disabled,
    };
  });
});

const handleDelete = (e: any) => {
  const arr = JSON.parse(JSON.stringify(props.list));
  arr.splice(e.index, 1);
  emit('update:list', arr);
};

const handleJump = () => {
  if (percentage.value === 100) {
    uni.navigateTo({
      url: `/pages/common/coverImg/index?time=${videoTime.value}&url=${props.list[0]}`,
    });
  }
};

onMounted(() => {
  uni.$on('getCover', (v) => {
    emit('update:coverImageTransverse', v.crossUrl);
    emit('update:coverImageVertical', v.verticalUrl);
    emit('update:isOk', true);
    emit('update:videoUrl', props.list[0]);
    emit('update:time', videoTime.value);
    showPer.value = false;
    console.log('进来了===》', v, props.list[0]);
  });
});

onUnload(() => {
  uni.$off('getCover');
});
</script>

<style lang="scss" scoped>
.addimgarticle__btn {
  width: 200rpx;
  height: 65rpx;
  line-height: 65rpx;
  background: #999999;
  border-radius: 33rpx;

  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  margin: 0 auto;
  margin-top: 40rpx;
}
</style>
