// src/store/modules/config.ts
import { defineStore } from 'pinia';

// 定义State类型（保留，保证业务逻辑类型安全）
interface ConfigState {
  appId: string; // 小程序/H5的AppId
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    appId: '',
  }),
  actions: {
    setAppId(appId: string) {
      this.appId = appId;
    },
    clearAppId() {
      this.appId = '';
    },
  },
  // 核心：将persist配置强制设为any，绕过插件的类型校验
  persist: {
    key: 'config_store',
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
      removeItem: uni.removeStorageSync,
    },
    paths: ['appId'],
  } as any, // 关键：添加 as any 消除类型报错
});

export default useConfigStore;
