<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { listToTree, treeToList } from 'dsrz/utils'
import { useRouteListener } from 'dsrz/hooks/useRouteListener'

import { allRoutes } from '@/router/index'
import usePermissionStore from '@/stores/modules/permission'
import useAppStore from '@/stores/modules/app'

import MenuItem from './item.vue'

defineOptions({
  name: 'LayoutMenuList',
})

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const { listenerRouteChange } = useRouteListener()

const router = useRouter()

const hiddenAllRoutes = computed(() =>
  listToTree(
    treeToList(
      (allRoutes || []).concat(permissionStore.routes),
      'children',
      (a, b) => {
        if (a.meta) {
          a.meta.pid = b?.meta?.id || 0
        }
      },
    ).filter(v => !v.meta?.hidden),
    'children',
    (v, value) => v.meta?.id === value.meta?.pid,
    value => value.meta?.pid === 0,
  ),
)

const defaultOpeneds = ref([])

const handleSelect = (index: string) => {
  router.push(index)
}

listenerRouteChange(
  route =>
    !route.meta.hidden && appStore.setCachedViews([route.name as string]),
  true,
)
</script>
<template>
  <el-menu
    class="menu"
    :collapse="appStore.globalConfig.collapse"
    :default-active="useRoute().path"
    :default-openeds="defaultOpeneds"
    @select="handleSelect"
  >
    <MenuItem
      v-for="(v, i) in hiddenAllRoutes"
      :key="i"
      :value="v"
      :base-path="v.path"
    />
  </el-menu>
</template>
<style lang="scss" scoped>
.menu {
  --el-menu-hover-bg-color: var(--dsrz-menu-item-bg-color);
  --el-menu-sub-item-height: var(--el-menu-item-height);
  ::v-deep(.el-menu-item) {
    padding: 0;
  }
  ::v-deep(.el-menu-item:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--el-menu-active-color);
    border-radius: 10px;
  }

  ::v-deep(.el-sub-menu__title:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--el-menu-active-color);
    border-radius: 10px;
  }

  ::v-deep(.el-menu-item.is-active) {
    --el-menu-base-level-padding: 12px;
    background: var(--el-menu-hover-bg-color);
    color: var(--el-menu-active-color);
    border-left: 4px solid var(--dsrz-menu-item-line-color);
    border-radius: 0 !important;
    padding-right: 0;
  }
  ::v-deep(.el-sub-menu.is-active.is-opened) {
    .el-sub-menu__title {
      color: var(--el-menu-active-color);
    }
  }
  ::v-deep(.el-sub-menu__icon-arrow) {
    font-size: 24px;
    margin-top: -12px;
    right: 8px;
  }
}
</style>
