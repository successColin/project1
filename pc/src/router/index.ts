import Layout from '@/layout/index.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const allRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      id: 1,
      title: '首页',
      breadcrumb: false,
    },
    children: [
      {
        path: 'dashboard',
        name: 'DashboardPage',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          id: 101,
          title: '首页',
          icon: 'DsrzHome',
        },
      },
    ],
  },
  {
    path: '/demo',
    component: Layout,
    meta: {
      id: 2,
      title: 'Currency案例',
      icon: 'DsrzHome',
    },
    children: [
      {
        path: 'button',
        name: 'CurrencyButtonPage',
        component: () => import('@/views/demo/button/index.vue'),
        meta: {
          id: 201,
          title: '按钮',
        },
      },
      {
        path: 'captcha',
        name: 'CurrencyCaptchaPage',
        component: () => import('@/views/demo/captcha/index.vue'),
        meta: {
          id: 202,
          title: '图形验证',
        },
      },
      {
        path: 'card',
        name: 'CurrencyCardPage',
        component: () => import('@/views/demo/card/index.vue'),
        meta: {
          id: 203,
          title: '卡片',
        },
      },
      {
        path: 'cascader',
        name: 'CurrencyCascaderPage',
        component: () => import('@/views/demo/cascader/index.vue'),
        meta: {
          id: 204,
          title: '级联选择器',
        },
      },
      {
        path: 'checkbox',
        name: 'CurrencyCheckboxPage',
        component: () => import('@/views/demo/checkbox/index.vue'),
        meta: {
          id: 205,
          title: '多选框',
        },
      },
      {
        path: 'details',
        name: 'CurrencyDetailsPage',
        component: () => import('@/views/demo/details/index.vue'),
        meta: {
          id: 206,
          title: '详情',
        },
      },
      {
        path: 'dialog',
        name: 'CurrencyDialogPage',
        component: () => import('@/views/demo/dialog/index.vue'),
        meta: {
          id: 207,
          title: '对话框',
        },
      },
      {
        path: 'form',
        name: 'CurrencyFormPage',
        component: () => import('@/views/demo/form/index.vue'),
        meta: {
          id: 208,
          title: '表单',
        },
      },
      {
        path: 'icon',
        name: 'CurrencyIconPage',
        component: () => import('@/views/demo/icon/index.vue'),
        meta: {
          id: 209,
          title: '图标',
        },
      },
      {
        path: 'image-cropper',
        name: 'CurrencyImageCropperPage',
        component: () => import('@/views/demo/imageCropper/index.vue'),
        meta: {
          id: 210,
          title: '图片裁剪',
        },
      },
      {
        path: 'input',
        name: 'CurrencyInputPage',
        component: () => import('@/views/demo/input/index.vue'),
        meta: {
          id: 211,
          title: '输入框',
        },
      },
      {
        path: 'input-number',
        name: 'CurrencyInputNumberPage',
        component: () => import('@/views/demo/inputNumber/index.vue'),
        meta: {
          id: 212,
          title: '数字输入框',
        },
      },
      {
        path: 'map',
        name: 'CurrencyMapPage',
        component: () => import('@/views/demo/map/index.vue'),
        meta: {
          id: 213,
          title: '地图',
        },
      },
      {
        path: 'material-library',
        name: 'CurrencyMaterialLibraryPage',
        component: () => import('@/views/demo/materialLibrary/index.vue'),
        meta: {
          id: 214,
          title: '素材库',
        },
      },
      {
        path: 'more',
        name: 'CurrencyMorePage',
        component: () => import('@/views/demo/more/index.vue'),
        meta: {
          id: 215,
          title: '更多',
        },
      },
      {
        path: 'radio',
        name: 'CurrencyRadioPage',
        component: () => import('@/views/demo/radio/index.vue'),
        meta: {
          id: 216,
          title: '单选框',
        },
      },
      {
        path: 'rich-text',
        name: 'CurrencyRichTextPage',
        component: () => import('@/views/demo/richText/index.vue'),
        meta: {
          id: 217,
          title: '富文本',
        },
      },
      {
        path: 'select',
        name: 'CurrencySelectPage',
        component: () => import('@/views/demo/select/index.vue'),
        meta: {
          id: 218,
          title: '选择器',
        },
      },
      {
        path: 'switch',
        name: 'CurrencySwitchPage',
        component: () => import('@/views/demo/switch/index.vue'),
        meta: {
          id: 219,
          title: '开关',
        },
      },
      {
        path: 'table',
        name: 'CurrencyTablePage',
        component: () => import('@/views/demo/table/index.vue'),
        meta: {
          id: 220,
          title: '表格',
        },
      },
      {
        path: 'tabs',
        name: 'CurrencyTabsPage',
        component: () => import('@/views/demo/tabs/index.vue'),
        meta: {
          id: 221,
          title: '标签页',
        },
      },
      {
        path: 'tag',
        name: 'CurrencyTagPage',
        component: () => import('@/views/demo/tag/index.vue'),
        meta: {
          id: 222,
          title: '标签',
        },
      },
      {
        path: 'text',
        name: 'CurrencyTextPage',
        component: () => import('@/views/demo/text/index.vue'),
        meta: {
          id: 223,
          title: '文本',
        },
      },
      {
        path: 'tree',
        name: 'CurrencyTreePage',
        component: () => import('@/views/demo/tree/index.vue'),
        meta: {
          id: 224,
          title: '树形控件',
        },
      },
      {
        path: 'tree-select',
        name: 'CurrencyTreeSelectage',
        component: () => import('@/views/demo/treeSelect/index.vue'),
        meta: {
          id: 225,
          title: '树形选择框',
        },
      },
      {
        path: 'upload',
        name: 'CurrencyUploadPage',
        component: () => import('@/views/demo/upload/index.vue'),
        meta: {
          id: 226,
          title: '上传',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
})

export default router
