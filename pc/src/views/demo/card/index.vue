<script lang="ts" setup>
import { reactive } from 'vue'

defineOptions({
  name: 'CurrencyCardPage',
})

const items = reactive({
  title: 'Currency Card',
})
</script>
<template>
  <div>
    <CurrencyCard :items="items" />
  </div>
</template>
