import { set, get, unset } from 'lodash'
import type { FormInstance } from 'element-plus'

import { type ItemsProps } from 'dsrz/components/form/types'

import { aesDecrypt, aesEncrypt } from './aes'
import { isArray, isEmpty, isFunction, isString } from './judge'
import { deepClone } from './clone'

const components = ['currency-form']

/**
 * 获取表单加密数据且格式数据
 * @param list
 * @param value
 * @returns
 */
export const getFormEncrypt = <T>(list: ItemsProps<T>[], value: T) => {
  const obj = Object.assign({})
  let copyValue = deepClone(value)
  list.forEach(v => {
    /** 列表处理 */
    if (v.list) {
      copyValue = getFormEncrypt(v.list, copyValue)
    }
    const modelValue = get(copyValue, v.prop)
    if (!isEmpty(modelValue)) {
      /** 数组处理 */
      if (v.queryValue) {
        v.queryValue.forEach((key, index) => {
          set(
            obj,
            key,
            isArray(v.joinValue)
              ? `${modelValue[index]} ${v.joinValue[index]}`
              : modelValue[index],
          )
        })
      } else {
        try {
          set(obj, v.prop, v.isEncrypt ? aesEncrypt(modelValue) : modelValue)
        } catch {
          set(obj, v.prop, modelValue)
        }
      }
      unset(copyValue, v.prop)
    }
    if (isFunction(v.convert)) {
      set(obj, v.prop, v.convert(modelValue))
    }
  })
  return deepClone(Object.assign({}, copyValue, obj))
}

/**
 * 获取表单解密数据且格式数据
 * @param list
 * @param value
 * @returns
 */
export const getFormDecrypt = <T>(list: ItemsProps<T>[], value: T) => {
  const obj = Object.assign({})
  let copyValue = deepClone(value)
  list.forEach(v => {
    /** 列表处理 */
    if (v.list) {
      copyValue = getFormDecrypt(v.list, copyValue)
    }
    let modelValue = get(copyValue, v.prop)
    const items = (v.bind as { items: ItemsProps<T>[] })?.items
    if (!isEmpty(items)) {
      if (!isEmpty(modelValue)) {
        copyValue[v.prop as keyof T] = getFormDecrypt(items, modelValue)
      } else if (isString(v.is) && components.includes(v.is)) {
        copyValue = getFormDecrypt(items, copyValue)
      }
    }

    /** 区间处理 */
    if (v.prop && v.queryValue) {
      set(
        obj,
        v.prop,
        v.queryValue.map(key => get(copyValue, key)).filter(Boolean),
      )
    }
    modelValue = get(copyValue, v.prop)
    if (!isEmpty(modelValue)) {
      try {
        set(obj, v.prop, v.isDecrypt ? aesDecrypt(modelValue) : modelValue)
      } catch {
        set(obj, v.prop, modelValue)
      }
    }
    if (isFunction(v.convert)) {
      set(obj, v.prop, v.convert(modelValue))
    }
  })
  return deepClone(Object.assign({}, copyValue, obj))
}

/**
 * 验证表单并跳转到第一个错误字段
 * @param formRef 表单引用
 * @returns 验证结果
 */
export const validateForm = async (formRef?: FormInstance) => {
  if (isEmpty(formRef)) return Promise.reject('表单引用为空')
  try {
    await formRef!.validate()
    return Promise.resolve(true)
  } catch (error) {
    scrollToFirstError(error)
    return Promise.reject(error)
  }
}

/**
 * 跳转到第一个错误字段
 * @param formRef 表单引用
 * @param error 验证错误对象
 */
export const scrollToFirstError = <T>(error: T) => {
  if (typeof error !== 'object' || error === null) return

  const firstErrorField = document.querySelector('.el-form-item.is-error')
  if (!firstErrorField) return
  firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
