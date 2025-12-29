import Cookies from 'js-cookie'
import { isArray, isObject } from './judge'

export const cookiesStorage: Storage = {
    setItem: <T>(key: string, state: T) => Cookies.set(key, isObject(state) || isArray(state) ? JSON.stringify(state) : state),
    getItem: (key: string) => Cookies.get(key),
    removeItem: (key: string) => Cookies.remove(key),
    clear: () => { },
    key: (index: number) => index.toString(),
    length
}