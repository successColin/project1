<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { TreeData } from 'element-plus'

import { createRef } from 'dsrz/utils'
import { definePropType } from 'element-plus/es/utils/index.mjs'

defineOptions({
  name: 'CurrencyTreeSelect',
})

const props = defineProps({
  treeSelectRef: {
    type: String,
    default: 'treeSelectRef',
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
  request: {
    type: Function,
    default: undefined,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  update: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: definePropType<TreeData>(Array),
    default: () => [],
  },
})

const selectData = ref(props.data)

watch(
  () => props.update,
  async (n, o) => {
    if (JSON.stringify(n) !== JSON.stringify(o) && props.request) {
      selectData.value = await props.request(
        Object.assign({}, props.params, props.backups, props.update),
      )
    }
  },
  { immediate: true },
)
</script>
<template>
  <el-tree-select
    :ref="(e: any) => createRef(e, treeSelectRef)"
    v-bind="$attrs"
    :data="selectData"
  />
</template>
