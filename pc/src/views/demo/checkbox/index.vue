<script lang="ts" setup>
import { reactive, ref } from 'vue'

defineOptions({
  name: 'CurrencyCheckboxPage',
})

const params = reactive({
  status: false,
})

const checkbox1 = ref([])
const checkbox2 = ref([])
const checkbox3 = ref([])

const options1 = ref([
  { value: 1, label: 'checkbox1' },
  { value: 2, label: 'checkbox2' },
  { value: 3, label: 'checkbox3' },
])

const options2 = ref([
  { id: 1, name: 'checkbox1' },
  { id: 2, name: 'checkbox2' },
  { id: 3, name: 'checkbox3' },
])

const request = (params: { status: boolean }) =>
  params.status
    ? Promise.resolve([
        { id: 4, name: 'checkbox4' },
        { id: 5, name: 'checkbox5' },
        { id: 6, name: 'checkbox6' },
      ])
    : Promise.resolve([
        { id: 1, name: 'checkbox1' },
        { id: 2, name: 'checkbox2' },
        { id: 3, name: 'checkbox3' },
      ])
</script>
<template>
  <div>
    <h3>继承el-checkbox-group的所有属性</h3>
    <div>添加options属性名</div>
    <div>
      options:&nbsp;&nbsp;选项的数据源&nbsp;&nbsp;通过props配置value和label&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;必填
    </div>
    <CurrencyCheckbox v-model="checkbox1" :options="options1" />
    <div>添加props属性名</div>
    <div>
      props:&nbsp;&nbsp;配置选项&nbsp;&nbsp;{ label: 'label', value: 'value'
      }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非必填
    </div>
    <CurrencyCheckbox
      v-model="checkbox2"
      :options="options2"
      :props="{ label: 'name', value: 'id' }"
    />
    <div>添加params,request,update属性名(用于异步请求接口)</div>
    <div>
      params:&nbsp;&nbsp;请求参数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非必填
    </div>
    <div>
      request:&nbsp;&nbsp;请求方法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非必填(异步请求时必填)
    </div>
    <div>
      update:&nbsp;&nbsp;更新参数(用于更新请求参数)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非必填
    </div>
    <CurrencyCheckbox
      v-model="checkbox3"
      :params="params"
      :request="request"
      :update="{ ...params }"
      :props="{ label: 'name', value: 'id' }"
    />
    <div>
      <el-button type="success" @click="params.status = !params.status">
        update更新测试
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
div {
  margin: 10px;
}
</style>
