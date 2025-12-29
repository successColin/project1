export interface RadioOption extends Record<string, unknown> {
  value?: string | number | boolean
  label?: string
}

export interface RadioProps {
  value?: string
  label?: string
}
