import { ElMessage } from 'element-plus'
import { isString } from './judge'

/**
 * 下载地址文件
 * @param url 文件地址
 * @param name 文件名称
 */
export const download = async (url: string | Blob, name: string) => {
  /** url地址 转 blob对象 */
  const blob = (url: string) =>
    new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(new Error('下载失败'))
        }
      }
      xhr.onerror = () => {
        reject(new Error('下载失败'))
      }
      xhr.send()
    })
  /** 下载文件 */
  const save = (blob: Blob, name: string) => {
    const a = document.createElement('a')
    a.setAttribute('href', window.URL.createObjectURL(blob))
    a.setAttribute('target', '_blank')
    a.setAttribute('download', name)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(window.URL.createObjectURL(blob))
  }

  try {
    save(isString(url) ? await blob(url) : url, name)
  } catch {
    ElMessage.error('下载失败')
  }
}
