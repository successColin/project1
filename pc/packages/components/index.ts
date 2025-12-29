import type { App } from 'vue'
import { merge } from 'lodash'

import { GlobalConfig, type GlobalConfigProps } from 'dsrz/components/config'

interface GlobProps {
  default: {
    name: string
  }
}

const components = import.meta.glob<GlobProps>('./**/*.vue', { eager: true })
console.log(components)

const install = (app: App, options?: Partial<GlobalConfigProps>) => {
  const names: string[] = []
  Object.entries(components).map(([, module]) => {
    if (!module.default?.name) return
    if (names.includes(module.default.name)) return
    names.push(module.default.name)
    app.component(module.default.name, module.default)
  })
  console.log(names)
  merge(GlobalConfig, options)
}
export default { install }
