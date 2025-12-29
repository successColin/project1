<script lang="ts" setup>
import { isFunction } from 'dsrz/utils'

defineOptions({
  name: 'CurrencySwitch',
})

const props = defineProps({
  backups: {
    type: Object,
    default: () => ({}),
  },
  beforeChange: {
    type: [Function, Boolean],
    default: true,
  },
})

const emit = defineEmits(['change'])

const handleBeforeChange = () => {
  if (isFunction(props.beforeChange)) {
    if (Object.keys(props.backups).length === 0) {
      return props.beforeChange()
    } else {
      return props.beforeChange(props.backups)
    }
  }
  return true
}

const handleChange = (value: boolean | string | number) => {
  if (Object.keys(props.backups).length === 0) {
    emit('change', value)
  } else {
    emit('change', props.backups)
  }
}
</script>
<template>
  <el-switch
    class="switch"
    v-bind="$attrs"
    :before-change="handleBeforeChange"
    @change="handleChange"
  />
</template>
<style lang="scss" scoped>
.switch {
  height: 16px;
  ::v-deep(.el-switch__core) {
    height: 16px;
    min-width: 28px;
  }
  ::v-deep(.el-switch__core .el-switch__action) {
    width: 12px;
    height: 12px;
  }
}
.switch.is-checked ::v-deep(.el-switch__core .el-switch__action) {
  left: calc(100% - 14px);
}
</style>
