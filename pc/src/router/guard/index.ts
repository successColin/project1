import router from '@/router'
import usePermissionStore from '@/stores/modules/permission'
import useUserStore from '@/stores/modules/user'
import { setRouteChange } from 'dsrz/hooks/useRouteListener'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = [
  '/login',
  '/dashboard',
  '/demo/button',
  '/demo/captcha',
  '/demo/card',
  '/demo/cascader',
  '/demo/checkbox',
  '/demo/details',
  '/demo/dialog',
  '/demo/form',
  '/demo/icon',
  '/demo/image-cropper',
  '/demo/input',
  '/demo/input-number',
  '/demo/map',
  '/demo/material-library',
  '/demo/more',
  '/demo/radio',
  '/demo/rich-text',
  '/demo/select',
  '/demo/switch',
  '/demo/table',
  '/demo/tabs',
  '/demo/tag',
  '/demo/text',
  '/demo/tree',
  '/demo/tree-select',
  '/demo/upload',
]

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const { getUser, setToken, getToken, resetToken } = useUserStore()
  if (to.query.sso_token) {
    setToken(to.query.sso_token as string)
    delete to.query.sso_token
  }
  const token = getToken()
  if (!token) {
    if (whiteList.indexOf(to.path) !== -1) {
      return next()
    }
    resetToken()
    NProgress.done()
    return
  }

  const { routes, getPermission, getAllRoutes } = usePermissionStore()
  if (routes.length) return next()
  if (Object.keys(getUser()).length !== 0)
    return to.path !== '/dashboard' ? next('/dashboard') : next()
  try {
    await getPermission()
    getAllRoutes().forEach(v => router.addRoute(v))
    next({ ...to, replace: true })
  } catch {
    resetToken()
    NProgress.done()
  }
})

router.afterEach(to => {
  setRouteChange(to)
  NProgress.done()
})
