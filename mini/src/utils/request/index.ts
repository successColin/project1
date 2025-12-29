import type { uniappRequestAdapter } from '@alova/adapter-uniapp';
import type { IResponse } from './types';
import AdapterUniapp from '@alova/adapter-uniapp';
import { createAlova } from 'alova';
import { createServerTokenAuthentication } from 'alova/client';
import VueHook from 'alova/vue';
import { useLoading } from '@/hooks';
import { useConfigStore } from '@/store';
import { getToken } from '@/utils/auth';
import { signEncrypt } from '@/utils/signature';
import { showMessage } from './status';

const { showLoading, hideLoading } = useLoading();

/**
 * @description: 请求结果设置
 */
export enum ResultEnum {
  SUCCESS = 200,
  FAIL = 10001,
  ERROR = 1,
  TIMEOUT = 401,
  TIMEOUTOther = 403,
  TYPE = 'success',
}

export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

const ContentType = {
  'Content-Type': ContentTypeEnum.JSON,
  // 'Accept': 'application/json, text/plain, */*',
};

// 用于在所有请求中自动携带 token，并支持 token 过期自动刷新。
const { onAuthRequired, onResponseRefreshToken }
  = createServerTokenAuthentication<typeof VueHook, typeof uniappRequestAdapter>({
    refreshTokenOnError: {
      // 当服务端返回401时，表示token过期
      isExpired: (error) => {
        return error.response.status === 401 || error.response.status === 403;
      },
      // 当token过期时触发，在此函数中触发刷新token
      handler: async () => {
        // token刷新失败，跳转回登录页
        uni.navigateTo({ url: '/pages/common/login/index' });
        // try {
        //   await useUserStore().authLogin();
        // }
        // catch (error) {
        //   // token刷新失败，跳转回登录页
        //   uni.reLaunch({ url: '/pages/common/login/index' });
        //   // 并抛出错误
        //   throw error;
        // }
      },
    },
  });

const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  ...AdapterUniapp(),
  // timeout: 5000,
  statesHook: VueHook,
  cacheFor: {
    expire: 1000,
  },
  beforeRequest: onAuthRequired((method: any) => {
    const configStore = useConfigStore();
    method.config.headers = Object.assign(method.config.headers, ContentType);
    const { config } = method;
    if (config.loading) {
      showLoading();
    }
    const isLogin = config.meta?.isLogin;
    const authorization = isLogin ? 'Basic NHM6NHN5YmExODg=' : getToken();
    if (authorization) {
      method.config.headers.authorization = authorization;
    }
    if (isLogin) {
      method.config.headers['Content-Type']
        = 'application/x-www-form-urlencoded';
    }
    const params
      = method.type === 'GET'
        ? method.config.params
        : method.type === 'POST' || method.type === 'PUT'
          ? method.data
          : {};
    const { appkey, timestamp, sign } = signEncrypt({
      url: method.url,
      params,
    });
    method.config.headers.appkey = appkey;
    method.config.headers.timestamp = timestamp;
    method.config.headers.sign = sign;
    // #ifdef MP-WEIXIN
    method.config.headers.appid = uni.getAccountInfoSync().miniProgram.appId;
    // #endif
    // #ifdef H5
    const appid = uni.getStorageSync('appid') || configStore.appId;
    console.log(appid, '6666666appid');
    method.config.headers.appid = appid;
    // #endif
  }),
  // 原响应成功拦截器
  responded: onResponseRefreshToken((response, method) => {
    console.log(2222, method);
    const { config } = method;
    const { requestType, loading } = config;
    if (loading) {
      hideLoading();
    }
    const {
      statusCode,
      data: rawData,
      errMsg,
    } = response as UniNamespace.RequestSuccessCallbackResult;
    if (statusCode === 200) {
      if (requestType) {
        return response;
      }
      const { code, msg, data } = rawData as IResponse;
      if (code === ResultEnum.SUCCESS || code === 0) {
        if ('total' in rawData) {
          return rawData;
        }
        return data as any;
      }
      else if (
        code === ResultEnum.TIMEOUT
        || code === ResultEnum.TIMEOUTOther
      ) {
        if (config?.isNoLogin) return;
        uni.navigateTo({ url: '/pages/common/login/index' });
      }
      // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
      if (config.meta?.toast !== false) uni.$u.toast(msg);
      throw new Error(`请求错误[${code}]：${msg}`);
    }
    // 处理http状态错误
    setTimeout(() => {
      uni.$u.toast(showMessage(statusCode));
    }, 500);
    throw new Error(`HTTP请求错误[${statusCode}]：${errMsg}`);
  }),
});

export const request = alovaInstance;

export function get<T>(url = '', params = {}, config = {}): Promise<T> {
  return request.Get<T>(url, {
    ...params,
    ...config,
  });
}

export function post<T>(url = '', data = {}, config = {}): Promise<T> {
  return request.Post<T>(url, data, config);
}

export function del<T>(url = '', data = {}, config = {}): Promise<T> {
  return request.Delete<T>(url, data, config);
}

export function put<T>(url = '', data = {}, config = {}): Promise<T> {
  return request.Put<T>(url, data, config);
}

export function upload<T>(url = '', data = {}, config = {}): Promise<T> {
  return request.Post<T>(url, data, {
    // 设置请求方式为上传，适配器内将调用uni.uploadFile
    requestType: 'upload',
    ...config,
  });
}

export function download<T>(url = '', config = {}): Promise<T> {
  return request.Get<T>(url, {
    // 设置请求方式为下载，适配器内将调用uni.downloadFile
    requestType: 'download',
    ...config,
  });
}
