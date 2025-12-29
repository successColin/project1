<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MenuItem from './item.vue'
defineOptions({
  name: 'LayoutMenuItem',
})

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  basePath: {
    type: String,
    default: '',
  },
})

/** 是否始终显示根菜单 */
const alwaysShowMenu = computed(() => props.value.meta?.alwaysShow)

/** 显示的子菜单 */
const showChildren = computed(() => props.value.children)

/** 唯一的子菜单项 */
const onlyOneChild = computed(() => {
  const number = showChildren.value?.length || 0
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showChildren.value[0]
    default:
      return props.value
  }
})

/** 解析路径 */
const resolvePath = (path: string) => {
  const list = props.basePath.split('/').concat(path.split('/')).filter(Boolean)
  return `/${list.filter((v, i) => list.indexOf(v) === i).join('/')}`
}
</script>
<template>
  <el-menu-item
    v-if="!alwaysShowMenu && onlyOneChild && !onlyOneChild.children?.length"
    :index="resolvePath(onlyOneChild.path)"
  >
    <el-icon
      v-if="onlyOneChild.meta?.icon && onlyOneChild.meta?.icon !== '#'"
      class="mebu-left-icon"
    >
      <component :is="onlyOneChild.meta?.icon" />
    </el-icon>
    <template #title>
      <span>{{ onlyOneChild.meta?.title }}</span>
      <el-icon
        v-if="useRoute().path === resolvePath(onlyOneChild.path)"
        class="dsrz-arrow"
      >
        <DsrzArrow />
      </el-icon>
      <div v-if="value.meta?.badge" class="menu-right-badge">
        {{ value.meta?.badge > 99 ? '99+' : value.meta?.badge }}
      </div>
    </template>
  </el-menu-item>
  <el-sub-menu
    v-else
    :index="resolvePath(value.path)"
    expand-close-icon="DsrzDown"
    expand-open-icon="DsrzUp"
  >
    <template #title>
      <el-icon
        v-if="value.meta?.icon && value.meta?.icon !== '#'"
        class="mebu-left-icon"
      >
        <component :is="value.meta?.icon" />
      </el-icon>
      <span>{{ value.meta?.title }}</span>
      <div v-if="value.meta?.badge" class="menu-right-badge">
        {{ value.meta?.badge > 99 ? '99+' : value.meta?.badge }}
      </div>
    </template>
    <template v-if="showChildren">
      <MenuItem
        v-for="(v, i) in showChildren"
        :key="i"
        :value="v"
        :base-path="resolvePath(value.path)"
      />
    </template>
  </el-sub-menu>
</template>
<style lang="scss" scoped>
.mebu-left-icon {
  --el-menu-icon-width: 16px;
  font-size: 16px !important;
  margin-right: 8px !important;
}

.menu-right-badge {
  position: relative;
  right: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(355deg, #065968 0%, rgba(34, 246, 254, 0.7) 100%);
  border-radius: 50%;
  font-weight: bold;
  font-size: 11px;
  color: #ffffff;
  line-height: 22px;
  text-shadow: 0px 2px 2px rgba(16, 35, 55, 0.25);
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.dsrz-arrow {
  font-size: 24px !important;
  position: absolute;
  right: 0;
  margin-right: 8px !important;
}
</style>
