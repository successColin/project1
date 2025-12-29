<script lang="ts" setup>
import { computed } from 'vue'

import LayoutBreadcrumb from '@/components/breadcrumb/index.vue'
import LayoutRouterView from '@/components/router/index.vue'

import { getTextWidth } from 'dsrz/utils'

import useAppStore from '@/stores/modules/app'
import useUserStore from '@/stores/modules/user'

import DropDown from '@/assets/images/drop-down.png'
import Close from '@/assets/images/close.png'

defineOptions({
  name: 'FullScreenPage',
})

const { user, resetToken } = useUserStore()
const appStore = useAppStore()

const { setNameCollapse } = appStore

const isNameCollapse = computed(() => appStore.globalConfig.nameCollapse)

const name = computed(() =>
  isNameCollapse.value ? user.nickName : user.nickName?.slice(0, 1),
)

const avatarStyle = computed(() => ({
  width: `${name.value ? getTextWidth(name.value, 12) : 24}px`,
}))

const handleExit = () => resetToken()
</script>
<template>
  <div class="container">
    <div class="container-header">
      <el-dropdown class="container-header-dropdown">
        <span class="flex aic">
          <div
            class="container-header-avatar"
            :style="avatarStyle"
            @click="setNameCollapse(!isNameCollapse)"
          >
            {{ name }}
          </div>
          <el-image :src="DropDown" class="container-header-icon" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleExit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="container-main">
      <div class="container-main-h" />
      <div class="container-main-top">
        <el-image :src="Close" class="container-main-top-icon" />
        <div class="container-main-top-breadcrumb">
          <LayoutBreadcrumb />
        </div>
      </div>
      <LayoutRouterView />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background: var(--dsrz-bg-color);
  width: 100vw;
  height: 100vh;
  &-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100vw;
    height: var(--dsrz-header-height);
    &-dropdown {
      margin-right: 20px;
    }
    &-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: var(--el-color-primary);
      border-radius: 12px;
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 500;
      font-size: 11px;
      color: #ffffff;
      line-height: 12px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    &-icon {
      width: 24px;
      height: 24px;
      margin-left: 4px;
    }
  }
  &-main {
    width: calc(100vw - 40px);
    height: calc(100vh - var(--dsrz-header-height) - 20px);
    background: var(--dsrz-subtopic-color);
    border-radius: 4px;
    margin: 0 20px;
    &-h {
      height: 10px;
    }
    &-top {
      display: flex;
      align-items: center;
      height: 32px;
      margin: 0 10px;
      &-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
      &-breadcrumb {
        margin-left: 4px;
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 500;
        --el-text-color-primary: #6f6f6f;
        --el-text-color-regular: #6f6f6f;
        --el-text-color-placeholder: #6f6f6f;
        text-align: left;
        font-style: normal;
        text-transform: none;
        ::v-deep(.el-breadcrumb) {
          font-size: 12px;
          line-height: 14px;
        }
        ::v-deep(.el-breadcrumb__separator) {
          text-align: center;
          width: 20px;
          font-weight: 500;
          margin: 0;
        }
        ::v-deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
          color: #222222;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
