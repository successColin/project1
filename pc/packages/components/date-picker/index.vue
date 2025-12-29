<script lang="ts" setup>
import { type DatePickerProps } from 'element-plus'
defineOptions({
  name: 'CurrencyDatePicker',
})

const props = defineProps<Partial<DatePickerProps>>()
</script>
<template>
  <el-date-picker v-bind="{ ...$attrs, ...props }" />
</template>
<style lang="scss" scoped></style>
