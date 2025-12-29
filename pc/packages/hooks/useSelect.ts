import { isEmpty, isNumber } from 'dsrz/utils'

interface Props {
  label: string
  value: number | string
}

export const useSelect = () => {
  const defaultValue = <T>(list: T[], props: Props, fn: (v: T) => void) => {
    if (props.label === 'number' && isNumber(props.value) && !isEmpty(list)) {
      fn(list[props.value])
    } else if (!isEmpty(list)) {
      fn(list.find(v => v[props.label as keyof T] === props.value)!)
    }
    return list
  }

  return { defaultValue }
}
