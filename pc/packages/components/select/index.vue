<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue'

import {
  createEventHandlers,
  createRef,
  getFilteredEventNames,
} from 'dsrz/utils'
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types.mjs'
import { ElSelectV2 } from 'element-plus'

defineOptions({
  name: 'CurrencySelect',
})

const props = defineProps({
  selectRef: {
    type: String,
    default: 'selectRef',
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
  remoteQequest: {
    type: Function,
    default: undefined,
  },
  options: {
    type: Array as PropType<OptionType[]>,
    default: () => [],
  },
})

const selectOptions = ref(props.options)
const loading = ref(false)

const emit = defineEmits(getFilteredEventNames(ElSelectV2.emits))

const remoteMethod = async (query: string) => {
  if (query !== '') {
    loading.value = true
    if (props.remoteQequest) {
      selectOptions.value = await props.remoteQequest(
        Object.assign({ query }, props.params, props.backups),
      )
    }
    loading.value = false
  } else {
    selectOptions.value = []
  }
}

watch(
  () => props.update,
  async (n, o) => {
    if (JSON.stringify(n) !== JSON.stringify(o) && props.request) {
      selectOptions.value = await props.request(
        Object.assign({}, props.params, props.backups, props.update),
      )
    }
  },
  { immediate: true },
)
</script>
<template>
  <el-select-v2
    :ref="(e: any) => createRef(e, selectRef)"
    v-bind="
      Object.assign(
        {},
        $attrs,
        createEventHandlers(ElSelectV2.emits, emit, backups),
      )
    "
    :options="selectOptions"
    :remote-method="remoteMethod"
    :loading="loading"
  />
</template>
