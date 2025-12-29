<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({
  name: 'CurrencyTagPage',
})

const tags = ref('tag1,tag2,tag3')
const tags2 = ref('tag1-tag2-tag3')
const tags3 = ref(['tag1', 'tag2', 'tag3'])
const tags4 = ref([
  { value: 1, label: 'tag1' },
  { value: 2, label: 'tag2' },
  { value: 3, label: 'tag3' },
])

const tags5 = ref([
  { id: 1, name: 'tag1' },
  { id: 2, name: 'tag2' },
  { id: 3, name: 'tag3' },
])
</script>
<template>
  <div>
    <h3>继承el-tag的所有属性</h3>
    <div>String类型,默认使用"," 例:{{ tags }}</div>
    <CurrencyTag v-model="tags" />
    <div>String类型,使用split配置分割 例:{{ tags2 }}</div>
    <CurrencyTag v-model="tags2" split="-" />
    <div>Array类型,数据为String类型 例:{{ tags3 }}</div>
    <CurrencyTag v-model="tags3" />
    <div>Array类型,数据为Object类型 例:{{ tags4 }}</div>
    <CurrencyTag v-model="tags4" :props="{ label: 'label', value: 'value' }" />
    <div>Array类型,数据为Object类型,使用props配置选项 例:{{ tags5 }}</div>
    <CurrencyTag
      v-model="tags5"
      :props="{ label: 'name', value: 'id' }"
      closable
    />
  </div>
</template>
