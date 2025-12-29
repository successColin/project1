import { type App } from 'vue'
import { loadElementPlus } from './element-plus'
import { loadElementPlusIcon } from './element-plus-icon'
import { loadDsrzElementPlus } from './dsrz-element-plus'
import { loadDsrzIcon } from './dsrz-icon'

export const loadPlugins = (app: App) => {
    loadElementPlus(app)
    loadElementPlusIcon(app)
    loadDsrzElementPlus(app)
    loadDsrzIcon(app)
}
