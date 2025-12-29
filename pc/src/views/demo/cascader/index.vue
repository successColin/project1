<script lang="ts" setup>
import { reactive, ref } from 'vue'

defineOptions({
  name: 'CurrencyCascaderPage',
})

const value = ref([])
const value2 = ref([])

const options = [
  {
    id: 'guide',
    name: 'Guide',
    children: [
      {
        id: 'navigation',
        name: 'Navigation',
        children: [
          {
            id: 'side nav',
            name: 'Side Navigation',
          },
          {
            id: 'top nav',
            name: 'Top Navigation',
          },
        ],
      },
    ],
  },
]

const params = reactive({ status: true })

const request = (params: { status: boolean }) =>
  params.status ? Promise.resolve(options) : Promise.resolve([])
</script>
<template>
  <div>
    <h3>继承el-cascader的所有</h3>
    <div>添加level属性名(用于限制级数)</div>
    <div>
      level:&nbsp;&nbsp;级数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非必填
    </div>
    <CurrencyCascader
      v-model="value"
      :options="options"
      :props="{ label: 'name', value: 'id' }"
      :level="2"
      placeholder="请选择"
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
    <CurrencyCascader
      v-model="value2"
      :params="params"
      :request="request"
      :update="{ ...params }"
      :props="{ label: 'name', value: 'id' }"
      placeholder="请选择"
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
