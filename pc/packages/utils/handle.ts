import { isEmpty, isFunction, isObject, isString } from './judge'
import type { ListProps } from 'dsrz/components/component/types'
import type { ItemsProps } from 'dsrz/components/form/types'
import { toHandlerName } from './convert'

export const handleList = <T>(list: ListProps<T>[] = [], value: T) =>
  list.map(v =>
    Object.assign({}, v, {
      bind: handleBind(v.bind, value, v),
      on: handleOn(v),
    }),
  )

const exclude = [
  'ref',
  'request',
  'remoteQequest',
  'beforeChange',
  'onUploadSuccess',
]

const components = ['currency-form']

export const handleBind = <B, V>(bind: B, value: V, model: ItemsProps<V>) => {
  const object = Object.assign({})
  if (isObject(bind)) {
    Object.entries(bind).forEach(([key, v]) => {
      if (isFunction(v) && !exclude.includes(key)) {
        object[key] = v(value)
      } else {
        object[key] = v
      }
    })
  }
  if (!isEmpty(model.prop)) {
    try {
      const fn = new Function('o', `return o.${String(model.prop)}`)
      object.modelValue = fn(value)
      const fu = new Function(`o`, 'v', `o.${String(model.prop)} = v`)
      object['onUpdate:modelValue'] = <T>(e: T) => fu(value, e)
    } catch {
      console.log(`(${model.label}-${String(model.prop)})数据绑定失败`)
    }
  } else if (isString(model.is) && components.includes(model.is)) {
    object.modelValue = value
    object['onUpdate:modelValue'] = <T extends V>(e: T) => (value = e)
  }
  object.backups = value
  return object
}

export const handleOn = <T>(value: ListProps<T>, status?: boolean) => {
  if (status)
    return Object.entries(value.on || {}).reduce((acc, [key, handler]) => {
      const normalizedKey = key.startsWith('on') ? key : toHandlerName(key)
      return Object.assign(acc, { [normalizedKey]: handler })
    }, {})

  return value.on || {}
}

export const handleDefault = <M, T, D>(
  method: M,
  modelValue: T,
  defaultValue: D,
) => {
  if (isFunction(method)) {
    return method(modelValue)
  } else if (!isEmpty(method)) {
    return method
  }
  return defaultValue
}
