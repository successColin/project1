<script lang="ts" setup>
import { type PropType } from 'vue'

import type { ListProps } from './types'

import { isEmpty, isDisplay } from 'dsrz/utils'

defineOptions({
  name: 'CurrencyComponent',
})

defineProps({
  is: {
    type: [String, Object, Function],
    default: '',
  },
  children: {
    type: Object,
    default: () => ({}),
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
  <template v-if="isEmpty(is) && list.length">
    <template v-for="(v, i) in list" :key="i">
      <template v-if="isDisplay(v.display, backups)">
        <CurrencyComponent
          :is="v.is"
          :children="Object.keys(children).length ? v : {}"
          v-bind="v.bind"
          v-on="v.on"
        />
      </template>
    </template>
  </template>
  <el-form-item
    v-else-if="Object.keys(children).length"
    :label="children.label"
    :prop="children.prop"
  >
    <component :is="is" v-bind="$attrs" :backups="backups" />
  </el-form-item>
  <component
    v-else-if="list.length"
    :is="is"
    v-bind="$attrs"
    :list="list"
    :backups="backups"
  />
  <component v-else-if="is" :is="is" v-bind="$attrs" :backups="backups" />
  <template v-else>{{ $attrs.modelValue }}</template>
</template>
<style lang="scss" scoped></style>
