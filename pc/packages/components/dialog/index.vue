<script lang="ts" setup>
import { computed, ref, type PropType } from 'vue'
import { addUnit, definePropType } from 'element-plus/es/utils/index.mjs'
import { merge } from 'lodash'

import { handleBind, handleOn, isDisplay } from 'dsrz/utils'
import { GlobalConfig } from 'dsrz/components/config'

import type { BtnsProps } from './types'

defineOptions({
  name: 'CurrencyDialog',
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '',
  },
  size: {
    type: String as PropType<'default' | 'large' | 'small'>,
    default: 'default',
  },
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
  closeIcon: {
    type: [String, Object],
    default: '',
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

enum Size {
  large = '--el-dialog-width: 1200px',
  default = '--el-dialog-width: 675px',
  small = '--el-dialog-width: 400px',
}

const loading = ref(false)

const closeIcon = computed(
  () => props.closeIcon || GlobalConfig.elDialog.closeIcon,
)

const dialogStyle = computed(() =>
  props.width ? '--el-dialog-width: ' + addUnit(props.width) : Size[props.size],
)

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const btns = computed(() => [
  ...props.prefixBtns,
  ...[
    merge(
      {
        is: 'currency-button',
        bind: {
          class: 'dsrz-dialog-cancel',
          title: '取消',
        },
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
          class: 'dsrz-dialog-confirm',
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
  <el-dialog
    class="dsrz-dialog"
    :style="dialogStyle"
    :model-value="modelValue"
    @update:model-value="(v: any) => emit('update:modelValue', v)"
    :close-icon="closeIcon"
    :append-to-body="true"
    :destroy-on-close="true"
    :close-on-click-modal="GlobalConfig.elDialog.closeOnClickModal"
    :close-on-press-escape="GlobalConfig.elDialog.closeOnPressEscape"
    :before-close="handleCancel"
  >
    <template #header>{{ title }}</template>
    <div v-if="content.length" class="dsrz-dialog-content">
      <slot name="content">{{ content }}</slot>
    </div>
    <div
      :class="[
        'dsrz-dialog-default',
        { 'dsrz-dialog-display': content.length },
        { 'dsrz-dialog-disabled': disabled },
      ]"
    >
      <slot name="default"></slot>
    </div>
    <template v-if="!disabled" #footer>
      <template v-for="(v, i) in btns" :key="i">
        <component
          v-if="isDisplay(v.display, params)"
          :is="v.is"
          v-bind="handleBind(v.bind, params, v)"
          v-on="handleOn(v)"
        />
      </template>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
