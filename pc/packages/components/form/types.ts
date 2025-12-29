import type { Component } from 'vue'
import type { ListProps } from '../component/types'

export interface ItemsProps<T> {
  span?: number | number[]
  prop?: keyof T | string
  label?: string
  is?: string | Component
  children?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  display?: boolean | ((value: NonNullable<T>) => boolean)
  convert?: (value: keyof NonNullable<T>) => void
  queryValue?: Array<keyof T | string>
  joinValue?: string[]
  clearValue?: Array<keyof T | string>
  isEncrypt?: boolean
  isDecrypt?: boolean
  isQuery?: boolean
  isEmpty?: boolean
  list?: ListProps<T>[]
  bind?: object
  on?: object
  slots?: object
}
