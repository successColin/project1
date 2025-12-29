import type { App } from 'vue';
import { createPinia } from 'pinia';
// 数据持久化
import { createPersistedState } from 'pinia-plugin-persistedstate';

// 导入子模块
import useAppStore from './modules/app';
import useChatStore from './modules/chat';
import useConfigStore from './modules/config'; // 新增：导入config模块
import useUserStore from './modules/user';
// 安装pinia状态管理插件
function setupStore(app: App) {
  const store = createPinia();

  const piniaPersist = createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  });
  store.use(piniaPersist);

  app.use(store);
}

// 导出模块
export { useAppStore, useChatStore, useConfigStore, useUserStore };
export default setupStore;
