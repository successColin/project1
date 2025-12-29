import { deepClone } from './clone'
import { isArray, isObject } from './judge'

interface Tree<T> {
  [key: string]: Tree<T> | T
}
/**
 * 根据key查找树形结构
 * @param tree 树形结构
 * @param key 如果key是数组，则返回key对应的值
 * @returns
 */
export const findTreeByKey = <T>(tree: Tree<T>, key: string | string[]) => {
  const obj = Object.assign({})
  const keys = isArray(key) ? key : [key]
  Object.entries(tree).forEach(([k, v]) => {
    if (keys.includes(k)) {
      Object.assign(obj, isArray(key) ? { [k]: deepClone(v) } : deepClone(v))
    } else if (isObject(v)) {
      Object.assign(obj, findTreeByKey(v, key))
    }
  })
  return obj as T
}
