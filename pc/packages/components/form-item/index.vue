<script lang="ts" setup>
import { h, type PropType } from 'vue'

import { ElFormItem } from 'element-plus'

import { isFunction } from 'dsrz/utils'

import CurrencyComponent from 'dsrz/components/component/index.vue'

import type { ListProps } from '../component/types'

defineOptions({
  name: 'CurrencyFormItem',
})

defineProps({
  prop: {
    type: [Function, String],
    default: '',
  },
  scopeIndex: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array as PropType<ListProps<object>[]>,
    default: () => [],
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
})
</script>
<template>
  <component
    :is="
      h(
        ElFormItem,
        {
          prop: isFunction(prop) ? prop(scopeIndex) : prop,
          ...$attrs
        },
        {
          default: () =>
            list.map(v =>
              h(CurrencyComponent, {
                is: v.is,
                ...v.bind,
                ...v.on,
              }),
            ),
        },
      )
    "
  />
</template>
