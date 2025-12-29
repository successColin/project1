<script lang="ts" setup>
import { onUnmounted } from 'vue'
import CryptoJS from 'crypto-js'

import { useResetReactive } from 'dsrz/hooks/useReset'
import { GlobalConfig } from 'dsrz/components/config'

defineOptions({
  name: 'CurrencyCaptcha',
})

const props = defineProps({
  request: {
    type: Function,
    default: undefined,
  },
})

const {
  params,
  exposes: { reset },
} = useResetReactive({
  visible: false,
  title: '请完成安全验证',
  captcha: {
    jigsawImageBase64: '',
    originalImageBase64: '',
    secretKey: '',
    token: '',
  },
  blockLeft: 0,
  isDragging: false,
  startX: 0,
  startLeft: 0,
  tips: { class: '', title: '' },
  moveTime: { start: 0, end: 0 },
  isLoading: false,
})

// 开始拖动
const startDrag = (e: MouseEvent | TouchEvent) => {
  params.isDragging = true
  params.startX = getClientX(e)
  params.startLeft = params.blockLeft
  params.moveTime.start = +new Date() //开始滑动的时间

  // 添加全局事件监听
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('touchmove', handleDrag, { passive: false })
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchend', endDrag)
}

// 获取客户端X坐标
const getClientX = (e: MouseEvent | TouchEvent): number => {
  return 'clientX' in e ? e.clientX : e.touches[0].clientX
}

// 处理拖动
const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!params.isDragging) return

  e.preventDefault()

  const clientX = getClientX(e)
  const deltaX = clientX - params.startX
  let newLeft = params.startLeft + deltaX
  // 限制滑块范围
  newLeft = Math.max(0, Math.min(newLeft, 376 - 57))
  params.blockLeft = newLeft
}

const aesEncrypt = (data: string, KEY = 'XwKsGlMcdPMEhR1B') =>
  CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(data),
    CryptoJS.enc.Utf8.parse(KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString()

// 结束拖动
const endDrag = async () => {
  params.moveTime.end = +new Date()
  if (!params.isDragging) return

  params.isDragging = false
  removeEventListeners()

  // 验证结果
  const diff = (params.blockLeft * 310) / 376

  const { secretKey, token } = params.captcha
  try {
    await GlobalConfig.elCaptcha.check({
      captchaType: 'blockPuzzle',
      pointJson: secretKey
        ? aesEncrypt(JSON.stringify({ x: diff, y: 5.0 }), secretKey)
        : JSON.stringify({ x: diff, y: 5.0 }),
      token,
    })
    Object.assign(params.tips, {
      title: `${((params.moveTime.end - params.moveTime.start) / 1000).toFixed(2)}s验证成功`,
      class: 'success',
    })
    const timer = setTimeout(() => {
      reset()
      clearTimeout(timer)
      props.request?.({
        data: { id: token },
      })
    }, 1000)
  } catch {
    Object.assign(params.tips, {
      title: '验证失败',
      class: 'danger',
    })
    const timer = setTimeout(() => {
      refresh()
      clearTimeout(timer)
    }, 1000)
  }
}

// 移除事件监听
const removeEventListeners = () => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchend', endDrag)
}

// 刷新验证
const refresh = () => {
  params.blockLeft = 0
  params.isLoading = true
  Object.assign(params.tips, {
    title: '',
    class: '',
  })
  getPictrue()
}

onUnmounted(() => {
  removeEventListeners()
})

const getPictrue = async () => {
  const {
    data: { jigsawImageBase64, originalImageBase64, secretKey, token },
  } = await GlobalConfig.elCaptcha.get({ captchaType: 'blockPuzzle' })
  Object.assign(params.captcha, {
    jigsawImageBase64: `data:image/png;base64,${jigsawImageBase64}`,
    originalImageBase64: `data:image/png;base64,${originalImageBase64}`,
    secretKey,
    token,
  })
  params.isLoading = false
}

const open = async () => {
  await getPictrue()
  Object.assign(params, { visible: true })
}

defineExpose({ open })
</script>

<template>
  <CurrencyDialog
    v-model="params.visible"
    :title="params.title"
    size="small"
    :disabled="true"
    v-bind="$attrs"
    @cancel="reset"
  >
    <div class="currency-captcha">
      <div class="currency-captcha-top">
        <img :src="params.captcha.originalImageBase64" />
        <div :class="`currency-captcha-top-tip-${params.tips.class}`">
          {{ params.tips.title }}
        </div>
        <div class="currency-captcha-top-refresh" @click="refresh">
          <el-icon :size="24" :class="[{ 'is-loading': params.isLoading }]">
            <Refresh />
          </el-icon>
        </div>
      </div>
      <div
        class="currency-captcha-block"
        :style="{ left: `${params.blockLeft}px` }"
      >
        <img :src="params.captcha.jigsawImageBase64" />
      </div>
      <div class="currency-captcha-bottom">
        <div
          class="currency-captcha-bottom-line"
          :style="{ width: `${params.blockLeft}px` }"
        />
        <div class="currency-captcha-bottom-text">请向右滑动验证</div>
        <div class="currency-captcha-bottom-slider">
          <div
            class="currency-captcha-bottom-slider-thumb"
            :style="{ left: `${params.blockLeft}px` }"
            @touchstart="startDrag"
            @mousedown="startDrag"
          >
            <el-icon :size="24"><Right /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </CurrencyDialog>
</template>
<style lang="scss" scoped></style>
