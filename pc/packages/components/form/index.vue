<script lang="ts" setup>
import { computed, h, type PropType } from 'vue'

import { ElFormItem } from 'element-plus'

import {
  createRef,
  isDisplay,
  handleList,
  handleBind,
  handleOn,
  handleDefault,
  isArray,
  isEmpty,
} from 'dsrz/utils'

import CurrencyComponent from 'dsrz/components/component/index.vue'

import type { ItemsProps } from './types'

defineOptions({
  name: 'CurrencyForm',
})

const props = defineProps({
  formRef: {
    type: String,
    default: 'formRef',
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  items: {
    type: Array as PropType<ItemsProps<object>[]>,
    default: () => [],
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  inline: {
    type: Boolean,
    default: false,
  },
})

const colBind = computed(
  () => (span?: number | number[]) =>
    isArray(span)
      ? {
          span: handleDefault(span[0], props.modelValue, 24),
          class: [{ 'el-col-100-115-114-122': span[1] }],
        }
      : { span: handleDefault(span, props.modelValue, 24) },
)
</script>
<template>
  <el-form
    :ref="(e: unknown) => createRef(e, formRef)"
    class="dsrz-form"
    :model="modelValue"
    :rules="rules"
    :inline="inline"
    v-bind="$attrs"
    @submit.prevent
  >
    <el-row v-if="!inline">
      <template v-for="(v, i) in items" :key="i">
        <el-col
          v-if="isDisplay(v.display, modelValue)"
          v-bind="colBind(v.span)"
        >
          <div v-if="v.children" class="dsrz-form-children">
            <CurrencyComponent
              :is="v.is"
              :children="v"
              :list="handleList(v.list, modelValue)"
              v-bind="handleBind(v.bind, modelValue, v)"
              v-on="handleOn(v)"
            />
          </div>
          <component
            v-else
            :is="
              h(
                ElFormItem,
                {
                  label: v.label,
                  prop: v.prop,
                  labelPosition: v.labelPosition,
                },
                {
                  ...v.slots,
                  default: () =>
                    h(CurrencyComponent, {
                      is: v.is,
                      list: handleList(v.list, modelValue),
                      ...handleBind(v.bind, modelValue, v),
                      ...handleOn(v, isEmpty(v.list)),
                    }),
                },
              )
            "
          />
        </el-col>
      </template>
    </el-row>
    <template v-else v-for="(v, i) in items" :key="i">
      <template v-if="isDisplay(v.display, modelValue)">
        <div v-if="v.children" class="dsrz-form-children">
          <CurrencyComponent
            :is="v.is"
            :children="v"
            :list="handleList(v.list, modelValue)"
            v-bind="handleBind(v.bind, modelValue, v)"
            v-on="handleOn(v)"
          />
        </div>
        <el-form-item
          v-else
          :label="v.label"
          :prop="v.prop"
          :label-position="v.labelPosition"
          :class="[items.length - 1 === i ? 'dsrz-form-last' : '']"
        >
          <CurrencyComponent
            :is="v.is"
            :list="handleList(v.list, modelValue)"
            v-bind="handleBind(v.bind, modelValue, v)"
            v-on="handleOn(v)"
          />
        </el-form-item>
      </template>
    </template>
  </el-form>
</template>
<style lang="scss" scoped></style>
