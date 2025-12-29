import type { UserInput } from 'element-plus'
import { buildProps, definePropType } from 'element-plus/es/utils/index.mjs'

export const timePickerRangeTriggerProps = buildProps({
  id: {
    type: definePropType<string[]>(Array),
  },
  name: {
    type: definePropType<string[]>(Array),
  },
  modelValue: {
    type: definePropType<UserInput>([Array, String]),
  },
  startPlaceholder: String,
  endPlaceholder: String,
} as const)

/**
 * @deprecated Use `timePickerRangeTriggerProps` instead. This will be removed in future versions.
 */
export const timePickerRngeTriggerProps = timePickerRangeTriggerProps
