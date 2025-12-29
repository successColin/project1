export interface ColumnItem {
  modelValue: string | number
  backups: {
    epmb: string | number
    dsrzmb: string | number
    h2: string | number
  }
}

export interface Params {
  show: number
}
