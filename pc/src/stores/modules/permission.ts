import { markRaw, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

import { findTreeByKey } from 'dsrz/utils'

import Layout from '@/layout/index.vue'
import api from '@/request'

import useUserStore from './user'

const { permission, role } = findTreeByKey(api, 'login')

const usePermissionStore = defineStore(
  'permission',
  (): {
    routes: Ref<RouteRecordRaw[]>
    getPermission: () => Promise<void>
    getAllRoutes: () => RouteRecordRaw[]
    setRoutes: (routes: RouteRecordRaw[]) => void
  } => {
    const routes = ref<RouteRecordRaw[]>([])

    const getPermission = async () => {
      const {
        data: { user, permissions },
      } = await permission()
      const { data } = await role()
      const { setUser } = useUserStore()
      setUser(Object.assign(user, { userRole: data }))
      routes.value = filterAsyncRoutes(permissions)
    }

    const getAllRoutes = () => routes.value

    const setRoutes = (value: RouteRecordRaw[]) => (routes.value = value)

    return { routes, getPermission, getAllRoutes, setRoutes }
  },
)

const pages = import.meta.glob('@/views/**/*.vue')

const filterAsyncRoutes = (
  routes: RouteRecordRaw[],
  badges: Record<string, number> = {},
) => {
  const res: RouteRecordRaw[] = []
  routes.forEach(v => {
    const route = convertRoute(v)
    if (badges[String(route.name)]) {
      route.meta.badge = badges[String(route.name)]
    }
    if (v.component) {
      if (['Layout', 'FullScreen'].includes(String(v.component))) {
        route.component = markRaw(Layout)
      } else {
        try {
          route.component = markRaw(pages[`/src/views/${route.component}.vue`])
        } catch {
          route.component = markRaw(pages[`/src/views/404/index.vue`])
        }
      }
    }
    if (v.children) {
      route.children = filterAsyncRoutes(v.children, badges)
    }
    res.push(route)
  })
  return res
}

interface NewRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  id?: number
  title?: string
  icon?: string
  alwaysShow?: string
  hidden?: string
  see?: number
  meta?: {
    id?: number
    title?: string
    icon?: string
    hidden?: boolean
    alwaysShow?: boolean
    breadcrumb?: boolean
    badge?: number
  }
  children?: RouteRecordRaw[]
}

const convertRoute = (v: NewRouteRecordRaw) => {
  return {
    path: v.path,
    name: v.name,
    component: v.component,
    meta: {
      id: v.id,
      title: v.title,
      icon: v.icon,
      hidden: v.hidden === '0',
      alwaysShow: v.alwaysShow === '1',
      breadcrumb: v.see === 1,
      badge: 0,
    },
    children: [] as RouteRecordRaw[],
  }
}

export default usePermissionStore
