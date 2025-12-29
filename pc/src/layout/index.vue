<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import LayoutMenuList from '@/layout/menu/list.vue'
import LayoutBreadcrumb from '@/components/breadcrumb/index.vue'
import LayoutRouterView from '@/components/router/index.vue'

import useUserStore from '@/stores/modules/user'
import useAppStore from '@/stores/modules/app'

import MaxLogo from '@/assets/images/max-logo.png'
import MinLogo from '@/assets/images/min-logo.png'
import DropDown from '@/assets/images/drop-down.png'
import Close from '@/assets/images/close.png'
import Open from '@/assets/images/open.png'

import { getTextWidth } from 'dsrz/utils'

defineOptions({
  name: 'LayoutPage',
})

const { user, resetToken } = useUserStore()
const appStore = useAppStore()
const { setCollapse, setNameCollapse } = appStore

const defaultDark = ref([])

const isCollapse = computed(() => appStore.globalConfig.collapse)

const logo = computed(() => (isCollapse.value ? MinLogo : MaxLogo))

const sizeClass = computed(
  () => (s: string) =>
    `container-aside-${isCollapse.value ? 'min' : 'max'}-${s}`,
)
const divClass = computed(
  () => (s: string) => `container-${s}${isCollapse.value ? '--collapse' : ''}`,
)

const darkClass = computed(
  () => (s: string) =>
    `container-main${defaultDark.value.some(k => k === s) ? '-dark' : ''}`,
)

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
  <div :class="['container', { collapse: isCollapse }]">
    <div :class="['container-aside', divClass('aside')]">
      <el-image :src="logo" :class="sizeClass('logo')" />
      <el-scrollbar :class="['container-aside-menu', sizeClass('scrollbar')]">
        <LayoutMenuList />
      </el-scrollbar>
    </div>
    <div>
      <div :class="['container-header', divClass('header')]">
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
      <div :class="[darkClass(useRoute().path), divClass('main')]">
        <div class="container-main-h" />
        <div class="container-main-top">
          <el-image
            :src="isCollapse ? Close : Open"
            class="container-main-top-icon"
            @click="setCollapse(!isCollapse)"
          />
          <div class="container-main-top-breadcrumb">
            <LayoutBreadcrumb />
          </div>
        </div>
        <LayoutRouterView />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  background: var(--dsrz-bg-color);
  &-aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: var(--dsrz-aside-max-width);
    transition: var(--el-transition-duration-fast);
    &-max-logo {
      width: 166px;
      height: 62px;
      margin: 20px 0 40px 0;
    }
    &-min-logo {
      width: 34px;
      height: 30px;
      margin: 20px 0 40px 0;
    }
    &-max-scrollbar {
      height: calc(100vh - 142px);
    }
    &-min-scrollbar {
      height: calc(100vh - 110px);
    }
    &-menu {
      ::v-deep(.el-menu) {
        --el-menu-base-level-padding: 16px;
        width: var(--dsrz-aside-max-width);
      }
      ::v-deep(.el-menu--collapse) {
        width: var(--dsrz-aside-min-width);
        --el-menu-item-height: var(--dsrz-aside-min-width);
        --el-menu-base-level-padding: 15.5px;
        .el-icon {
          height: auto;
          line-height: auto;
        }
      }
    }
    &--collapse {
      width: var(--dsrz-aside-min-width);
    }
  }
  &-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: calc(100vw - var(--dsrz-aside-max-width));
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
    &--collapse {
      width: calc(100vw - var(--dsrz-aside-min-width));
    }
  }
  &-main {
    width: calc(100vw - var(--dsrz-aside-max-width) - 20px);
    height: calc(100vh - var(--dsrz-header-height) - 20px);
    background: var(--dsrz-subtopic-color);
    border-radius: 4px;
    margin: 0 20px 20px 0;
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
    &--collapse {
      width: calc(100vw - var(--dsrz-aside-min-width) - 20px);
    }
    &-dark {
      background: var(--dsrz-bg-color);
      ::v-deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}

:focus-visible {
  outline: 0;
}
</style>
