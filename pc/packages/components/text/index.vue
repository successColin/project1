<script lang="ts" setup>
defineOptions({
  name: 'CurrencyText',
})

defineProps({
  modelValue: {
    type: [Array, String],
    default: '',
  },
  'onUpdate:modelValue': {
    type: Function,
    default: undefined,
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
  prefixText: {
    type: String,
    default: '',
  },
  suffixText: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <el-text v-bind="$attrs">
    <slot name="prefix">{{ prefixText }}</slot>
    {{ modelValue }}
    <slot name="suffix">{{ suffixText }}</slot>
  </el-text>
</template>
<style lang="scss" scoped></style>
