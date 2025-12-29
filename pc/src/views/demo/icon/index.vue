<script lang="ts" setup>
import { dsrzIconOptions } from 'dsrz/svg'
defineOptions({
  name: 'CurrencyIconPage',
})
</script>
<template>
  <div>
    <div class="dsrz-icon">
      <div v-for="(v, i) in dsrzIconOptions" :key="i" class="dsrz-icon-item">
        <el-icon>
          <component :is="v.value" />
        </el-icon>
        <div>{{ v.label || v.value }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dsrz-icon {
  display: flex;
  flex-wrap: wrap;
  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px;
  }
}
</style>
