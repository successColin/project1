import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import {
  cookiesStorage,
  isObject,
  isString,
  paramsToLink,
  signEncrypt,
} from 'dsrz/utils'

import { useAppStoreHook } from '@/stores/modules/app'
import initialize from '@/request/components'

const createService = () => {
  const service = axios.create()

  service.interceptors.request.use(
    config => config,
    error => Promise.reject(error),
  )

  service.interceptors.response.use(
    response => {
      const {
        config: { props, code },
      } = response
      const data = getBlobData(
        Object.assign(response.data, {
          traceId: response.headers['x-trace-id'],
        }),
        response.status,
        props,
      )
      switch (data[props?.code || 'code']) {
        case code:
          setMessage(
            response.config,
            'success',
            data[props?.message || 'message'],
          )
          return data
        default:
          setMessage(
            response.config,
            'error',
            data[props?.message || 'message'],
          )
          return Promise.reject(new Error(data[props?.message || 'message']))
      }
    },
    error => {
      setMessage(error.config, 'error', error.message)
      return Promise.reject(error)
    },
  )

  return service
}

const method = ['get', 'delete', 'GET', 'DELETE']

const createRequest = (service: AxiosInstance) => {
  return <T>(config: AxiosRequestConfig): Promise<T> => {
    const token = cookiesStorage.getItem('token')
    const defaultConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      baseURL: import.meta.env.VITE_BASE_API || import.meta.env.VITE_BASE_URL,
      timeout: 50000,
      loading: getLoading(config.loading),
    }
    delete config.loading
    config.headers = Object.assign(
      defaultConfig.headers,
      config.headers,
      config.isEncrypt ? signEncrypt(config) : {},
    )
    if (config.isEncrypt) {
      if (method.includes(config.method!)) {
        config.url = `${config.url}${paramsToLink(config.params, true)}`
      }
      config.params = {}
    }
    return service(Object.assign(defaultConfig, config))
  }
}

const getLoading = (loading: AxiosRequestConfig['loading']) => {
  if (loading) {
    return {
      service: ElLoading.service({
        lock: true,
        text: loading.text || '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      }),
    }
  }
  return undefined
}

const getBlobData = <T>(
  data: T,
  status: number,
  props: AxiosRequestConfig['props'],
) => {
  if (data instanceof Blob) {
    return {
      [props?.code || 'code']: data.type === 'application/json' ? -200 : status,
      [props?.message || 'message']:
        data.type === 'application/json' ? '导出失败' : '导出成功',
      data,
    }
  }
  return data
}

type messageTypes = 'success' | 'error' | 'info' | 'warning'

const setMessage = (
  config: AxiosRequestConfig,
  type: messageTypes,
  message?: string,
) => {
  if (config.loading) {
    config.loading.service.close()
  }
  if (isObject(config.message) && type === 'error') {
    ElMessage(config.message)
  } else if (config.message || type === 'error') {
    ElMessage({
      message:
        isString(config.message) && type !== 'error' ? config.message : message,
      type,
    })
  }
}

export default initialize(
  createRequest(createService()),
  useAppStoreHook().globalConfig.config,
)
