const weeks = ['日', '一', '二', '三', '四', '五', '六']
const periods = [
  { label: '凌晨', value: (hour: number) => hour >= 0 && hour < 6 },
  { label: '早上', value: (hour: number) => hour >= 6 && hour < 8 },
  { label: '上午', value: (hour: number) => hour >= 8 && hour < 11 },
  { label: '中午', value: (hour: number) => hour >= 11 && hour < 13 },
  { label: '下午', value: (hour: number) => hour >= 13 && hour < 17 },
  { label: '傍晚', value: (hour: number) => hour >= 17 && hour < 19 },
  { label: '晚上', value: (hour: number) => hour >= 19 && hour < 24 },
]

export const dateFormat = (
  list: string[] = [],
  value?: string | number | Date,
) => {
  const date = value ? new Date(value) : new Date()
  const year = date.getFullYear().toString()
  const month = stringSlice(date.getMonth() + 1)
  const day = stringSlice(date.getDate())
  const hour = stringSlice(date.getHours())
  const minute = stringSlice(date.getMinutes())
  const second = stringSlice(date.getSeconds())
  const week = weeks[date.getDay()]
  const period = periods.find(v => v.value(Number(hour)))!.label

  return list.map(v =>
    v
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second)
      .replace('d', week)
      .replace('p', period),
  )
}

const stringSlice = (value: number) => value.toString().padStart(2, '0')
