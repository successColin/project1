// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    loading?: {
      service?: typeof ElLoading.service
      text?: string
    }
    props?: {
      code?: string
      message?: string
    }
    message?:
      | string
      | boolean
      | { type: 'success' | 'error' | 'info' | 'warning'; message: string }
    code?: number
    mark?: string
    isEncrypt?: boolean
  }
  interface AxiosResponse {
    traceId?: string
  }
}
