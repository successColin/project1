<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({
  name: 'CurrencyInputNumberPage',
})

const value = ref(0)
</script>
<template>
  <div>
    <h3>继承el-input-number的所有属性</h3>
    <div>数字输入框展示模式 mode:horizontal</div>
    <CurrencyInputNumber
      v-model="value"
      prefixText="这是左边的文本"
      suffixText="这是右边的文本"
    />
    <div>数字输入框展示模式 mode:vertical</div>
    <CurrencyInputNumber
      v-model="value"
      mode="vertical"
      prefixText="这是上边的文本"
      suffixText="这是下边的文本"
    />
  </div>
</template>
