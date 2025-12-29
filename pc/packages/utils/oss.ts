import OSS from 'ali-oss'

// STS凭证类型
export interface STSCredentials {
  regionId: string
  accessKeyId: string
  accessKeySecret: string
  securityToken: string
  bucketName: string
  expiration?: string
  dir?: string
}

// 创建OSS客户端
export const createOSSClient = (credentials: STSCredentials) =>
  new OSS({
    region: `oss-${credentials.regionId}`,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    stsToken: credentials.securityToken,
    bucket: credentials.bucketName,
    secure: true, // 使用HTTPS
  })

// 上传进度回调
export type ProgressCallback = (progress: number) => void

// 分片上传选项
interface MultipartUploadOptions {
  progress?: ProgressCallback
  partSize?: number
  parallel?: number
  meta?: Record<string, object>
  mime?: string
  key?: string
}

// 分片上传方法
export const multipartUpload = async (
  client: typeof OSS,
  file: File,
  options: MultipartUploadOptions = {},
) => {
  const {
    progress,
    partSize = 1024 * 1024, // 默认1MB
    parallel = 4, // 并发数
    meta,
    mime,
    key,
  } = options

  try {
    const result = await client.multipartUpload(key || file.name, file, {
      progress: (p: number) => progress && progress(p),
      partSize,
      parallel,
      meta,
      mime: mime || file.type,
    })
    return result
  } catch (err) {
    console.error('分片上传失败:', err)
    throw err
  }
}
