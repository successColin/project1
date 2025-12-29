<script lang="ts" setup>
import {
  createRef,
  download,
  isArray,
  isEmpty,
  isFunction,
  isNumber,
  isString,
  refs,
} from 'dsrz/utils'
import {
  ElMessage,
  useLocale,
  useNamespace,
  type UploadFile,
  type UploadProps,
  type UploadRawFile,
  type UploadRequestOptions,
  type UploadUserFile,
} from 'element-plus'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import { computed, ref, watch, type Component, type PropType } from 'vue'

import { GlobalConfig } from 'dsrz/components/config'
import type { CropperProps } from './type'

defineOptions({
  name: 'CurrencyUpload',
})

const props = defineProps({
  uploadRef: {
    type: String,
    default: 'uploadRef',
  },
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  'onUpdate:modelValue': {
    type: Function,
    default: undefined,
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
  cropper: {
    type: Object as PropType<CropperProps>,
    default: () => ({}),
  },
  buttonTitle: {
    type: String,
    default: '上传',
  },
  buttonIcon: {
    type: [String, Object] as PropType<string | Component>,
    default: '',
  },
  pictureCardIcon: {
    type: [String, Object] as PropType<string | Component>,
    default: '',
  },
  tipTitle: {
    type: String,
    default: '',
  },
  materialLibrary: {
    type: Boolean,
    default: false,
  },
  drag: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: '',
  },
  crossorigin: {
    type: definePropType<'anonymous' | 'use-credentials' | ''>(String),
    default: '',
  },
  size: {
    type: [String, Number],
    default: '',
  },
  onUploadRemove: {
    type: Function,
    default: undefined,
  },
  onUploadSuccess: {
    type: Function,
    default: undefined,
  },
  selectType: {
    type: definePropType<'merge' | 'cover'>(String),
    default: 'merge',
  },
  listType: {
    type: definePropType<'text' | 'picture' | 'picture-card'>(String),
    default: 'text',
  },
  httpRequest: {
    type: Function,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 999999999,
  },
})

const fileType = {
  image: [
    '.xbm',
    '.tif',
    '.pjp',
    '.apng',
    '.svgz',
    '.jpg',
    '.jpeg',
    '.heif',
    '.ico',
    '.tiff',
    '.webp',
    '.jfif',
    '.heic',
    '.gif',
    '.svg',
    '.png',
    '.bmp',
    '.pjpeg',
    '.avif',
    '.XBM',
    '.TIF',
    '.PJP',
    '.APNG',
    '.SVGZ',
    '.JPG',
    '.JPEG',
    '.HEIF',
    '.ICO',
    '.TIFF',
    '.WEBP',
    '.JFIF',
    '.HEIC',
    '.GIF',
    '.SVG',
    '.PNG',
    '.BMP',
    '.PJPEG',
    '.AVIF',
  ],
  video: [
    '.ogm',
    '.wmv',
    '.mpg',
    '.webm',
    '.ogv',
    '.mov',
    '.asx',
    '.mpeg',
    '.mp4',
    '.m4v',
    '.avi',
    '.OGM',
    '.WMV',
    '.MPG',
    '.WEBM',
    '.OGV',
    '.MOV',
    '.ASX',
    '.MPEG',
    '.MP4',
    '.M4V',
    '.AVI',
  ],
}

const { t } = useLocale()
const nsUpload = useNamespace('upload')
const nsIcon = useNamespace('icon')

const fileList = ref<UploadUserFile[]>([])

const showViewer = ref<boolean>(false)
const initialIndex = ref<number>(0)

const tip = computed(
  () =>
    (props.listType !== 'picture-card' &&
      ((props.cropper.cropperWidth && props.cropper.cropperHeight) ||
        isArray(props.cropper.ratio))) ||
    props.tipTitle.length,
)

const pictureCardIcon = computed(
  () => props.pictureCardIcon || GlobalConfig.elUpload.pictureCardIcon,
)

const viewerList = computed(() =>
  fileList.value
    .filter(v =>
      [...fileType.image, ...fileType.video].some(key => v.name?.includes(key)),
    )
    .map(({ uid, url, name }) => ({
      uid,
      url,
      type: fileType.image.some(key => name?.includes(key)) ? 'image' : 'video',
    })),
)

