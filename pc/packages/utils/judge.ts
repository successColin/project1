/**
 * 判断是否为数组
 * @param val
 */
export const isArray: typeof Array.isArray = Array.isArray

/**
 * 判断是否为对象
 * @param val
 */
export const isObject = (val: unknown) => val !== null && typeof val === 'object'

/**
 * 判断是否为空
 * @param val
 */
export const isEmpty = (val: unknown) => (!val && val !== 0) || (isArray(val) && val.length === 0) || (isObject(val) && !Object.keys(val).length)

/**
 * 判断是否为函数
 * @param val
 */
export const isFunction = (val: unknown) => typeof val === 'function'

/**
 * 判断是否为布尔值
 * @param val
 */
export const isBoolean = (val: unknown) => typeof val === 'boolean'

/**
 * 判断是否为字符串
 * @param val
 */
export const isString = (val: unknown) => typeof val === 'string'

/**
 * 判断是否为数字
 * @param val
 */
export const isNumber = (val: unknown) => typeof val === "number";

/**
 * 判断是否显示
 * @param method 
 * @param val 
 * @returns 
 */
export const isDisplay = <M, T>(method: M, val: T) => {
    if (isFunction(method)) {
        return method(val)
    } else if (isBoolean(method)) {
        return method
    }
    return true
}

/** 判断是否为外链 */
export const isExternal = (path: string) => {
    const reg = /^(https?:|mailto:|tel:)/
    return reg.test(path)
}

/** 判断是否为文件 */
export const isFile = () =>
    window.File &&
    window.FileList &&
    window.FileReader &&
    window.Blob &&
    navigator.userAgent.indexOf('Edge') === -1 &&
    navigator.userAgent.indexOf('MSIE') === -1 &&
    navigator.userAgent.indexOf('Trident') === -1
