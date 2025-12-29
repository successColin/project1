<script lang="ts" setup>
import { useMessageBox } from 'dsrz/hooks/useMessageBox'
import { reactive } from 'vue'

defineOptions({
  name: 'CurrencyDialogPage',
})

const alert = reactive({
  visible: false,
  size: 'small',
  content: '这是一段内容',
})

const form = reactive({
  visible: false,
  size: 'default',
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

const handleAlert = (size: string) =>
  Object.assign(alert, { visible: true, size })

const handleForm = (size: string) =>
  Object.assign(form, { visible: true, size })

const handleCard = (size: string) =>
  Object.assign(card, { visible: true, size })
</script>
<template>
  <div>
    <CurrencyButton
      title="提示按钮(small) - template"
      type="primary"
      @click="handleAlert('small')"
    />
    <CurrencyButton
      title="提示按钮(small) - ts"
      type="primary"
      @click="useMessageBox('提示', alert.content)"
    />
    <CurrencyButton
      title="form按钮(default)"
      type="primary"
      @click="handleForm('default')"
    />
    <CurrencyButton
      title="form按钮(large)"
      type="primary"
      @click="handleForm('large')"
    />
    <CurrencyButton
      title="card按钮(large)"
      type="primary"
      @click="handleCard('large')"
    />
    <CurrencyDialog
      v-model="alert.visible"
      title="提示"
      :size="alert.size"
      :content="alert.content"
      @cancel="alert.visible = false"
    />
    <CurrencyDialog
      v-model="form.visible"
      title="card弹窗"
      :size="form.size"
      @cancel="form.visible = false"
    >
      <CurrencyForm
        v-model="form.details"
        :items="form.items"
        :rules="form.rules"
        label-position="top"
      />
    </CurrencyDialog>

    <CurrencyDialog
      v-model="card.visible"
      title="card弹窗"
      :size="card.size"
      @cancel="card.visible = false"
    >
      <CurrencyCard :params="card.details" :items="card.items" />
    </CurrencyDialog>
  </div>
</template>
