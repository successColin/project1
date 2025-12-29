import { type App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export const loadElementPlus = (app: App) => {
  /** Element Plus 组件完整引入 */
  app.use(ElementPlus, { locale: zhCn })
}
