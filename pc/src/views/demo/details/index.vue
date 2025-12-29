<script lang="ts" setup>
import { reactive } from 'vue'

defineOptions({
  name: 'CurrencyDetailsPage',
})

const form = reactive({
  details: {},
  items: [
    {
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 12,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 12,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 8,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 8,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 8,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 6,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 6,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 6,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
    {
      span: 6,
      label: '姓名',
      prop: 'name',
      is: 'el-input',
      bind: {
        placeholder: '请输入姓名',
      },
    },
  ],
  rules: {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  },
})

const card = reactive({
  visible: false,
  size: 'default',
  details: {
    name2: '张三',
    name3: '李四',
    name4: '王五',
  },
  items: [
    {
      is: 'currency-form',
      line: false,
      bind: {
        items: [
          {
            label: '姓名',
            prop: 'name2',
            is: 'currency-text',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 12,
            label: '姓名',
            prop: 'name3',
            is: 'currency-text',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 12,
            label: '姓名',
            prop: 'name4',
            is: 'currency-text',
            bind: {
              placeholder: '请输入姓名',
            },
          },
        ],
        labelPosition: 'top',
      },
    },
    {
      title: '卡片标题',
      is: 'currency-form',
      bind: {
        items: [
          {
            span: 8,
            label: '姓名',
            prop: 'name',
            is: 'el-input',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 8,
            label: '姓名',
            prop: 'name',
            is: 'el-input',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 8,
            label: '姓名',
            prop: 'name',
            is: 'el-input',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 6,
            label: '姓名',
            prop: 'name',
            is: 'el-input',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 6,
            label: '姓名',
            prop: 'name',
            is: 'el-input',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 6,
            label: '姓名',
            prop: 'name',
            is: 'el-input',
            bind: {
              placeholder: '请输入姓名',
            },
          },
          {
            span: 6,
            label: '姓名',
            prop: 'name',
            is: 'el-input',
            bind: {
              placeholder: '请输入姓名',
            },
          },
        ],
        rules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        },
        labelPosition: 'top',
      },
    },
  ],
})
</script>
<template>
  <CurrencyDetails>
    <CurrencyForm
      v-model="form.details"
      :items="form.items"
      :rules="form.rules"
      label-position="top"
    />
    <CurrencyCard :params="card.details" :items="card.items" />
  </CurrencyDetails>
</template>