const cropperRatio = computed(() => {
  const { ratio } = props.cropper
  if (isArray(props.cropper.ratio)) {
    return ratio
  } else if (isString(ratio) && !isEmpty(ratio)) {
    return ratio.split(':').map(Number)
  }
  return undefined
})

const isVideoOrIamge = computed(
  () => (file: UploadFile & { type?: string }, accept: string, type: string) =>
    (props.listType === 'picture' ||
      (file.status !== 'uploading' && props.listType === 'picture-card')) &&
    (file.type === type ||
      (fileType.image.some(key => file.name?.includes(key))
        ? 'image/*'
        : 'video/*') === accept),
)

const handlePreview = (uploadFile: UploadFile) => {
  const index = viewerList.value.findIndex(v => v.uid === uploadFile.uid)
  if (index !== -1) {
    initialIndex.value = index
    showViewer.value = true
  } else {
    download(uploadFile.url!, uploadFile.name)
  }
}

const handleRemove = async (uploadFile: UploadFile) => {
  if (isFunction(props.onUploadRemove)) {
    await props.onUploadRemove(uploadFile)
  } else {
    await GlobalConfig.elUpload.onRemove(uploadFile)
  }

  fileList.value = fileList.value.filter(v => v.uid !== uploadFile.uid)

  props['onUpdate:modelValue']?.(fileList)
}

const handleSuccess: UploadProps['onSuccess'] = async (
  response,
  uploadFile,
  uploadFiles,
) => {
  const allUploadFiles = uploadFiles
    .filter(v => v.status === 'success')
    .filter(
      v =>
        GlobalConfig.elUpload.percentage ||
        isEmpty(v.percentage) ||
        v.percentage === 100 ||
        v.url?.includes('blob:') ||
        isEmpty(v.response),
    )
  if (allUploadFiles.length === uploadFiles.length) {
    fileList.value = isFunction(props.onUploadSuccess)
      ? await props.onUploadSuccess(uploadFiles)
      : await GlobalConfig.elUpload.onSuccess(uploadFiles)
    props['onUpdate:modelValue']?.(fileList)
  }
}

const handleError = () => ElMessage.error('上传失败')

const handleExceed = () => ElMessage.warning('最大上传数量为' + props.limit)

const handleBeforeUpload = async (rawFile: UploadRawFile) => {
  try {
    const { cropperWidth: width, cropperHeight: height } = props.cropper
    /** 判断图片宽和高 */
    if (width && height) {
      await handleImage(rawFile)
    }
    /** 判断图片比例 */
    if (isArray(cropperRatio.value)) {
      await handleImage(rawFile)
    }
    /** 判断文件大小 */
    if (!isEmpty(props.size)) {
      await handleSize(rawFile)
    }
    return true
  } catch {
    return false
  }
}

const handleImage = (rawFile: UploadRawFile) =>
  new Promise((resolve, reject) => {
    console.log('handleImage', rawFile)
    const reader = new FileReader()
    reader.readAsDataURL(rawFile)
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result as string
      image.onload = () => {
        const { cropperWidth: pw, cropperHeight: ph } = props.cropper
        const r = cropperRatio.value
        const { width: iw, height: ih } = image
        console.log('image', iw, ih)
        if (pw === iw && ph === ih) {
          resolve(true)
        } else if (
          isArray(r) &&
          [iw, ih].reduce((a, b) => a / b).toFixed(2) ===
            r.reduce((a, b) => a / b).toFixed(2)
        ) {
          resolve(true)
        } else {
          refs[`imageCropper${toUpperCase(props.uploadRef)}`].open(image, {
            uid: rawFile.uid,
            name: rawFile.name,
            type: rawFile.type,
          })
          ElMessage.error(
            `上传图片分辨率不正确,要求${isArray(r) ? r.join(':') : [pw, ph].join('*')}`,
          )
          reject(false)
        }
      }
      image.onerror = () => {
        ElMessage.error('上传图片分辨率获取失败')
        reject(false)
      }
    }
    reader.onerror = () => {
      ElMessage.error('上传图片格式不正确')
      reject(false)
    }
  })

