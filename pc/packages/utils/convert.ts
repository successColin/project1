import { deepClone } from './clone'
import { isArray, isFile } from './judge'
import * as mammoth from 'mammoth'

/**
 *  Tree 转换 List
 * @param tree
 * @param key
 * @param fn
 * @param list
 * @param value
 * @returns
 */
export const treeToList = <T, U>(
  tree: T[],
  key: U,
  fn: (a: T, b?: T) => void,
  list: T[] = [],
  value?: T,
) => {
  const sign = key as keyof T
  const cloneTree = deepClone(tree)
  cloneTree.forEach((v: T) => {
    fn(v, value)
    if (isArray(v[sign]) && v[sign].length !== 0) {
      treeToList(v[sign] as T[], key, fn, list, v)
      delete v[sign]
    }
    list.push(v)
  })
  return list
}

/**
 * List 转换 Tree
 * @param list
 * @param key
 * @param fn
 * @param rn
 * @returns
 */
export const listToTree = <T, U, K>(
  list: T[],
  key: U,
  fn: (a: T, b: T) => K,
  rn: (a: T) => K,
) => {
  const sign = key as keyof T
  const cloneList = deepClone(list)
  return cloneList.filter(v => {
    const children = cloneList.filter(value => fn(v, value))
    if (isArray(children) && children.length !== 0) {
      v[sign] = children as T[keyof T]
    }
    if (rn(v)) {
      return v
    }
  })
}

/**
 * 读取docx二进制文件数据 转换 HTML
 * @param url
 */
export const convertToHtml = async (url: string) => {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
    return result.value
  } catch (err) {
    console.error(err)
    return ''
  }
}

/**
 * base64 转换 file
 * @param url
 * @param name
 * @return
 */
export const urlToFile = (url: string, name: string) => {
  const arr = url.split(',')
  const type = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  if (isFile()) {
    const file = new File([u8arr], name, { type })
    return file
  }
  return '不支持File对象'
}

/**
 * 事件名称转换为驼峰式处理器名称
 * @param eventName 事件名称
 * @returns 驼峰式处理器名称
 */
export const toHandlerName = (eventName: string) => {
  // 将连字符分隔的单词转换为驼峰式
  const camelCase = eventName.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase(),
  )
  return `on${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`
}

/**
 * 字符串转UTF-8
 * @param str
 * @returns
 */
export const btoaUTF8 = (str: string) => {
  // 1. 将字符串转为 UTF-8 字节数组（Uint8Array）
  const encoder = new TextEncoder() // 浏览器原生 API，无需额外依赖
  const uint8Array = encoder.encode(str)
  // 2. 将 Uint8Array 转为 Latin-1 兼容的字符串（因为 btoa 只认 Latin-1）
  const latin1Str = String.fromCharCode(...uint8Array)
  // 3. 执行 Base64 编码
  return window.btoa(latin1Str)
}
