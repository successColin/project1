import { ElLoading, ElMessage } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.mjs'

export const usePromiseWithLoading = <T>() => {
  let loadingInstance: LoadingInstance | null = null

  const execute = async (
    promises: Promise<T>[],
    options?: {
      loadingText?: string
      successMessage?: string
      errorMessage?: string
      silent?: boolean // 是否静默模式（不显示消息）
    },
  ) => {
    const {
      loadingText = '提交中...',
      successMessage = '提交成功',
      errorMessage = '提交失败',
      silent = false,
    } = options || {}

    loadingInstance = ElLoading.service({
      lock: true,
      text: loadingText,
      background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
      const results = await Promise.all(promises)

      if (!silent) {
        ElMessage.success(successMessage)
      }

      return results
    } catch {
      if (!silent) {
        ElMessage.error(errorMessage)
      }

      return []
    } finally {
      loadingInstance?.close()
    }
  }

  return { execute }
}
