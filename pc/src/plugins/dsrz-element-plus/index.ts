import { type App } from 'vue'
import DsrzElementPlus from 'dsrz/components'
import type {
  UploadFile,
  UploadFiles,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
} from 'element-plus'
import { ajaxUpload } from 'element-plus/es/components/upload/src/ajax.mjs'
import { isArray, isString } from 'dsrz/utils'

import api from '@/request'
import { findTreeByKey } from 'dsrz/utils'

const { get: getApi, check: checkApi } = findTreeByKey(api, 'captcha')

export const loadDsrzElementPlus = (app: App) => {
  /** Dsrz Element Plus 组件完整引入 */
  app.use(DsrzElementPlus, {
    elCaptcha: {
      get: params => getApi(params),
      check: params => checkApi(params),
    },
    elUpload: {
      pictureCardIcon: 'DsrzUpload',
      percentage: false,
      updateData: <T>(value: T) => {
        console.log(value)
        if (isArray(value)) {
          return value.map(v => {
            if (isString(v)) {
              return {
                name: v.split('/').pop(),
                url: v,
              }
            }
            return v
          }) as UploadUserFile[]
        }
        return value as UploadUserFile[]
      },
      beforeUpload: (rawFile: UploadRawFile) => rawFile,
      httpRequest: (options: UploadRequestOptions) => ajaxUpload(options),
      onSuccess: async (uploadFiles: UploadFiles) => uploadFiles,
      onRemove: (uploadFile: UploadFile) => uploadFile,
    },
    elInput: { suffixIcon: 'DsrzSearch' },
    elDialog: {
      closeIcon: 'DsrzClose',
      closeOnClickModal: true,
      closeOnPressEscape: true,
    },
  })
}
