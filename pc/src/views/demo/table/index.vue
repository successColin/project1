<script lang="ts" setup>
import { h, ref } from 'vue'
import { useResetReactive } from 'dsrz/hooks/useReset'
import { aesEncrypt } from 'dsrz/utils'

import CurrencyDemo from '@/components/demo/index.vue'

import type { ColumnItem, Params } from './types'

defineOptions({
  name: 'CurrencyTablePage',
})

const {
  params,
  exposes: { reset },
} = useResetReactive({})

const data = ref([
  {
    jc: '基础',
    encrypt: aesEncrypt('加密'),
    decrypt: aesEncrypt('解密'),
    epmb: 'element-plus模板',
    dsrzmb: 'dsrz模板',
    h1: 'h(简单):modelValue',
    h2: 'h(简单):backups',
    h3: 'h(复杂)',
  },
])

const items = ref([
  {
    prop: 'srk',
    is: 'currency-input',
    bind: {
      placeholder: '输入框',
      clearable: true,
    },
  },
  {
    prop: 'jmsrk',
    is: 'currency-input',
    display: ({ show }: Params) => show === 1,
    isEncrypt: true,
    bind: {
      placeholder: '输入框(加密)',
      clearable: true,
    },
  },
  {
    prop: 'epxlk',
    is: 'el-select-v2',
    bind: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
      placeholder: 'element-plus下拉框',
      clearable: true,
    },
  },
  {
    prop: 'show',
    is: 'el-select-v2',
    bind: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      placeholder: 'display使用',
      clearable: true,
    },
  },
  {
    prop: 'dsrzxlk',
    is: 'currency-select',
    bind: {
      request: () => [
        { id: '选项1', name: '1' },
        { id: '选项2', name: '2' },
      ],
      props: { label: 'name', value: 'id' },
      placeholder: 'dsrz下拉框',
      clearable: true,
    },
  },
  {
    prop: 'date',
    is: 'el-date-picker',
    queryValue: ['startDate', 'endDate'],
    joinValue: ['00:00:00', '23:59:59'],
    bind: {
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      clearable: true,
    },
  },
  {
    is: 'currency-button',
    bind: {
      color: '#6f6f6f',
      title: '清空',
      icon: 'DsrzClear',
    },
    on: { click: reset },
  },
])

const btns = ref([
  {
    is: 'currency-button',
    bind: {
      color: '#178782',
      title: '次要按钮(有图标)(可多个)',
      icon: 'DsrzDelete',
    },
  },
  {
    is: 'currency-button',
    bind: {
      type: 'primary',
      title: '主要按钮(有图标)(只有一个且排在最右边)',
      icon: 'DsrzAdd',
    },
  },
])

const columns = ref([
  { type: 'selection', width: '55px' },
  { label: '基础', prop: 'jc' },
  {
    label: '加密',
    prop: 'encrypt',
    display: ({ show }: Params) => show === 1,
  },
  { label: '解密', prop: 'decrypt', isDecrypt: true },
  { label: 'element-plus模板', prop: 'epmb', is: 'el-input' },
  { label: 'dsrz模板', prop: 'dsrzmb', is: 'currency-input' },
  {
    label: 'h(简单):modelValue',
    prop: 'h1',
    is: ({ modelValue }: ColumnItem) =>
      h('span', { style: { color: 'red' } }, modelValue),
  },
  {
    label: 'h(简单):backups',
    prop: 'h2',
    is: ({ backups }: ColumnItem) => h('span', backups.h2),
  },
  { label: 'h(复杂)', prop: 'h2', is: h(CurrencyDemo) },
  {
    label: '操作(基础) <=3',
    is: 'currency-more',
    list: [
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑1' },
      },
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑2' },
      },
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑3' },
      },
    ],
  },
  {
    label: '操作(更多) > 3',
    is: 'currency-more',
    list: [
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑1' },
      },
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑2' },
      },
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑3' },
      },
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑4' },
      },
      {
        is: 'currency-button',
        bind: { type: 'primary', link: true, title: '编辑5' },
      },
    ],
  },
])
</script>
<template>
  <CurrencyTable
    :data="data"
    :params="params"
    :items="items"
    :btns="btns"
    :columns="columns"
  />
</template>
