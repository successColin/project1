import type { UserState } from './types';
import { defineStore } from 'pinia';
// import { UserApi } from '@/api';

import { clearToken } from '@/utils/auth'; // setToken

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    email: '',
    headImg: '',
    id: 0,
    isAdmin: false,
    nickname: '#F8F8F8',
    phone: '',
    realAuth: '',
    tenantId: '',
    type: '',
    userId: '',
    username: '',
    roadVip: '', // （道路救援会员 0否(已失效) 1是(未生效) 2是（已生效））
    roadVipExp: '', // （道路救援会员到期时间）
    openId: '',
    realName: '', // 真实姓名
    accid: '', // 云信账号
    shareObj: {
      source: '', // 注册端口
      scene: '', // 注册来源
      sceneId: '', // 场景id
      invitenId: '', // 邀请人id
      homeI: '',
      job: '',
    }, // 分享人
  }),
  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },
  actions: {
    // 设置用户的信息
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    // 重置用户信息
    resetInfo() {
      this.$reset();
    },
    // 获取用户信息
    async info() {
      // const result = await UserApi.profile() as UserState;
      // this.setInfo(result);
    },
    setTheme() {
      console.log(1111);
    },
    // 判断是否新用户
    async isNewUser() { // params: any
      // const res = await UserApi.isLogin(params) as any;
      // return res;
      return true;
    },
    // 异步登录并存储token
    login() { // loginForm: LoginReq
      return new Promise(() => { // resolve, reject
        // UserApi.login(loginForm).then((res) => {
        //   const token = res?.accessToken;
        //   if (token) {
        //     setToken(`${res?.tokenType} ${token}`);
        //   }
        //   resolve(res);
        // }).catch((error) => {
        //   reject(error);
        // });
      });
    },
    // Logout
    async logout() {
      // await UserApi.logout();
      this.resetInfo();
      clearToken();
    },
    // 小程序授权登录
    // authLogin(provider: providerType = 'weixin') {
    //   return new Promise((resolve, reject) => {
    //     uni.login({
    //       provider,
    //       success: async (result: UniApp.LoginRes) => {
    //         if (result.code) {
    //           const res = await UserApi.loginByCode({ code: result.code });
    //           resolve(res);
    //         }
    //         else {
    //           reject(new Error(result.errMsg));
    //         }
    //       },
    //       fail: (err: any) => {
    //         console.error(`login error: ${err}`);
    //         reject(err);
    //       },
    //     });
    //   });
    // },
  },
  persist: true,
});

export default useUserStore;
