import type { Component } from 'vue'

export interface MoreProps<T> {
    prop?: string
    is?: string | Component
    display?: boolean | ((value: T) => boolean)
    bind?: object
    on?: object
}
