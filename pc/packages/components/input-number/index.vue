<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { definePropType } from 'element-plus/es/utils/index.mjs'

import { isFunction, isEmpty } from 'dsrz/utils'

defineOptions({
  name: 'CurrencyInputNumber',
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  'onUpdate:modelValue': {
    type: Function,
    default: undefined,
  },
  mode: {
    type: definePropType<'horizontal' | 'vertical'>(String),
    default: 'horizontal',
  },
  prefixText: {
    type: String,
    default: '',
  },
  suffixText: {
    type: String,
    default: '',
  },
  beforeChange: {
    type: [Function, Boolean],
    default: true,
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
})

const value = ref(props.modelValue)

const style = computed(
  () =>
    props.mode === 'horizontal' && {
      display: 'flex',
      '--dsrz-input-number-margin': '10px',
    },
)

const isBeforeChange = async () => {
  try {
    if (isFunction(props.beforeChange)) {
      if (Object.keys(props.backups).length === 0) {
        return await props.beforeChange(value.value)
      } else {
        return await props.beforeChange(props.backups, value.value)
      }
    }
    return true
  } catch {
    return false
  }
}

const handleChange = async (
  currentValue: number | undefined,
  oldValue: number | undefined,
) => {
  if (await isBeforeChange()) {
    props['onUpdate:modelValue']?.(currentValue)
  } else {
    value.value = oldValue!
  }
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue === value.value) return
    value.value = props.modelValue
  },
)
</script>
<template>
  <div class="dsrz-input-number" :style="style">
    <slot name="prefix">
      <div v-if="!isEmpty(prefixText)" class="dsrz-input-number-prefix">
        {{ prefixText }}
      </div>
    </slot>
    <el-input-number v-model="value" v-bind="$attrs" @change="handleChange" />
    <slot name="suffix">
      <div v-if="!isEmpty(suffixText)" class="dsrz-input-number-suffix">
        {{ suffixText }}
      </div>
    </slot>
  </div>
</template>
<style lang="scss" scoped></style>
