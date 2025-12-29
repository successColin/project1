<script lang="ts" setup>
import type { TreeNodeData } from 'element-plus'
import { definePropType } from 'element-plus/es/utils/index.mjs'
import { computed, h, reactive, ref, watch } from 'vue'

import { useMessageBox } from 'dsrz/hooks/useMessageBox'
import { useResetReactive } from 'dsrz/hooks/useReset'
import { deepClone, findTreeByKey, isArray, isEmpty, refs } from 'dsrz/utils'

import CurrencyDialog from 'dsrz/components/dialog/index.vue'

import api from '@/request'

import type { CropperProps } from '../upload/type'
import type { FileParams, TableData } from './types'

const {
  categorize: {
    tree: treeApi,
    add: categorizeAddApi,
    edit: editApi,
    del: categorizeDelApi,
  },
  list,
  add: addApi,
  del: delApi,
} = findTreeByKey(api, 'materialLibrary')

defineOptions({
  name: 'CurrencyMaterialLibrary',
})

const props = defineProps({
  mode: {
    type: definePropType<'dialog' | 'default'>(String),
    default: 'default',
  },
  cropper: {
    type: definePropType<CropperProps>(Object),
    default: () => ({}),
  },
  accept: {
    type: String,
    default: '',
  },
  limit: {
    type: Number,
    default: 999999999,
  },
})

const backups = reactive({
  params: {
    type: '',
    width: '',
    height: '',
    ratio: '',
  },
  list: [] as TableData[],
})

const {
  params,
  exposes: { reset, initialize },
} = useResetReactive({
  directoryId: 0,
  type: '',
})

const tableData = ref<TableData[]>([])

const ids = computed(() => backups.list.map(v => v.id))

const all = computed(
  () =>
    tableData.value.filter(v => v.checked).map(v => v.id).length ===
    tableData.value.length,
)

const {
  params: materialLibrary,
  exposes: { reset: materialLibraryReset },
} = useResetReactive({
  visible: false,
  title: '',
  params: {},
  data: [],
  tree: {
    request: () => treeApi().then(({ data }) => data),
    update: { visible: false },
    props: {
      value: 'id',
      label: 'folderName',
    },
  },
  items: [
    {
      prop: 'name',
      is: 'currency-input',
      bind: {
        placeholder: '文件名称',
        clearable: true,
      },
    },
    {
      prop: 'type',
      is: 'el-select-v2',
      bind: {
        options: [
          { value: 1, label: '图片' },
          { value: 2, label: '视频' },
        ],
        placeholder: '文件类型',
        clearable: true,
        disabled: () => !isEmpty(backups.params.type),
      },
    },
    {
      prop: 'width',
      is: 'currency-input',
      bind: {
        placeholder: '文件宽度',
        clearable: true,
        disabled: () =>
          !isEmpty(backups.params.width) || !isEmpty(backups.params.ratio),
      },
    },
    {
      prop: 'height',
      is: 'currency-input',
      bind: {
        placeholder: '文件高度',
        clearable: true,
        disabled: () =>
          !isEmpty(backups.params.height) || !isEmpty(backups.params.ratio),
      },
    },
    {
      prop: 'ratio',
      is: 'currency-input',
      bind: {
        placeholder: '文件比例',
        clearable: true,
        disabled: () =>
          !isEmpty(backups.params.ratio) ||
          !isEmpty(backups.params.width) ||
          !isEmpty(backups.params.height),
      },
    },
    {
      is: 'currency-button',
      bind: {
        color: '#6f6f6f',
        title: '清空',
        icon: 'DsrzClear',
      },
      on: { click: reset },
    },
  ],
  btns: [
    {
      display: () => !isEmpty(ids.value) && props.limit > 1,
      is: 'currency-button',
      bind: {
        title: '删除',
        icon: 'DsrzDelete',
        color: '#176ec8',
      },
      on: {
        click: () =>
          useMessageBox(
            '删除',
            `确定要删除此文件吗？`,
            { request: delApi, params: { ids: ids.value } },
            reset,
          ),
      },
    },
    {
      display: () => !all.value && props.limit > 1,
      is: 'currency-button',
      bind: {
        title: '全选',
        icon: 'DsrzSelectAll',
        color: '#176ec8',
      },
      on: {
        click: () =>
          handleCheckboxChange(
            tableData.value.filter((v, i) => props.limit > i),
            true,
          ),
      },
    },
    {
      display: () => all.value && tableData.value.length > 0,
      is: 'currency-button',
      bind: {
        title: '取消全选',
        icon: 'DsrzDeselectAll',
        color: '#176ec8',
      },
      on: {
        click: () => handleCheckboxChange(tableData.value),
      },
    },
    {
      is: 'currency-button',
      bind: {
        type: 'primary',
        title: '上传',
        icon: 'DsrzAdd',
      },
      on: {
        click: () =>
          Object.assign(file, {
            visible: true,
            params: { directoryId: params.directoryId, type: params.type },
          }),
      },
    },
  ],
  request: async <T,>(params: T) => list(params),
})

