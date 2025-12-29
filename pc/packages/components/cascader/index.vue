<script lang="ts" setup>
import { h, ref, watch } from 'vue'

import { cascaderProps, ElCascader, type CascaderOption } from 'element-plus'
import 'element-plus/theme-chalk/el-cascader.css'
import 'element-plus/theme-chalk/el-cascader-panel.css'

import {
  createEventHandlers,
  createRef,
  getFilteredEventNames,
} from 'dsrz/utils'

import { backupsProps, requestProps } from '../props'

defineOptions({
  name: 'CurrencyCascader',
  inheritAttrs: false,
})

const {
  cascaderRef,
  params,
  request,
  update,
  level,
  backups,
  options,
  ...props
} = defineProps({
  ...cascaderProps,
  cascaderRef: {
    type: String,
    default: 'cascaderRef',
  },
  level: {
    type: Number,
    default: 999999999,
  },
  ...requestProps,
  ...backupsProps,
})

const emit = defineEmits(getFilteredEventNames(ElCascader.emits))

const filteredOptions = (
  options: CascaderOption[] = [],
  level: number,
): CascaderOption[] => {
  if (level === 0) {
    return []
  }
  return options.map(({ children, ...value }) => ({
    ...value,
    children: filteredOptions(children, level - 1),
  }))
}

const cascaderOptions = ref(filteredOptions(options, level))

watch(
  () => update,
  async (n, o) => {
    if (JSON.stringify(n) !== JSON.stringify(o) && request) {
      const list = await request(Object.assign({}, params, backups, update))
      cascaderOptions.value = filteredOptions(list, level)
    }
  },
  { immediate: true },
)
</script>
<template>
  <component
    :is="
      h(
        ElCascader,
        Object.assign(
          {
            ref: (e: any) => createRef(e, cascaderRef),
            options: cascaderOptions,
          },
          $attrs,
          props,
          createEventHandlers(ElCascader.emits, emit, backups),
        ),
        $slots,
      )
    "
  />
</template>
