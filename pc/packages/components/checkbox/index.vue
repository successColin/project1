<script lang="ts" setup>
import { ref, watch } from 'vue'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import type { CheckboxOption, CheckboxProps } from './types'
import { backupsProps, requestProps } from '../props'
import { checkboxGroupProps } from 'element-plus'

defineOptions({
  name: 'CurrencyCheckbox',
})

const {
  params,
  request,
  update,
  backups,
  options,
  props = { label: 'label', value: 'value' },
  ...checkboxProps
} = defineProps({
  ...checkboxGroupProps,
  options: {
    type: definePropType<CheckboxOption[]>(Array),
    default: () => [],
  },
  props: {
    type: definePropType<CheckboxProps>(Object),
    default: () => ({}),
  },
  ...requestProps,
  ...backupsProps,
})

const convertProps = (list: CheckboxOption[]) =>
  list.map(v => ({
    label: v[props.label!],
    value: v[props.value!],
  })) as CheckboxOption[]

const checkboxOptions = ref(convertProps(options))

watch(
  () => update,
  async (n, o) => {
    if (JSON.stringify(n) !== JSON.stringify(o) && request) {
      checkboxOptions.value = convertProps(
        await request(Object.assign({}, params, backups, update)),
      )
    }
  },
  { immediate: true },
)
</script>
<template>
  <el-checkbox-group v-bind="Object.assign({}, $attrs, checkboxProps)">
    <el-checkbox
      v-for="(v, i) in checkboxOptions"
      :key="i"
      :value="v.value"
      :label="v.label"
    />
  </el-checkbox-group>
</template>
