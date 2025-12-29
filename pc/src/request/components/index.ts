import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { deepClone, isObject } from 'dsrz/utils'

interface Config {
  url: string
  method: string
  config: AxiosRequestConfig
}

type Request<T> = {
  [key: string]: Request<T> | T
}

interface GlobProps {
  default: Request<Config>
}

const components = import.meta.glob<GlobProps>('./**/*.ts', { eager: true })

interface GlobConfigProps {
  mark: string
}

interface GlobKeyConfigProps {
  [key: string]: GlobConfigProps
}

type Service = <T>(config: AxiosRequestConfig) => Promise<T>

interface Params {
  joinUrl?: string
}

const method = ['post', 'put', 'delete', 'POST', 'PUT', 'DELETE']

const serviceRequest = <T extends Params>(
  service: Service,
  config: AxiosRequestConfig,
  params?: T,
) => {
  if (params?.joinUrl && config.url) {
    config.url = `${config.url}${params.joinUrl}`
    delete params.joinUrl
  }
  if (method.includes(config.method!)) {
    config.data = params
  } else {
    config.params = params
  }
  const { VITE_BASE_SERVICE, VITE_BASE_MARK } = import.meta.env
  if (VITE_BASE_SERVICE && config.mark === VITE_BASE_MARK) {
    config.url = `${VITE_BASE_SERVICE}${config.url}`
  }
  if (config.isEncrypt) {
    config.params = params
  }
  return service(config)
}

type ServiceRequest = <T, R>(
  params?: T,
  config?: AxiosRequestConfig,
) => Promise<R>

const createRequest = (
  service: Service,
  value: Request<Config> | Config,
  c: GlobConfigProps,
  key: string,
) => {
  const result: Record<string, ServiceRequest> = {}
  Object.entries(value).forEach(([k, v]) => {
    if (v.url) {
      Object.assign(result, {
        [k]: <T extends Params>(
          params?: T,
          config?: InternalAxiosRequestConfig,
        ) =>
          serviceRequest(
            service,
            Object.assign(deepClone(v), c, config),
            params,
          ),
      })
    } else {
      Object.assign(result, { [k]: createRequest(service, v, c, k)[k] })
    }
  })
  return Object.fromEntries([[key, result]])
}

const stringToTree = <T>(
  service: Service,
  config: GlobKeyConfigProps,
  list: string[],
  module: Request<Config>,
  mark: string,
) => {
  const obj: Record<string, T> = {}
  if (list.length === 1) {
    return createRequest(service, module, config[mark], list[0])
  } else {
    const i = list[0]
    obj[i] = stringToTree(service, config, list.slice(1), module, mark) as T
  }
  return obj
}

export interface ApiResponseData<T> extends Record<string, unknown> {
  code: number
  data: T
  total: number
  msg: string
}

export interface Initialize<T> {
  [key: string]: Initialize<T>
  <R>(
    params?: AxiosRequestConfig['params'],
    config?: AxiosRequestConfig,
  ): Promise<ApiResponseData<R>>
}

const mergeTrees = (
  a: Initialize<ServiceRequest>,
  b: Initialize<ServiceRequest>,
) => {
  const obj = b
  for (const k in b) {
    if (a && isObject(a[k]) && isObject(b[k])) {
      Object.assign(obj, {
        [k]: mergeTrees(a[k], b[k]),
      })
      delete a[k]
    } else {
      Object.assign(obj, a, b)
    }
  }
  return Object.assign(obj, a)
}

const initialize = (service: Service, config: GlobKeyConfigProps) => {
  const value: Initialize<ServiceRequest> = Object.assign({})
  Object.entries(components).map(async ([key, module]) => {
    const keys = key.replace('.ts', '').replace('./', '').split('/')
    value[keys[0]] = mergeTrees(
      value[keys[0]],
      stringToTree(
        service,
        config,
        keys.slice(1),
        module.default,
        keys[0],
      ) as Initialize<ServiceRequest>,
    )
  })
  return value
}

export default initialize
