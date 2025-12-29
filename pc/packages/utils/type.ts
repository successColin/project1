export interface DsrzH<T, V> {
  modelValue: T
  'onUpdate:modelValue': (value: T) => void
  backups: V
}
