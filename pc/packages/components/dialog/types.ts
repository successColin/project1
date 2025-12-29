import type { Component } from 'vue'

export interface BtnsProps<T> {
  is: string | Component
  display?: boolean | ((value: T) => boolean)
  bind?: object
  on?: object
}
