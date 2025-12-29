<script lang="ts" setup generic="T, P">
import {
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  type PropType,
  type UnwrapRef,
} from 'vue'

import CurrencyComponent from 'dsrz/components/component/index.vue'

import {
  getFormDecrypt,
  getFormEncrypt,
  getMaxWidth,
  handleBind,
  handleList,
  handleOn,
  isArray,
  isBoolean,
  isDisplay,
  isEmpty,
  isObject,
  isString,
} from 'dsrz/utils'

import type { ItemsProps } from 'dsrz/components/form/types'
import { GlobalConfig } from 'dsrz/components/config'

import { ElTableColumn } from 'element-plus'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import type { JSX } from 'vue/jsx-runtime'

import type { ApiResponseData } from '@/request/components'

import type { BtnsProps, ColumnsProps } from './types'

defineOptions({
  name: 'CurrencyTable',
})

const props = defineProps({
  modelValue: {
    type: definePropType<T[]>([Array]),
    default: () => [],
  },
  'onUpdate:modelValue': {
    type: Function,
    default: undefined,
  },
  items: {
    type: Array as PropType<ItemsProps<object>[]>,
    default: () => [],
  },
  btns: {
    type: Array as PropType<BtnsProps<object>[]>,
    default: () => [],
  },
  columns: {
    type: Array as PropType<ColumnsProps<object>[]>,
    default: () => [],
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  request: {
    type: Function as PropType<(params: P) => Promise<ApiResponseData<T>>>,
    default: undefined,
  },
  props: {
    type: Object,
    default: () => ({}),
  },
  bottomHeight: {
    type: Number,
    default: 0,
  },
  adaptive: {
    type: Boolean,
    default: false,
  },
  adaptiveHeight: {
    type: Boolean,
    default: true,
  },
  hideOnSinglePage: {
    type: Boolean,
    default: true,
  },
})

const Container = reactive<Record<string, ReturnType<typeof defineComponent>>>({
  Table: undefined,
  Pagination: undefined,
})

const tableHeight = ref<string | number>('auto')

const loading = ref(false)

const search = reactive(props.params)

interface Pagination {
  data: T[]
  total: number
  currentPage: number
  pageSize: number
}

const pagination = reactive<Pagination>({
  data: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
})

const updateTableHeight = () => {
  const { Table, Pagination } = Container
  if (Table && props.adaptiveHeight) {
    tableHeight.value =
      window.innerHeight -
      Table.getBoundingClientRect().top -
      Pagination.getBoundingClientRect().height -
      props.bottomHeight
  }
}

onMounted(() => {
  window.addEventListener('resize', updateTableHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})

const setTable = (response: ApiResponseData<T>) => {
  if (!isEmpty(props.props)) {
    const { list, total } = props.props
    return { list: response[list] as T[], total: response[total] as number }
  } else {
    const { list, total } = GlobalConfig.elTable.table
    return { list: response[list] as T[], total: response[total] as number }
  }
}

const setSearch = () => {
  const obj = {
    [(props.props.search as string) || GlobalConfig.elTable.search]:
      getFormEncrypt(props.items, search),
  }
  return (isObject(obj['default']) ? obj['default'] : obj) as P
}

const setPagination = () =>
  Object.assign({}, setSearch(), {
    [props.props.currentPage || GlobalConfig.elTable.pagination.currentPage]:
      pagination.currentPage,
    [props.props.pageSize || GlobalConfig.elTable.pagination.pageSize]:
      pagination.pageSize,
  })

const getTable = async () => {
  const { request } = props
  try {
    if (request) {
      loading.value = true
      const { list, total } = setTable(await request(setPagination()))

      pagination.data = list.map(v =>
        getFormDecrypt(props.columns, v as object),
      )
      pagination.total = total || pagination.data.length
    }
  } catch {
    pagination.data = []
    pagination.total = 0
  } finally {
    if (request) {
      props['onUpdate:modelValue']?.(pagination.data)
    } else {
      pagination.data = props.modelValue as UnwrapRef<typeof props.modelValue>
      pagination.total = props.modelValue.length
    }
    loading.value = false
    nextTick(() => updateTableHeight())
  }
}

const handleSizeChange = () => {
  pagination.currentPage = 1
  getTable()
}

const handleCurrentChange = () => getTable()

const CurrencyTableColumn = <S extends object, D>({
  columns,
  search,
  data = [],
}: {
  columns: ColumnsProps<object>[]
  search: S
  data: Record<string, D>[] | unknown
}) => {
  return columns
    .filter(v => isDisplay(v.display, search))
    .map(v =>
      h(
        ElTableColumn,
        Object.assign(v, {
          width: getMaxWidth(v, data as Record<string, D>[], props.adaptive),
        }),
        {
          ...v.slots,
          default: (scope: JSX.IntrinsicElements['el-table-column']) =>
            v.columns
              ? h(CurrencyTableColumn, { columns: v.columns, search, data })
              : v.prop || v.list
                ? h(CurrencyComponent, {
                    is: v.is,
                    ...Object.assign(
                      {},
                      v.form,
                      !isEmpty(v.form) && {
                        scopeIndex: scope.$index,
                      },
                    ),
                    list: handleList(v.list, scope.row),
                    ...handleBind(v.bind, scope.row, v),
                    ...handleOn(v, isEmpty(v.list)),
                  })
                : undefined,
        },
      ),
    )
}

const queryList = ref<Record<string, typeof search>[]>([])

const querySearch = () => {
  const list = props.items
    .filter(
      v =>
        isBoolean(v.isQuery) &&
        !v.isQuery &&
        isString(v.prop) &&
        search[v.prop],
    )
    .map(v =>
      Object.assign({}, isString(v.prop) ? { [v.prop]: search[v.prop] } : {}),
    )
  if (JSON.stringify(list) !== JSON.stringify(queryList.value)) {
    queryList.value = list
    return Promise.reject(new Error('不需要自动查询'))
  }
}

const emptySearch = () => {
  const list = props.items
    .filter(
      v =>
        isBoolean(v.isEmpty) &&
        !v.isEmpty &&
        isString(v.prop) &&
        isEmpty(search[v.prop]),
    )
    .map(v =>
      Object.assign({}, isString(v.prop) ? { [v.prop]: search[v.prop] } : {}),
    )
  if (list.length) {
    return Promise.reject(new Error('数据为空不需要查询'))
  }
}

const clearList = ref<Record<string, typeof search>[]>([])

const clearSearch = () => {
  const list = props.items
    .filter(v => isArray(v.clearValue) && isString(v.prop) && search[v.prop])
    .map(v =>
      Object.assign(
        { clearValue: v.clearValue },
        isString(v.prop) ? { [v.prop as string]: search[v.prop] } : {},
      ),
    )
  if (JSON.stringify(list) !== JSON.stringify(clearList.value)) {
    let number = 0
    list.forEach(v => {
      const prop = Object.keys(v)
        .filter(i => i !== 'clearValue')
        .join('')
      if (clearList.value.length) {
        clearList.value
          .filter(c => c[prop] && c[prop] !== v[prop])
          .forEach(c =>
            c.clearValue
              ?.filter((k: string) => search[k])
              .forEach((k: string) => delete search[k] && number++),
          )
      } else {
        ;(v.clearValue as string[])
          ?.filter(k => search[k])
          .forEach(k => delete search[k] && number++)
      }
    })
    clearList.value = list
    return number > 0 ? Promise.reject(new Error('不需要多次查询')) : undefined
  }
}

const dsrzSearch = () => {
  if (isBoolean(search.dsrzReset) || isBoolean(search.dsrzQuery)) {
    delete search.dsrzReset
    delete search.dsrzQuery
    return Promise.reject(new Error('删除重置标识或删除查询标识'))
  }
}

const updateSearch = () => {
  if (GlobalConfig.elTable.update()) {
    GlobalConfig.elTable.update(false)
    return Promise.reject(new Error('不需要多次查询'))
  }
}

watch(
  [() => search, () => GlobalConfig.elTable.update()],
  async () => {
    try {
      await querySearch()
      await emptySearch()
      await clearSearch()
      await dsrzSearch()
      await updateSearch()
      pagination.currentPage = 1
      getTable()
    } catch (error) {
      console.log('跳过查询', error)
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.modelValue,
  () => {
    if (JSON.stringify(props.modelValue) === JSON.stringify(pagination.data))
      return
    pagination.data = props.modelValue as typeof pagination.data
  },
)
</script>
<template>
  <div class="dsrz-table">
    <CurrencyForm
      v-if="items.length"
      form-ref="tableFormRef"
      class="dsrz-table-form"
      :items="items"
      v-model="search"
      :inline="true"
    />
    <div
      v-if="btns.filter(v => isDisplay(v.display, search)).length"
      class="dsrz-table-button"
    >
      <template v-for="(v, i) in btns" :key="i">
        <component
          v-if="isDisplay(v.display, search)"
          :is="v.is"
          v-bind="handleBind(v.bind, search, v)"
          v-on="handleOn(v)"
        />
      </template>
    </div>
    <div :ref="e => (Container.Table = e)" v-loading="loading">
      <slot name="table" :data="pagination.data" :height="tableHeight">
        <el-table
          class="dsrz-table-table"
          :data="pagination.data"
          :max-height="tableHeight"
          v-bind="$attrs"
        >
          <CurrencyTableColumn
            :columns="columns"
            :search="search"
            :data="$attrs.data || pagination.data"
          />
        </el-table>
      </slot>
    </div>
    <div :ref="e => (Container.Pagination = e)">
      <el-pagination
        v-if="hideOnSinglePage"
        class="dsrz-table-pagination"
        background
        :total="pagination.total"
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :hide-on-single-page="pagination.total < 10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
