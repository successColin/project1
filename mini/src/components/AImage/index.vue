<template>
  <up-image
    lazy-load
    :src="validSrc"
    :width="width"
    :height="height"
    :mode="mode"
    :shape="shape"
    :radius="radius"
    style="overflow: hidden"
    @error="onError"
    @click="handleClick"
  >
    <template #loading>
      <div class="image-loading">
        加载中...
      </div>
    </template>
    <template #error>
      <div class="image-error">
        加载失败
      </div>
    </template>
  </up-image>
</template>

<script setup lang="ts">
const props = defineProps({
  height: {
    type: [Number, String],
    default: '100%',
    // required: true,
  },
  width: {
    type: [Number, String],
    default: '100%',
  },
  src: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'aspectFill', // scaleToFill
  },
  fallback: {
    type: String,
    default:
      'https://oss.dcqcjlb.com/51che_java_dev/20250913/3aa771da77bd49b9ad1be1723dd5e883.png', // 默认备用图
  },
  shape: {
    type: String,
    default: 'square',
  },
  radius: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['click']);
const isError = ref(false);
const validSrc = computed(() =>
  isError.value || !props.src ? props.fallback : props.src,
);
const onError = () => {
  console.log(111111111);
  isError.value = true;
};

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
.image-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 24rpx;
  color: #999;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 12px;
  color: #f00;
}
</style>
