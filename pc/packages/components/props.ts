export const backupsProps = {
  backups: {
    type: Object,
    default: () => ({}),
  },
}

export const requestProps = {
  /** 请求参数 */
  params: {
    type: Object,
    default: () => ({}),
  },
  /** 请求方法 */
  request: {
    type: Function,
    default: undefined,
  },
  /** 更新参数(用于更新请求参数) */
  update: {
    type: Object,
    default: () => ({}),
  },
}
