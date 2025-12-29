import CryptoJS from 'crypto-js'
import { isNumber } from './judge'
export interface FileInfo {
  /* 文件名称 */
  name: string
  /* 文件存储的路径或链接 */
  url: string
  /* 文件类型 1-图片，2-视频，3-其他 */
  type?: string
  /* 文件大小 */
  size?: number | string
  /* 文件扩展名 */
  extension?: string
  /* 图片/视频分辨率宽度(像素) */
  width?: number
  /* 图片/视频分辨率高度(像素) */
  height?: number
  /* 当前文件是横屏还是竖屏，1-横屏；2-竖屏 */
  showType?: number
  /* 横屏封面url */
  cover_image_transverse?: string
  /* 竖屏封面url */
  cover_image_vertical?: string
  /* 编码格式简述名。支持H264、MOV、AAC、AVC、MPEG。 */
  codecname?: string
  /* 视频码率 */
  bitrate?: number | string
  /* 视频时长 */
  duration?: number | string
  /* 视频帧率 */
  fps?: number | string
  /* 视频时长格式化例如01:30 */
  durationName?: string
  /* 备注 */
  remark?: string
  /* 创建时间-返回时使用 */
  createTime?: string
  /* 素材库目录id，查询素材库返回时使用 */
  directoryId?: number
}

export const fetchFileInfo = async (
  url: string,
  name: string,
  params?: Partial<FileInfo>,
): Promise<FileInfo> => {
  if (params!.type!.startsWith('image/')) {
    params!.type = '1'
    try {
      const img = new Image()
      img.src = url
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true)
        img.onerror = reject
      })
      params!.width = img.naturalWidth
      params!.height = img.naturalHeight
      if (img.naturalWidth > img.naturalHeight) {
        params!.showType = 1
      } else {
        params!.showType = 2
      }
    } catch (e) {
      console.warn('Failed to get image dimensions', e)
    }
  } else if (params!.type!.startsWith('video/')) {
    params!.type = '2'
    try {
      const video = document.createElement('video')
      video.src = url
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve(true)
        video.onerror = reject
      })
      params!.duration = video.duration
      params!.width = video.videoWidth
      params!.height = video.videoHeight
      if (video.videoWidth > video.videoHeight) {
        params!.showType = 1
      } else {
        params!.showType = 2
      }
      if (params!.size && video.duration) {
        params!.bitrate = Math.round(
          (Number(params!.size) * 8) / video.duration,
        )
      }
    } catch (e) {
      console.warn('Failed to get video metadata', e)
    }
  } else {
    params!.type = '3'
  }
  if (isNumber(params!.size)) {
    params!.size = formatFileSize(params!.size)
  }
  params!.extension = url.split('.').pop()
  return {
    url,
    name,
    ...params,
  }
}

export const fetchFileMD5 = (file: File, size: number = 5) =>
  new Promise((resolve, reject) => {
    const chunkSize = size * 1024 * 1024
    const spark = CryptoJS.lib.WordArray.create()
    const readNextChunk = (offset: number) => {
      if (offset < file.size) {
        const end = Math.min(offset + chunkSize, file.size)
        const blob = file.slice(offset, end)
        const fileReader = new FileReader()
        fileReader.onload = e => {
          spark.concat(
            CryptoJS.lib.WordArray.create(e.target!.result as ArrayBuffer),
          )
          readNextChunk(end)
        }
        fileReader.onerror = reject
        fileReader.readAsArrayBuffer(blob)
      } else {
        resolve(CryptoJS.MD5(spark).toString())
      }
    }
    readNextChunk(0)
  })

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  const size = bytes / Math.pow(1024, i)

  // 根据大小决定小数位数
  if (i === 0) {
    return `${size} ${sizes[i]}`
  } else if (size < 10) {
    return `${size.toFixed(2)} ${sizes[i]}`
  } else if (size < 100) {
    return `${size.toFixed(1)} ${sizes[i]}`
  } else {
    return `${size.toFixed(0)} ${sizes[i]}`
  }
}
