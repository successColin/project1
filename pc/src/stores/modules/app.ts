import { defineStore } from 'pinia'
import { reactive } from 'vue'

import store from '@/stores'

import LoginAccount from '@/assets/images/login-account.png'
import LoginQRCode from '@/assets/images/login-qr-code.png'

interface GlobalConfig {
  title: string
  collapse: boolean
  nameCollapse: boolean
  cachedViews: string[]
  updateTable: boolean
  watermark: {
    zIndex: number
    content: string
    font: {
      color: string
    }
  }
  login: {
    title: string
    templateList: { type: string; url: string; association: string[] }[]
  }
  auth: {
    username: string
    password: string
  }
  config: {
    [key in string]: {
      mark: string
      isEncrypt?: boolean
      code: number
      props: { code: string; message: string }
    }
  }
}

const useAppStore = defineStore('app', () => {
  const globalConfig = reactive<GlobalConfig>({
    title: '',
    collapse: false,
    nameCollapse: false,
    cachedViews: ['Dashboard'],
    updateTable: false,
    watermark: {
      zIndex: 99999,
      content: '',
      font: { color: 'rgba(0, 0, 0, 0.05)' },
    },
    login: {
      title: '平台管理',
      templateList: [
        {
          type: 'code-login',
          url: LoginQRCode,
          association: ['qr-code-login', 'password-login'],
        },
        {
          type: 'password-login',
          url: LoginQRCode,
          association: ['qr-code-login', 'code-login'],
        },
        {
          type: 'qr-code-login',
          url: LoginAccount,
          association: ['code-login'],
        },
      ],
    },
    auth: {
      username: '4s',
      password: '4syba188',
    },
    config: {
      mb: {
        mark: 'mb',
        isEncrypt: true,
        code: 200,
        props: { code: 'code', message: 'msg' },
      },
    },
  })

  const setCollapse = (collapse: boolean) => {
    globalConfig.collapse = collapse
  }

  const setNameCollapse = (nameCollapse: boolean) => {
    console.log(nameCollapse)
    globalConfig.nameCollapse = false
  }

  const setCachedViews = (cachedViews: string[]) => {
    globalConfig.cachedViews = cachedViews
  }

  const setUpdateTable = (updateTable: boolean) => {
    globalConfig.updateTable = updateTable
  }

  const setWatermarkContent = (content: string) => {
    globalConfig.watermark.content = content
  }

  return {
    globalConfig,
    setCollapse,
    setNameCollapse,
    setCachedViews,
    setUpdateTable,
    setWatermarkContent,
  }
})

/** 在 setup 外使用 */
export function useAppStoreHook() {
  return useAppStore(store)
}

export default useAppStore
