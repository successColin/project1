import { ref, type App } from 'vue'

interface GlobProps {
  default: {
    label: string
    name: string
  }
}

interface Options {
  value: string
  label: string
}

export const dsrzIconOptions = ref<Options[]>([])

const components = import.meta.glob<GlobProps>('./**/*.vue', { eager: true })
console.log(components)

const install = (app: App) => {
  const options: Options[] = []
  Object.entries(components).map(([, module]) => {
    if (!module.default?.name) return
    if (dsrzIconOptions.value.map(v => v.value).includes(module.default.name))
      return
    options.push({ value: module.default.name, label: module.default.label })
    app.component(module.default.name, module.default)
  })
  console.log(options)
  dsrzIconOptions.value = options
}
export default { install }
