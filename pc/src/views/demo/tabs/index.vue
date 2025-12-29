<script lang="ts" setup>
import { useResetReactive } from 'dsrz/hooks/useReset'
import { ref } from 'vue'

defineOptions({
  name: 'CurrencyTabsPage',
})
const {
  params,
  exposes: { reset },
} = useResetReactive({
  activeName: '1',
})

const data = ref([])

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
])
</script>
<template>
  <el-tabs v-model="params.activeName" class="dsrz-tabs">
    <el-tab-pane label="模板1" name="1">
      <CurrencyTable
        :data="data"
        :params="params"
        :items="items"
        :btns="btns"
        :columns="columns"
      />
    </el-tab-pane>
    <el-tab-pane label="模板2" name="2">
      <CurrencyTable
        :data="data"
        :params="params"
        :items="items"
        :btns="btns"
        :columns="columns"
      />
    </el-tab-pane>
  </el-tabs>
</template>
