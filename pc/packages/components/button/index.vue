<script lang="ts" setup>
import { computed, h } from 'vue'

import { buttonProps, ElButton } from 'element-plus'

import { createEventHandlers, getFilteredEventNames, isEmpty } from 'dsrz/utils'

import { backupsProps } from '../props'

defineOptions({
  name: 'CurrencyButton',
  inheritAttrs: false,
})

const { title, type, color, textColor, backups, ...props } = defineProps({
  ...buttonProps,
  title: { type: String, default: '' },
  textColor: { type: String, default: '' },
  ...backupsProps,
})

const buttonStyle = computed(() =>
  isEmpty(type)
    ? {
        '--el-button-text-color': color,
        '--el-button-hover-text-color': color,
        '--el-button-hover-border-color': color,
      }
    : !isEmpty(type) && !isEmpty(textColor)
      ? {
          '--el-button-text-color': textColor,
          '--el-button-hover-text-color': textColor,
          '--el-button-hover-border-color': color,
        }
      : {},
)
const buttonColor = computed(() => (isEmpty(type) ? '' : color))

const emit = defineEmits(getFilteredEventNames(ElButton.emits))
</script>
<template>
  <component
    :is="
      h(
        ElButton,
        Object.assign(
          { type, style: buttonStyle, color: buttonColor },
          $attrs,
          props,
          createEventHandlers(ElButton.emits, emit, backups),
        ),
        Object.assign({}, { ...(title && { default: () => title }) }, $slots),
      )
    "
  />
</template>
<style lang="scss" scoped></style>
