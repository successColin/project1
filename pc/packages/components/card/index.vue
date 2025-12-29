<script lang="ts" setup>
import { reactive, ref } from 'vue'

import {
  isArray,
  isDisplay,
  handleList,
  handleBind,
  handleOn,
} from 'dsrz/utils'

import CurrencyComponent from 'dsrz/components/component/index.vue'

defineOptions({
  name: 'CurrencyCard',
})

const props = defineProps({
  items: {
    type: [Object, Array],
    default: () => [],
  },
  params: {
    type: Object,
    default: () => ({}),
  },
})

const cards = ref(isArray(props.items) ? props.items : [props.items])

const search = reactive(props.params)
</script>

<template>
  <template v-for="(v, i) in cards" :key="i">
    <div v-if="isDisplay(v.display, search)" class="dsrz-card">
      <div v-if="isDisplay(v.line, search) && v.title" class="dsrz-card-header">
        <div class="dsrz-card-header-left">
          <div
            v-if="isDisplay(v.line, search)"
            class="dsrz-card-header-left-line"
          />
          <div class="dsrz-card-header-left-title">{{ v.title }}</div>
        </div>
      </div>
      <CurrencyComponent
        :is="v.is"
        :list="handleList(v.list, search)"
        v-bind="handleBind(v.bind, search, v)"
        v-on="handleOn(v)"
      />
    </div>
  </template>
</template>
<style lang="scss" scoped></style>
