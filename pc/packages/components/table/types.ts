import type { Component } from 'vue'
import type { ListProps } from 'dsrz/components/component/types'

export interface BtnsProps<T> {
  is: string | Component
  display?: boolean | ((value: T) => boolean)
  bind?: object
  on?: object
}

export interface ColumnsProps<T> {
  prop?: keyof T | string
  /** 显示的标题 */
  label: string
  /** 对应列的类型 */
  type?: 'default' | 'selection' | 'index' | 'expand'
  /** 对应列的宽度 */
  width?: string | number
  fixed?: string | boolean
  align?: string
  is?: string | Component
  display?: boolean | ((value: T) => boolean)
  children?: boolean
  isEncrypt?: boolean
  isDecrypt?: boolean
  columns?: ColumnsProps<T>[]
  list?: ListProps<T>[]
  bind?: object
  form?: object
  on?: object
  slots?: object
}

export type DataProps<T> = Record<string, T>