const handleSize = (rawFile: UploadRawFile) =>
  new Promise((resolve, reject) => {
    const isNaN = Number.isNaN(Number(props.size))
    if (isNumber(props.size) || !isNaN) {
      if (rawFile.size <= Math.pow(1024, 2) * Number(props.size)) {
        resolve(true)
      } else {
        ElMessage.error(`上传文件大小不能超过${props.size}MB`)
        reject(false)
      }
    } else if (isString(props.size)) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', ' EB', 'ZB', 'YB']
      const number = sizes.findIndex(v => String(props.size).includes(v))
      if (number === -1) {
        ElMessage.error(`文件大小单位错误，请输入${sizes.join('、')}的格式`)
        reject(false)
      } else {
        const size = Number(props.size.replace(sizes[number], ''))
        if (rawFile.size <= Math.pow(1024, number) * size) {
          resolve(true)
        } else {
          ElMessage.error(`上传文件大小不能超过${props.size}`)
          reject(false)
        }
      }
    }
  })

const handleHttpRequest = async (options: UploadRequestOptions) =>
  isFunction(props.httpRequest)
    ? props.httpRequest(options)
    : GlobalConfig.elUpload.httpRequest(options)

const handleConfirm = async (rawFile: UploadRawFile) => {
  refs[props.uploadRef].handleStart(rawFile)
  refs[props.uploadRef].submit()
}

const handleMaterialLibraryUpload = (e: MouseEvent) => {
  const {
    materialLibrary,
    cropper: { cropperWidth, cropperHeight, ratio },
    accept,
  } = props
  if (materialLibrary) {
    e.preventDefault()
    e.stopPropagation()
    const getFileType = (s: 'image' | 'video', v: number) =>
      accept.split(',').some(v => v.includes(s) || fileType[s].includes(v)) && v
    refs[`materialLibrary${toUpperCase(props.uploadRef)}`].open({
      width: cropperWidth,
      height: cropperHeight,
      ratio: isArray(ratio) ? ratio.join(':') : ratio,
      type: getFileType('image', 1) || getFileType('video', 2) || '',
    })
  }
}

const handleMaterialLibraryConfirm = async (list: UploadFile[]) => {
  console.log('handleMaterialLibraryConfirm', list)
  fileList.value =
    props.selectType === 'merge' ? [...fileList.value, ...list] : list
  props['onUpdate:modelValue']?.(fileList)
}

const toUpperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

