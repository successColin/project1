import type { FileInfo } from 'dsrz/utils'

export interface FileParams {
  directoryId: string | number
  type: number
  files: FileInfo[]
}

export interface TableData {
  id: number
  checked: boolean
}
