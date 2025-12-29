import { md5 } from 'js-md5'
import { isObject, isArray, isEmpty, isBoolean } from 'dsrz/utils'
import type { AxiosRequestConfig } from 'axios'

const AK = import.meta.env.VITE_SIGN_AK

const SK = import.meta.env.VITE_SIGN_SK

export const signEncrypt = (config: AxiosRequestConfig) => {
  const timestamp = new Date().getTime()
  return {
    sign: md5(
      `${AK}${config.url}${timestamp}${paramsToLink(config.params)}${SK}`,
    ),
    timestamp,
    appkey: AK,
  }
}

export const paramsToLink = (
  params: AxiosRequestConfig['params'],
  isLocation = false,
) => {
  if (isEmpty(params)) return ''
  const obj = Object.fromEntries(
    Object.entries(params)
      .sort()
      .map(([key, value]) => {
        if (
          !(isArray(value) || isObject(value)) &&
          !(isEmpty(value) && !isBoolean(value))
        ) {
          return [key, isLocation ? encodeURIComponent(value as string) : value]
        }
      })
      .filter(v => v !== undefined),
  )
  return `${isLocation ? '?' : ''}${Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')}`
}
