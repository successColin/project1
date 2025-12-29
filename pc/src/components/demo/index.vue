<script lang="ts" setup>
import { reactive, type PropType } from 'vue'
import type { ColumnItem } from './types'

defineOptions({
  name: 'CurrencyDemo',
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
  backups: {
    type: Object as PropType<ColumnItem['backups']>,
    default: () => ({}),
  },
})

const value = reactive(props.backups)
</script>
<template>
  <div>
    <div>demo模板</div>
    <div>{{ modelValue }}</div>
    <el-input v-model="value.epmb" />
    <CurrencyInput v-model="value.dsrzmb" />
  </div>
</template>
