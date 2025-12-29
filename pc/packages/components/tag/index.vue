<script lang="ts" setup>
import { isArray, isObject, isString } from 'dsrz/utils'
import { computed } from 'vue'

defineOptions({
  name: 'CurrencyTag',
})

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: '',
  },
  'onUpdate:modelValue': {
    type: Function,
    default: undefined,
  },
  split: {
    type: String,
    default: ',',
  },
  props: {
    type: Object,
    default: () => ({
      value: 'value',
      label: 'label',
    }),
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
})

const list = computed(() =>
  isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue.split(props.split),
)

const getLabel = <T,>(value: T) => {
  if (isString(value)) {
    return value
  } else if (isObject(value)) {
    return (
      new Function('o', `return o.${String(props.props.label)}`)(value) ||
      '数据绑定错误'
    )
  }
  return '数据回显错误'
}

const handleClose = <T,>(value: T) =>
  props['onUpdate:modelValue']?.(
    list.value.filter(v => JSON.stringify(v) !== JSON.stringify(value)),
  )
</script>
<template>
  <template v-if="list.length">
    <el-tag
      v-for="(v, i) in list"
      :key="i"
      class="dsrz-tag"
      v-bind="$attrs"
      @close="handleClose(v)"
    >
      {{ getLabel(v) }}
    </el-tag>
  </template>
</template>
<style lang="scss" scoped></style>
