import { GlobalConfig } from 'dsrz/components/config'
import { isArray, isFunction } from 'dsrz/utils'

export const usePermission = (
  query: string | string[],
  config: string[] | (() => string[]) = GlobalConfig.elPermission,
) => {
  const list = isArray(query) ? query : [query]
  if (isFunction(config)) {
    return config().some(v => list.includes(v))
  }
  if (isArray(config)) {
    return config.some(v => list.includes(v))
  }
  return true
}
