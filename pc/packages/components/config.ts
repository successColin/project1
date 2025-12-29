import type {
  UploadFile,
  UploadFiles,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
} from 'element-plus'
import { ajaxUpload } from 'element-plus/es/components/upload/src/ajax.mjs'

export const GlobalConfig = {
  elCaptcha: {
    get: (params: { captchaType: 'blockPuzzle' }) =>
      new Promise<{
        data: {
          jigsawImageBase64: string
          originalImageBase64: string
          secretKey: string
          token: string
        }
      }>(resolve => {
        console.log(params)
        resolve({
          data: {
            jigsawImageBase64: '',
            originalImageBase64: '',
            secretKey: '',
            token: '',
          },
        })
      }),
    check: (params: {
      captchaType: 'blockPuzzle'
      pointJson: string
      token: string
    }) =>
      new Promise(resolve => {
        console.log(params)
        resolve({})
      }),
  },
  elUpload: {
    pictureCardIcon: 'Plus',
    percentage: false,
    updateData: <T>(value: T) => value as UploadUserFile[],
    beforeUpload: (rawFile: UploadRawFile) => rawFile,
    httpRequest: (options: UploadRequestOptions) => ajaxUpload(options),
    onSuccess: async (uploadFiles: UploadFiles) => uploadFiles,
    onRemove: (uploadFile: UploadFile) => uploadFile,
  },
  elRichText: {
    httpRequest: (
      file: File,
      insertFn: (url: string, alt?: string, href?: string) => void,
    ) => {
      console.log(file, insertFn)
    },
  },
  elTable: {
    search: 'default',
    table: { list: 'list', total: 'total' },
    pagination: { currentPage: 'currentPage', pageSize: 'pageSize' },
    update: (value?: boolean) => value || false,
  },
  elInput: { suffixIcon: '' },
  elDialog: {
    closeIcon: '',
    closeOnClickModal: true,
    closeOnPressEscape: true,
  },
  elPermission: ['admin'] as string[] | (() => string[]),
}

export type GlobalConfigProps = typeof GlobalConfig
