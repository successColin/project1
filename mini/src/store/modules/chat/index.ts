import type { ChatState } from './types';
import { defineStore } from 'pinia';

const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    isLogin: false,
  }),
  getters: {
    // userInfo(state: ChatState): ChatState {
    //   return { ...state };
    // },
  },
  actions: {
    setIsLogin(val: boolean) {
      console.log(val);
      this.isLogin = val;
    },
  },
  persist: true,
});

export default useChatStore;
