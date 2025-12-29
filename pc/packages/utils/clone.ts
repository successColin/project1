import { isArray, isObject } from './judge'

/**
 * 深拷贝数据
 * @param data 需要拷贝数据
 * @returns 拷贝后的数据
 */
export const deepClone = <T>(data: T) => {
    if (isArray(data)) {
        const cloneData: T[] = []
        data.forEach(v => cloneData.push(deepClone(v)))
        return cloneData as T
    } else if (isObject(data)) {
        const cloneData = {} as T
        Object.keys(data).forEach(
            key => (cloneData[key as keyof T] = deepClone(data[key as keyof T])),
        )
        return cloneData
    } else {
        return data
    }
}
