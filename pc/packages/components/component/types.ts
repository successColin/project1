import type { Component } from 'vue'

export interface ListProps<T> {
  prop?: keyof T | string
  is?: string | Component
  display?: boolean | ((value: NonNullable<T>) => boolean)
  bind?: object
  on?: object
}
