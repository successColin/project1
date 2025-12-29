import { createApp, h, ref, watch } from 'vue'
import type { AxiosRequestConfig } from 'axios'

import CurrencyDialog from 'dsrz/components/dialog/index.vue'
import CurrencyButton from 'dsrz/components/button/index.vue'
import DsrzClose from 'dsrz/svg/dsrz-close.vue'
import type { ApiResponseData } from '@/request/components'

interface Bind<T> {
  /** 请求参数对象 */
  params?: T
  /** 异步请求函数 */
  request?: <R>(
    params?: T,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponseData<R>>
  /** 取消按钮文字（默认："取消"） */
  cancelTitle?: string
  /** 确认按钮文字（默认："确定"） */
  confirmTitle?: string
  /** 请求loading提示文字（默认：""） */
  requestTitle?: string
  /** 是否显示取消按钮（默认：true） */
  cancelDisplay?: boolean | ((value: NonNullable<T>) => boolean)
  /** 是否显示确认按钮（默认：true） */
  confirmDisplay?: boolean | ((value: NonNullable<T>) => boolean)
}

/**
 * 提示弹出窗
 * @param title 标题
 * @param content 提示内容
 * @param bind 弹出窗配置参数
 * @param confim 成功回调
 * @param cancel 失败回调
 * @returns
 */
export const useMessageBox = <T extends object>(
  title: string,
  content: string,
  bind?: Bind<T>,
  confim?: () => void,
  cancel?: () => void,
) => {
  return new Promise(() => {
    const app = createApp({
      setup() {
        const visible = ref(true)

        const {
          params = {},
          request,
          cancelTitle = '取消',
          confirmTitle = '确定',
          requestTitle = '',
          cancelDisplay = true,
          confirmDisplay = true,
        } = bind || {}

        watch(visible, (newVisible: boolean) => {
          if (!newVisible) {
            app.unmount()
            document.body.removeChild(div)
          }
        })

        return () =>
          h(CurrencyDialog, {
            modelValue: visible.value,
            title: requestTitle ? title || '提示' : '提示',
            content,
            cancel: { display: cancelDisplay, bind: { title: cancelTitle } },
            confirm: { display: confirmDisplay, bind: { title: confirmTitle } },
            params,
            request: (params?: T) =>
              request?.(params, {
                loading: { text: `${requestTitle || title}中...` },
                message: `${requestTitle || title}成功`,
              }),
            size: 'small',
            onCancel: () => {
              visible.value = false
              cancel?.()
            },
            onConfirm: () => {
              visible.value = false
              confim?.()
            },
          })
      },
    })
    const div = document.createElement('div')
    document.body.appendChild(div)
    app.component('CurrencyButton', CurrencyButton)
    app.component('DsrzClose', DsrzClose)
    app.mount(div)
  })
}
