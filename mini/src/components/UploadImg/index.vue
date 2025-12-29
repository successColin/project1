<template>
  <up-upload
    ref="uploadRef"
    width="80"
    height="80"
    :disabled="disabled"
    :file-list="fileList"
    :compressed="false"
    multiple
    :deletable="false"
    :max-count="maxCount"
    accept="image"
    :preview-image="previewImage"
    :preview-full-image="true"
    @after-read="afterRead"
    @delete="deletePic"
  >
    <template #trigger>
      <slot>
        <a-image
          src="https://oss.dcqcjlb.com/51che_java_dev/20230503/file_1683092299818.png"
          mode="widthFix"
          height="160rpx"
          width="160rpx"
        />
      </slot>
    </template>
  </up-upload>
</template>

<script setup lang="ts">
import { uploadFileFun } from '@/utils/common';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  deletable: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array,
    default: () => {},
  },
  previewImage: {
    type: Boolean,
    default: true,
  },
  maxCount: {
    type: Number,
    default: 9,
  },
});

const emit = defineEmits(['update:list']);
const afterRead = async (e: any) => {
  const lists = [].concat(e.file);
  if (props.list.length > 9) {
    uni.$u.toast(`最多上传${props.maxCount}张图片`);
  }
  const arr = (await uploadFileFun(lists)) as any;
  emit('update:list', [...props.list, ...arr]);
};

const fileList = computed(() => {
  return props.list.map((v) => {
    return {
      url: v,
      status: 'success',
      type: 'image',
    };
  });
});

const deletePic = (e: any) => {
  const arr = JSON.parse(JSON.stringify(props.list));
  arr.splice(e.index, 1);
  emit('update:list', arr);
};

const uploadRef = ref();
const chooseFile = () => {
  uploadRef.value.chooseFile();
};

defineExpose({
  chooseFile,
});
</script>

<style lang="scss" scoped></style>
