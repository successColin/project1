import { type App } from 'vue'
import DsrzIcon from 'dsrz/svg'

export const loadDsrzIcon = (app: App) => {
    /** 注册所有 Dsrz Icon */
    app.use(DsrzIcon)
}
