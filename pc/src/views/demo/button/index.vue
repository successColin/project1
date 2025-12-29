<script lang="ts" setup>
import { reactive } from 'vue'

defineOptions({
  name: 'CurrencyButtonPage',
})

const params = reactive({ a: 1, b: 2, c: 3 })
/** 使用 MouseEvent 的方法 用e,不用_e */
const handleClick = (_e: MouseEvent, backups: typeof params) => {
  console.log(backups)
}
</script>
<template>
  <div>
    <h3>继承el-button的所有</h3>
    <div>添加title属性名</div>
    <div>
      title:&nbsp;&nbsp;按钮名称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非必填
    </div>
    <CurrencyButton title="默认按钮" />
    <div>修改color属性名的显示效果</div>
    <div>默认: <el-button color="#FE9433">primary</el-button></div>
    <div>修改: <CurrencyButton title="primary" color="#FE9433" /></div>
    <div>
      添加backups属性名(主要表格和表单使用),每个事件名的最后都添加此参数
    </div>
    <CurrencyButton
      title="primary"
      type="primary"
      :backups="params"
      @click="handleClick"
    />
  </div>
</template>
<style lang="scss" scoped>
div {
  margin: 10px;
}
</style>
