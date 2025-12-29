import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

/** 添加 vue-router 路由管理库 */
import router from './router'
app.use(router)
/** 添加 全局路由守卫 */
import './router/guard'

/** 添加 pinia 状态管理库 */
import pinia from './stores'
app.use(pinia)

/** 加载插件 */
import { loadPlugins } from "@/plugins"
loadPlugins(app)

app.mount('#app')
