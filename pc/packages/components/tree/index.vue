<script lang="ts" setup>
import {
  ref,
  watch,
  h,
  computed,
  onMounted,
  onUnmounted,
  reactive,
  defineComponent,
  useAttrs,
} from 'vue'
import { ElTreeV2 } from 'element-plus'
import type { TreeData, TreeKey, TreeNodeData } from 'element-plus'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import 'element-plus/theme-chalk/el-tree.css'
import 'element-plus/theme-chalk/el-virtual-list.css'

import { createRef, isArray, isNumber } from 'dsrz/utils'

defineOptions({
  name: 'CurrencyTree',
})

const props = defineProps({
  treeRef: {
    type: String,
    default: 'treeRef',
  },
  modelValue: {
    type: definePropType<TreeKey[] | number | string>([Array, Number, String]),
    default: () => [],
  },
  'onUpdate:modelValue': {
    type: Function,
    default: undefined,
  },
  backups: {
    type: Object,
    default: () => ({}),
  },
  request: {
    type: Function,
    default: undefined,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  update: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: definePropType<TreeData>(Array),
    default: () => [],
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  height: {
    type: [Number, String],
    default: 'auto',
  },
})

interface TreeOptionProps {
  children?: string
  label?: string
  value?: string
}

const treeData = ref(props.data)

const treeRefreshKey = ref(0)

const treeHeight = ref(0)

const $attrs = useAttrs()

const Container = reactive<Record<string, ReturnType<typeof defineComponent>>>({
  Tree: undefined,
})

const filteredCheckedKeys = computed(() => {
  const parentIds = new Set<string | number>()
  const collectParentIds = (nodes: TreeData) => {
    nodes.forEach(node => {
      const { children = 'children', value = 'id' } =
        $attrs.props as TreeOptionProps
      if (node[children] && node[children].length > 0) {
        parentIds.add(node[value])
        collectParentIds(node[children])
      }
    })
  }
  collectParentIds(treeData.value)
  const checkedKeys = isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue]
  return checkedKeys.filter(key => !parentIds.has(key))
})

const filteredExpandedKeys = computed(() => {
  const checkedKeys = isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue]
  const collectParentIds = (nodes: TreeData, id: string | number) => {
    const parentIds: TreeKey[] = []
    nodes.forEach(node => {
      const { children = 'children', value = 'id' } =
        $attrs.props as TreeOptionProps
      const childrens = node[children]
      if (node[value] === id) {
        parentIds.push(node[value])
      } else if (childrens && childrens.length > 0) {
        const list = collectParentIds(childrens, id)
        if (list.length > 0) {
          parentIds.push(node[value])
          if (!list.includes(id)) {
            parentIds.push(...list)
          }
        }
      }
    })
    return parentIds
  }
  return checkedKeys.reduce(
    (list, id) => [
      ...new Set([...list, ...collectParentIds(treeData.value, id)]),
    ],
    [] as TreeKey[],
  )
})

const handleCheck = (
  _data: TreeNodeData,
  info: { checkedKeys: TreeKey[]; halfCheckedKeys: TreeKey[] },
) =>
  props['onUpdate:modelValue']?.([...info.checkedKeys, ...info.halfCheckedKeys])

const handleCurrentChange = (data: TreeNodeData) =>
  !props.showCheckbox ? props['onUpdate:modelValue']?.(data.id) : undefined

const getData = (data: TreeData) => {
  return data.map(v => {
    v.disabled = props.disabled
    v.children = getData(v.children || [])
    return v
  })
}

const updateTreeHeight = () => {
  const { Tree } = Container
  nextTick(
    () =>
      (treeHeight.value = isNumber(props.height)
        ? props.height
        : window.innerHeight - Tree.getBoundingClientRect().top - 20),
  )
}

onMounted(() => {
  updateTreeHeight()
  window.addEventListener('resize', updateTreeHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTreeHeight)
})

watch(
  () => props.update,
  async (n, o) => {
    if (JSON.stringify(n) !== JSON.stringify(o) && props.request) {
      treeData.value = getData(
        await props.request(
          Object.assign({}, props.params, props.backups, props.update),
        ),
      )
      treeRefreshKey.value++
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  () => props.disabled && treeRefreshKey.value++,
)
</script>
<template>
  <div :ref="e => (Container.Tree = e)">
    <component
      class="currency-tree"
      :is="
        h(
          ElTreeV2,
          {
            ...$attrs,
            key: treeRefreshKey,
            ref: e => createRef(e, treeRef),
            data: treeData,
            defaultCheckedKeys: filteredCheckedKeys,
            defaultExpandedKeys: filteredExpandedKeys,
            showCheckbox,
            height: treeHeight,
            onCheck: handleCheck,
            onCurrentChange: handleCurrentChange,
          },
          $slots,
        )
      "
    />
  </div>
</template>
<style lang="scss" scoped>
.currency-tree {
  width: 100%;
}
</style>