watch(
  () => props.modelValue,
  async () => {
    if (isArray(props.modelValue)) {
      if (JSON.stringify(props.modelValue) === JSON.stringify(fileList.value)) {
        return
      } else {
        fileList.value = GlobalConfig.elUpload.updateData(props.modelValue)
      }
    } else if (isString(props.modelValue)) {
      fileList.value = GlobalConfig.elUpload.updateData(props.modelValue)
      props['onUpdate:modelValue']?.(fileList)
    }
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <el-upload
    :ref="(e: any) => createRef(e, uploadRef)"
    :class="[
      'dsrz-upload',
      { 'dsrz-upload-disabled': fileList.length >= limit },
    ]"
    :drag="drag"
    :accept="accept"
    :crossorigin="crossorigin"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :before-upload="handleBeforeUpload"
    v-model:file-list="fileList"
    :list-type="listType"
    :http-request="handleHttpRequest"
    :disabled="disabled"
    :limit="limit"
    v-bind="$attrs"
  >
    <div
      v-if="listType === 'picture-card'"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      "
      @click="handleMaterialLibraryUpload"
    >
      <el-icon style="color: var(--el-text-color-secondary)">
        <component :is="pictureCardIcon" />
      </el-icon>
      <span
        v-if="
          (cropper.cropperWidth && cropper.cropperHeight) ||
          isArray(cropperRatio)
        "
        class="dsrz-upload-title"
      >
        {{
          isArray(cropperRatio)
            ? cropperRatio.join(':')
            : [cropper.cropperWidth, cropper.cropperHeight].join('*')
        }}
      </span>
    </div>
    <template v-else-if="drag">
      <slot>
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          点击或将文件拖拽到这里上传<br />{{
            accept ? `支持扩展名：${accept.split(',').join('、')}` : ''
          }}
        </div>
      </slot>
    </template>
    <template v-else>
      <slot>
        <CurrencyButton
          :title="buttonTitle"
          type="primary"
          :icon="buttonIcon"
        />
      </slot>
    </template>
    <template #file="{ file }">
      <video
        v-if="isVideoOrIamge(file, 'video/*', '2')"
        :class="nsUpload.be('list', 'item-thumbnail')"
        :src="file.url"
        :crossorigin="crossorigin"
        alt=""
      />
      <img
        v-if="isVideoOrIamge(file, 'image/*', '1')"
        :class="nsUpload.be('list', 'item-thumbnail')"
        :src="file.url"
        :crossorigin="crossorigin"
        alt=""
      />
      <div
        v-if="file.status === 'uploading' || listType !== 'picture-card'"
        :class="nsUpload.be('list', 'item-info')"
      >
        <a
          :class="nsUpload.be('list', 'item-name')"
          @click.prevent="handlePreview(file)"
        >
          <el-icon :class="nsIcon.m('document')">
            <Document />
          </el-icon>
          <span
            :class="nsUpload.be('list', 'item-file-name')"
            :title="file.name"
          >
            {{ file.name }}
          </span>
        </a>
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="Number(file.percentage)"
          :style="listType === 'picture-card' ? '' : 'margin-top: 0.5rem'"
        />
      </div>
      <label :class="nsUpload.be('list', 'item-status-label')">
        <el-icon
          v-if="listType === 'text'"
          :class="[nsIcon.m('upload-success'), nsIcon.m('circle-check')]"
        >
          <circle-check />
        </el-icon>
        <el-icon
          v-else-if="['picture-card', 'picture'].includes(listType)"
          :class="[nsIcon.m('upload-success'), nsIcon.m('check')]"
        >
          <Check />
        </el-icon>
      </label>
      <el-icon
        v-if="!disabled"
        :class="nsIcon.m('close')"
        @click="handleRemove(file)"
      >
        <Close />
      </el-icon>
      <!-- Due to close btn only appears when li gets focused disappears after li gets blurred, thus keyboard navigation can never reach close btn-->
      <!-- This is a bug which needs to be fixed -->
      <!-- TODO: Fix the incorrect navigation interaction -->
      <i v-if="!disabled" :class="nsIcon.m('close-tip')">
        {{ t('el.upload.deleteTip') }}
      </i>
      <span
        v-if="listType === 'picture-card'"
        :class="nsUpload.be('list', 'item-actions')"
      >
        <span
          :class="nsUpload.be('list', 'item-preview')"
          @click="handlePreview(file)"
        >
          <el-icon :class="nsIcon.m('zoom-in')"><zoom-in /></el-icon>
        </span>
        <span
          v-if="!disabled"
          :class="nsUpload.be('list', 'item-delete')"
          @click="handleRemove(file)"
        >
          <el-icon :class="nsIcon.m('delete')">
            <Delete />
          </el-icon>
        </span>
      </span>
    </template>
    <template v-if="tip" #tip>
      <div class="el-upload__tip">
        {{ tipTitle }}
        <span
          v-if="
            (cropper.cropperWidth && cropper.cropperHeight) ||
            isArray(cropperRatio)
          "
        >
          {{
            isArray(cropperRatio)
              ? cropperRatio.join(':')
              : [cropper.cropperWidth, cropper.cropperHeight].join('*')
          }}
        </span>
      </div>
    </template>
  </el-upload>
  <CurrencyMaterialLibrary
    v-if="materialLibrary"
    :ref="(e: any) => createRef(e, `materialLibrary${toUpperCase(uploadRef)}`)"
    mode="dialog"
    :cropper="cropper"
    :accept="accept"
    :limit="selectType === 'merge' ? limit - fileList.length : limit"
    @confirm="handleMaterialLibraryConfirm"
  />
  <CurrencyImageViewer
    v-if="showViewer"
    teleported
    :url-list="viewerList"
    :initial-index="initialIndex"
    @close="showViewer = false"
  />
  <CurrencyImageCropper
    :ref="(e: any) => createRef(e, `imageCropper${toUpperCase(uploadRef)}`)"
    v-bind="cropper"
    @confirm="handleConfirm"
  />
</template>
<style lang="scss" scoped></style>
