import { deepClone, isArray, isObject, isString } from 'dsrz/utils'
import { reactive, ref } from 'vue'

interface Props {
  value: string
  label: string
}

/**
 * 重置，查询
 * @param v 保存页面初始化的数据
 * @param u 是否需要更新页面初始化的数据
 * @returns
 */
export const useResetReactive = <T extends object>(v: T) => {
  /** 数据初始化 */
  const params = reactive(deepClone(v)) as T

  /** 重置标识 */
  const dsrzReset = ref(false)

  /** 查询标识 */
  const dsrzQuery = ref(false)

  /** 重置 */
  const reset = () => {
    Object.keys(params).forEach(key => delete params[key as keyof T])
    dsrzReset.value = !dsrzReset.value
    Object.assign(params, deepClone(v), { dsrzReset: dsrzReset.value })
  }

  /** 查询 */
  const query = () => {
    dsrzQuery.value = !dsrzQuery.value
    Object.assign(params, { dsrzQuery: dsrzQuery.value })
  }

  const initialize = <V>(
    value: V,
    props: Props | (Props | string)[] | string,
  ) => {
    const keys = isArray(props) ? props : [props]
    const obj = Object.assign({})
    keys.forEach(key => {
      if (isObject(key)) {
        const { value: VK, label: PK } = key
        Object.assign(obj, { [PK]: value[VK as keyof V] })
      } else if (isString(key)) {
        Object.assign(obj, { [key]: value[key as keyof V] })
      }
    })
    Object.assign(v, obj)
    Object.assign(params, obj)
  }

  return { params, exposes: { reset, query, initialize } }
}