const {
  params: categorize,
  exposes: { reset: categorizeReset },
} = useResetReactive({
  visible: false,
  title: '',
  params: {},
  items: [
    {
      label: '父级分类',
      prop: 'parentId',
      is: 'currency-tree-select',
      bind: {
        request: () => treeApi().then(({ data }) => data),
        props: { value: 'id', label: 'folderName' },
        placeholder: '请选择父级分类',
        checkStrictly: true,
        clearable: true,
      },
    },
    {
      label: '分类名称',
      prop: 'folderName',
      is: 'el-input',
      bind: {
        placeholder: '请输入分类名称',
        clearable: true,
      },
    },
  ],
  rules: {
    parentId: [
      { required: true, message: '请选择父级分类', trigger: 'change' },
    ],
    folderName: [
      { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
  },
  request: async <T,>(params: T & { id: number }) => {
    await refs.categorizeFormRef.validate()
    await (isEmpty(params.id) ? categorizeAddApi : editApi)(params, {
      loading: { text: `${categorize.title}中...` },
      message: `${categorize.title}成功`,
    })
  },
})

const {
  params: file,
  exposes: { reset: fileReset },
} = useResetReactive({
  visible: false,
  title: '新增上传',
  params: {},
  items: [
    {
      label: '分类',
      prop: 'directoryId',
      is: 'currency-tree-select',
      bind: {
        request: () => treeApi().then(({ data }) => data),
        props: { value: 'id', label: 'folderName' },
        placeholder: '请选择分类',
        checkStrictly: true,
        clearable: true,
      },
    },
    {
      label: '类型',
      prop: 'type',
      is: 'currency-radio',
      bind: {
        options: [
          { label: '图片', value: 1 },
          { label: '视频', value: 2 },
        ],
        disabled: ({ files }: FileParams) =>
          !isEmpty(files) || !isEmpty(backups.params.type),
      },
    },
    {
      display: ({ type }: FileParams) => !isEmpty(type),
      label: '文件',
      prop: 'files',
      is: 'currency-upload',
      bind: {
        multiple: true,
        listType: 'picture-card',
        accept: ({ type }: FileParams) =>
          !isEmpty(props.accept)
            ? props.accept
            : type === 1
              ? 'image/*'
              : 'video/*',
        cropper: () => props.cropper,
        limit:
          props.cropper.cropperWidth || props.cropper.cropperHeight
            ? 1
            : 999999999,
      },
    },
  ],
  rules: {
    directoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    files: [{ required: true, message: '请上传文件', trigger: 'change' }],
  },
  request: async <T,>(params: T) => {
    await refs.fileFormRef.validate()
    await addApi(params, {
      loading: { text: `${file.title}中...` },
      message: `${file.title}成功`,
    })
  },
})

const handleCategorizeUpdate = (
  e: MouseEvent,
  node: TreeNodeData,
  title: string,
) => {
  e.stopPropagation()
  Object.assign(categorize, {
    visible: true,
    title,
    params: Object.assign({ parentId: params.directoryId }, node.data),
  })
}

const handleCategorizeDelete = (e: MouseEvent, node: TreeNodeData) => {
  e.stopPropagation()
  useMessageBox(
    '删除',
    `确定要删除此分类吗？`,
    { request: categorizeDelApi, params: { id: node.data.id } },
    handleCategorizeReset,
  )
}

const handleCategorizeReset = () => {
  categorizeReset()
  const { visible } = materialLibrary.tree.update
  Object.assign(materialLibrary.tree.update, { visible: !visible })
}

const handleUpdateBackups = (data: TableData[], status: boolean = false) => {
  const list = deepClone(backups.list)
  data.forEach(value => {
    const index = list.findIndex(v => v.id === value.id)
    if (list.length === props.limit && index === -1) {
      list.splice(0, 1)
      list.push(value)
    } else if (index === -1) {
      list.push(value)
    } else if (!status) {
      list.splice(index, 1)
    }
  })
  backups.list = list
}

const handleCheckboxChange = (
  value: TableData | TableData[],
  status: boolean = false,
) => {
  handleUpdateBackups(isArray(value) ? value : [value], status)
  tableData.value = tableData.value.map(v => ({
    ...v,
    checked: backups.list.some(value => value.id === v.id),
  }))
}

const handleRadioChange = ({ id }: TableData) => {
  tableData.value = tableData.value.map(v => ({
    ...v,
    checked: v.id === id,
  }))
  backups.list = tableData.value.filter(v => v.checked)
}

const handleFileReset = () => {
  fileReset()
  reset()
}

const emit = defineEmits(['confirm'])

const handleConfirm = () => {
  materialLibraryReset()
  emit('confirm', backups.list)
}

const open = <T,>(value: T) => {
  Object.assign(materialLibrary, { visible: true })
  Object.assign(params, value)
  Object.assign(backups, { params: value, list: [] })
  initialize(value, ['type', 'width', 'height', 'ratio'])
}

watch(
  () => tableData.value,
  (n, o) => {
    if (JSON.stringify(n) === JSON.stringify(o)) return
    tableData.value = tableData.value.map(v => ({
      ...v,
      checked: backups.list.some(value => value.id === v.id),
    }))
  },
)

defineExpose({ open })
</script>

<template>
  <component
    v-if="materialLibrary.visible || mode === 'default'"
    :is="
      mode === 'default'
        ? h('div', { class: 'dsrz-material-library' })
        : h(CurrencyDialog, {
            modelValue: materialLibrary.visible,
            title: '素材库',
            size: 'large',
            onConfirm: handleConfirm,
            onCancel: materialLibraryReset,
          })
    "
  >
    <div :class="`dsrz-material-library-${mode}`">
      <div class="dsrz-material-library-categorize">
        <CurrencyButton
          class="dsrz-material-library-categorize-btn"
          title="新增分类"
          type="primary"
          icon="DsrzAdd"
          @click="
            (e: any) => handleCategorizeUpdate(e, { data: {} }, '新增分类')
          "
        />
        <CurrencyTree
          v-model="params.directoryId"
          :request="materialLibrary.tree.request"
          :update="Object.assign({}, materialLibrary.tree.update)"
          :props="materialLibrary.tree.props"
          :height="580"
          :item-size="32"
        >
          <template #default="{ node }">
            <el-text style="width: 50%" truncated>{{ node.label }}</el-text>
            <div v-if="node.key" class="dsrz-material-library-categorize-btns">
              <CurrencyButton
                type="primary"
                :link="true"
                title="修改"
                @click="(e: any) => handleCategorizeUpdate(e, node, '修改分类')"
              />
              <CurrencyButton
                type="primary"
                :link="true"
                title="删除"
                @click="(e: any) => handleCategorizeDelete(e, node)"
              />
            </div>
          </template>
        </CurrencyTree>
      </div>
      <div class="dsrz-material-library-file">
        <CurrencyTable
          :params="params"
          v-model="tableData"
          :request="materialLibrary.request"
          :items="materialLibrary.items"
          :btns="materialLibrary.btns"
          :bottomHeight="mode === 'default' ? 40 : 133"
        >
          <template #table="{ data, height }">
            <el-scrollbar :height="height">
              <el-empty v-if="data.length === 0" />
              <div
                v-else
                class="dsrz-material-library-file-table"
                :style="`height: ${height}px`"
              >
                <div
                  v-for="(v, i) in data"
                  :key="i"
                  class="dsrz-material-library-file-table-column"
                >
                  <el-image
                    v-if="v.type === '1'"
                    :src="v.url"
                    :preview-src-list="[v.url]"
                    fit="contain"
                  />
                  <template v-else-if="v.type === '2'">
                    <video :src="v.url" fit="contain" />
                    <div
                      class="dsrz-material-library-file-table-column-video"
                      @click="v.showViewer = true"
                    >
                      <div>
                        {{
                          new Date(v.duration * 1000)
                            .toISOString()
                            .slice(11, 19)
                        }}
                      </div>
                    </div>
                    <CurrencyImageViewer
                      v-if="v.showViewer"
                      teleported
                      :url-list="[
                        {
                          uid: i,
                          url: v.url,
                          type: v.type === '1' ? 'image' : 'video',
                        },
                      ]"
                      :initial-index="0"
                      @close="v.showViewer = false"
                    />
                  </template>
                  <div class="dsrz-material-library-file-table-column-title">
                    <el-text truncated>
                      {{ v.name }}
                    </el-text>
                  </div>
                  <div
                    class="flex jcsb dsrz-material-library-file-table-column-title"
                  >
                    <el-text type="primary">
                      {{ v.width }}*{{ v.height }}
                    </el-text>
                    <el-checkbox
                      v-if="limit > 1"
                      v-model="v.checked"
                      @change="handleCheckboxChange(v)"
                    />
                    <el-radio
                      v-else
                      v-model="v.checked"
                      :value="true"
                      @change="handleRadioChange(v)"
                    />
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </template>
        </CurrencyTable>
      </div>
    </div>
  </component>
  <CurrencyDialog
    v-model="categorize.visible"
    :title="categorize.title"
    :params="categorize.params"
    :request="categorize.request"
    @cancel="categorizeReset"
    @confirm="handleCategorizeReset"
  >
    <CurrencyForm
      formRef="categorizeFormRef"
      v-model="categorize.params"
      :items="categorize.items"
      :rules="categorize.rules"
      label-position="top"
    />
  </CurrencyDialog>
  <CurrencyDialog
    v-model="file.visible"
    :title="file.title"
    :params="file.params"
    :request="file.request"
    @cancel="fileReset"
    @confirm="handleFileReset"
  >
    <CurrencyForm
      formRef="fileFormRef"
      v-model="file.params"
      :items="file.items"
      :rules="file.rules"
      label-position="top"
    />
  </CurrencyDialog>
</template>
<style lang="scss" scoped></style>
