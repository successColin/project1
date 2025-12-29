<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue'

import { CircleClose } from '@element-plus/icons-vue'

import { definePropType, NOOP } from 'element-plus/es/utils/index'
import { useNamespace } from 'element-plus/es/hooks/index'

import { GlobalConfig } from 'dsrz/components/config'

import { useFormItem } from 'element-plus'
import { isArray, isString, isEmpty } from 'dsrz/utils'

defineOptions({
  name: 'CurrencyInput',
})

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: '',
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
  suffixIcon: {
    type: [String, Object],
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  rangeSeparator: {
    type: String,
    default: '-',
  },
  disabled: Boolean,
  readonly: Boolean,
  clearable: {
    type: Boolean,
    default: true,
  },
})

const $attrs = useAttrs()

const value = ref(props.modelValue as string)

const displayValue = ref(props.modelValue as Array<string | null>)

const showClose = ref(false)

const suffixIcon = computed(
  () => props.suffixIcon || GlobalConfig.elInput.suffixIcon,
)

const { form } = useFormItem()

const nsDate = useNamespace('date')
const nsInput = useNamespace('input')
const nsRange = useNamespace('range')

const pickerDisabled = computed(() => props.disabled || form?.disabled)

const isRangeInput = computed(() => props.type.includes('range'))

const rangeInputKls = computed(() => [
  nsDate.b('editor'),
  nsInput.e('wrapper'),
  nsDate.is('disabled', pickerDisabled.value),
  nsRange.b('editor'),
  $attrs.class,
])

const clearIconKls = computed(() => [
  nsInput.e('icon'),
  nsRange.e('close-icon'),
  !showClose.value ? nsRange.e('close-icon--hidden') : '',
])

const style = computed(
  () =>
    props.mode === 'horizontal' && {
      display: 'flex',
      '--dsrz-input-number-margin': '10px',
    },
)

const handleChange = (value: string | number) =>
  props['onUpdate:modelValue']?.(value)

const handleStartInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  displayValue.value = [
    (Number.isNaN(Number(target.value)) ? 0 : Number(target.value)).toString(),
    displayValue.value[1] || null,
  ]
}

const handleEndInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  displayValue.value = [
    displayValue.value[0] || null,
    (Number.isNaN(Number(target.value)) ? 0 : Number(target.value)).toString(),
  ]
}

const onClearIconClick = (event: MouseEvent) => {
  if (props.readonly || pickerDisabled.value) return
  if (showClose.value) {
    event.stopPropagation()
    displayValue.value = []
    props['onUpdate:modelValue']?.()
    showClose.value = false
  }
}

const valueIsEmpty = computed(() => {
  const { modelValue } = props
  return (
    !modelValue || (isArray(modelValue) && !modelValue.filter(Boolean).length)
  )
})

const handleStartChange = () => {
  const [min, max] = displayValue.value
  if (isString(min) && isString(max) && Number(min) > Number(max)) {
    displayValue.value = [max, max]
  }
  if (displayValue.value.filter(v => v !== null).length === 2) {
    props['onUpdate:modelValue']?.(displayValue.value)
  }
}

const handleEndChange = () => {
  const [min, max] = displayValue.value
  if (isString(min) && isString(max) && Number(max) < Number(min)) {
    displayValue.value = [min, min]
  }
  if (displayValue.value.filter(v => v !== null).length === 2) {
    props['onUpdate:modelValue']?.(displayValue.value)
  }
}

const onMouseEnter = () => {
  if (props.readonly || pickerDisabled.value) return
  if (!valueIsEmpty.value && props.clearable) {
    showClose.value = true
  }
}
const onMouseLeave = () => {
  showClose.value = false
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue === value.value) return
    value.value = props.modelValue as string
    if (!isArray(props.modelValue)) {
      displayValue.value = []
    }
  },
)
</script>
<template>
  <div class="dsrz-input" :style="style">
    <slot name="prefix">
      <div v-if="!isEmpty(prefixText)" class="dsrz-input-prefix">
        {{ prefixText }}
      </div>
    </slot>
    <el-input
      v-if="!isRangeInput"
      v-model="value"
      v-bind="$attrs"
      :disabled="pickerDisabled"
      :readonly="readonly"
      :clearable="clearable"
      :suffix-icon="suffixIcon"
      @change="handleChange"
    />
    <PickerRangeTrigger
      v-else
      :model-value="displayValue"
      v-bind="$attrs"
      :disabled="pickerDisabled"
      :readonly="readonly"
      :class="rangeInputKls"
      @start-input="handleStartInput"
      @start-change="handleStartChange"
      @end-input="handleEndInput"
      @end-change="handleEndChange"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <template #range-separator>
        <slot name="range-separator">
          <span :class="nsRange.b('separator')">{{ rangeSeparator }}</span>
        </slot>
      </template>
      <template #suffix>
        <el-icon
          :class="clearIconKls"
          @mousedown.prevent="NOOP"
          @click="onClearIconClick"
        >
          <component :is="CircleClose" />
        </el-icon>
      </template>
    </PickerRangeTrigger>
    <slot name="suffix">
      <div v-if="!isEmpty(suffixText)" class="dsrz-input-suffix">
        {{ suffixText }}
      </div>
    </slot>
  </div>
</template>
<style lang="scss" scoped>
::v-deep(.el-input__wrapper) {
  padding: 0 0 0 12px;
}
::v-deep(.el-input__clear) {
  margin: 0 12px 0 0;
}
</style>
