import { reactive, type defineComponent } from "vue"

interface RefsProps<T> {
    [key: string]: T
}

export const refs = reactive<RefsProps<ReturnType<typeof defineComponent>>>({})

/**
 * ref绑定  
 * 页面使用(组件名或页面组件名 + Ref) 如:tableRef 组件类型相同加数字(number) 如:table(number)Ref
 * 页面组件使用(页面组件名 + 组件名 + Ref) 如:detailsTableRef 组件类型相同加数字(number) 如:detailsTable(number)Ref
 * @param e ref
 * @param key ID
 */
export const createRef = <T>(e: T, key: string) => refs[key] = e
