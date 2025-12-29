import { h } from 'vue'

import { ElIcon, ElTooltip } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

export const useLabelTip = (label: string, content: string) => () =>
  h('div', { style: { display: 'inline-flex', alignItems: 'center' } }, [
    h('span', label),
    h(
      ElTooltip,
      {
        content: content,
        placement: 'top',
      },
      {
        default: () => [
          h(
            ElIcon,
            {
              style: {
                marginLeft: '5px',
                cursor: 'pointer',
              },
            },
            { default: () => h(InfoFilled) },
          ),
        ],
      },
    ),
  ])
