<script lang="ts" setup>
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
} from 'vue'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import { merge } from 'lodash'

import { handleBind, handleOn, isDisplay } from 'dsrz/utils'

import type { BtnsProps } from './types'

defineOptions({
  name: 'CurrencyDetails',
})

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  request: {
    type: Function,
    default: undefined,
  },
  cancel: {
    type: Object,
    default: () => ({}),
  },
  confirm: {
    type: Object,
    default: () => ({}),
  },
  prefixBtns: {
    type: definePropType<BtnsProps<object>[]>(Array),
    default: () => [],
  },
  suffixBtns: {
    type: definePropType<BtnsProps<object>[]>(Array),
    default: () => [],
  },
})

const Container = reactive<Record<string, ReturnType<typeof defineComponent>>>({
  Button: undefined,
  Header: undefined,
  Footer: undefined,
})
const buttonHeight = ref(0)
const headerHeight = ref(0)
const footerHeight = ref(0)

const loading = ref(false)

const btns = computed(() => [
  ...props.prefixBtns,
  ...[
    merge(
      {
        is: 'currency-button',
        bind: { title: '取消' },
        on: {
          click: handleCancel,
        },
      },
      props.cancel,
    ),
    merge(
      {
        is: 'currency-button',
        bind: {
          title: '确认',
          type: 'primary',
          loading: loading.value,
        },
        on: {
          click: handleConfirm,
        },
      },
      props.confirm,
    ),
  ],
  ...props.suffixBtns,
])

const scrollbarStyle = computed(() => ({
  height: `calc(100vh - ${buttonHeight.value}px - ${headerHeight.value}px - ${footerHeight.value === 0 ? 20 : footerHeight.value}px - 20px)`,
}))

const updateHeaderHeight = () => {
  const { Button, Header, Footer } = Container
  if (Button) {
    buttonHeight.value =
      Button.getBoundingClientRect().height + Button.getBoundingClientRect().top
  }
  if (Header) {
    headerHeight.value = Header.getBoundingClientRect().height
  }
  if (Footer) {
    footerHeight.value = Footer.getBoundingClientRect().height
  }
}

onUpdated(() => {
  updateHeaderHeight()
})

onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})

const emit = defineEmits(['cancel', 'confirm'])

/**
 * @description: 取消关闭弹窗
 */
const handleCancel = () => emit('cancel')

/**
 * @description: 确定关闭弹窗
 */
const handleConfirm = async () => {
  loading.value = true
  try {
    await props.request?.(props.params)
    emit('confirm')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="dsrz-details">
    <div :ref="e => (Container.Button = e)" class="dsrz-details-button">
      <CurrencyButton
        class="dsrz-details-return"
        title="返回"
        type="primary"
        icon="DsrzReturn"
        @click="emit('cancel')"
      />
      <slot name="button" />
    </div>
    <div :ref="e => (Container.Header = e)">
      <slot name="header" />
    </div>
    <el-scrollbar class="dsrz-details-scrollbar" :style="scrollbarStyle">
      <slot />
    </el-scrollbar>
    <div
      v-if="!disabled"
      :ref="e => (Container.Footer = e)"
      class="dsrz-details-footer"
    >
      <template v-for="(v, i) in btns" :key="i">
        <component
          v-if="isDisplay(v.display, params)"
          :is="v.is"
          v-bind="handleBind(v.bind, params, v)"
          v-on="handleOn(v)"
        />
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
