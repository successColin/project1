<script lang="ts" setup>
import { ref, watch } from 'vue'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import type { RadioOption, RadioProps } from './types'
import { radioGroupProps } from 'element-plus'
import { backupsProps, requestProps } from '../props'

defineOptions({
  name: 'CurrencyRadio',
})

const {
  params,
  request,
  update,
  backups,
  options,
  props = { label: 'label', value: 'value' },
  ...radioProps
} = defineProps({
  ...radioGroupProps,
  options: {
    type: definePropType<RadioOption[]>(Array),
    default: () => [],
  },
  props: {
    type: definePropType<RadioProps>(Object),
    default: () => ({}),
  },
  ...requestProps,
  ...backupsProps,
})

const convertProps = (list: RadioOption[]) =>
  list.map(v => ({
    label: v[props.label!],
    value: v[props.value!],
  })) as RadioOption[]

const radioOptions = ref(convertProps(options))

watch(
  () => update,
  async (n, o) => {
    if (JSON.stringify(n) !== JSON.stringify(o) && request) {
      radioOptions.value = convertProps(
        await request(Object.assign({}, params, backups, update)),
      )
    }
  },
  { immediate: true },
)
</script>
<template>
  <el-radio-group v-bind="Object.assign({}, $attrs, radioProps)">
    <el-radio
      v-for="(v, i) in radioOptions"
      :key="i"
      :value="v.value"
      :label="v.label"
    />
  </el-radio-group>
</template>
<style lang="scss" scoped></style>
