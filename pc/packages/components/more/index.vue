<script lang="ts" setup>
import { computed, type PropType } from 'vue'

import { isDisplay } from 'dsrz/utils'
import type { MoreProps } from './types'

defineOptions({
  name: 'CurrencyMore',
})

const props = defineProps({
  list: {
    type: Array as PropType<MoreProps<object>[]>,
    default: () => [],
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
  number: {
    type: Number,
    default: 3,
  },
})

const menus = computed(() =>
  props.list.filter(v => isDisplay(v.display, props.backups)),
)
</script>
<template>
  <div>
    <template
      v-for="(v, i) in menus.filter((_v, i) => i < number - 1)"
      :key="i"
    >
      <template v-if="isDisplay(v.display, backups)">
        <CurrencyComponent :is="v.is" v-bind="v.bind" v-on="v.on" />
      </template>
    </template>
    <template v-if="menus.length === number">
      <template
        v-for="(v, i) in menus.filter((_v, i) => i === number - 1)"
        :key="i"
      >
        <template v-if="isDisplay(v.display, backups)">
          <CurrencyComponent :is="v.is" v-bind="v.bind" v-on="v.on" />
        </template>
      </template>
    </template>
    <el-dropdown
      v-else-if="menus.length > number - 1"
      class="currency-more"
      trigger="click"
      placement="bottom-end"
      v-bind="$attrs"
    >
      <el-button class="currency-more-link" :link="true">更多</el-button>
      <template #dropdown>
        <el-dropdown-menu class="currency-more-dropdown">
          <template
            v-for="(v, i) in menus.filter((_v, i) => i >= number - 1)"
            :key="i"
          >
            <el-dropdown-item>
              <CurrencyComponent :is="v.is" v-bind="v.bind" v-on="v.on" />
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<style lang="scss" scoped>
.currency-more {
  height: 24px;
  &-link {
    color: #6f6f6f;
    margin-left: 8px;
  }
  &-dropdown {
    ::v-deep(.el-dropdown-menu__item) {
      padding: 0;
      .el-button {
        width: 100%;
        padding: 7px 18px;
      }
    }
  }
}
</style>
