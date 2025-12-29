<script lang="ts" setup>
defineOptions({
  name: 'CurrencyTreePage',
})
const data = [
  { label: 'a', children: [{ label: 'aa' }, { label: 'ab' }, { label: 'ac' }] },
  { label: 'b' },
  { label: 'c' },
  { label: 'd' },
  { label: 'e' },
  { label: 'f' },
  { label: 'g' },
  { label: 'h' },
  { label: 'i' },
  { label: 'j' },
  { label: 'k' },
  { label: 'l' },
  { label: 'm' },
  { label: 'n' },
  { label: 'o' },
  { label: 'p' },
  { label: 'q' },
  { label: 'r' },
  { label: 's' },
  { label: 't' },
]
</script>
<template>
  <div>
    <CurrencyTree :data="data" show-checkbox :height="100" />
  </div>
</template>
