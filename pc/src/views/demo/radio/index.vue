<script lang="ts" setup>
import { reactive, ref } from 'vue'

defineOptions({
  name: 'CurrencyRadioPage',
})

const params = reactive({
  status: false,
})

const radio1 = ref()
const radio2 = ref()
const radio3 = ref()

const options1 = ref([
  { value: 1, label: 'radio1' },
  { value: 2, label: 'radio2' },
  { value: 3, label: 'radio3' },
])

const options2 = ref([
  { id: 1, name: 'radio1' },
  { id: 2, name: 'radio2' },
  { id: 3, name: 'radio3' },
])

const request = (params: { status: boolean }) =>
  params.status
    ? Promise.resolve([
        { id: 4, name: 'radio4' },
        { id: 5, name: 'radio5' },
        { id: 6, name: 'radio6' },
      ])
    : Promise.resolve([
        { id: 1, name: 'radio1' },
        { id: 2, name: 'radio2' },
        { id: 3, name: 'radio3' },
      ])
</script>
<template>
  <div>
    <h3>继承el-radio-group的所有属性</h3>
    <div>添加options属性名</div>
    <div>
      options:&nbsp;&nbsp;选项的数据源&nbsp;&nbsp;通过props配置value和label&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;必填
    </div>
    <CurrencyRadio v-model="radio1" :options="options1" />
    <div>添加props属性名</div>
    <div>
      props:&nbsp;&nbsp;配置选项&nbsp;&nbsp;{ label: 'label', value: 'value'
      }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非必填
    </div>
    <CurrencyRadio
      v-model="radio2"
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
    <CurrencyRadio
      v-model="radio3"
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
