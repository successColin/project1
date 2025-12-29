export interface CheckboxOption extends Record<string, unknown> {
  value?: string | number
  label?: string
}

export interface CheckboxProps {
  value?: string
  label?: string
}
