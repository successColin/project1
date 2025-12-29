import { get, post } from '@/utils/request';

// App-获取广告位列表
export const getBannerApi = () => get(`/club-s4/v1/adBanner/app/list`);

// 资讯分页
export const getInfoDetailApi = (data: any, params: any) => post(`/club-social/v1/api/information/pageList`, data, { params });

// APP-首页活动列表
export const getCarActivityApi = (data: any, params: any) => get(`/club-social/v1/api/activity/app/homePage/pageList`, data, { params });

// 获取该车款的车型列表
export const listNewCarListApi = () => get(`/club-s4/v1/api/carVehicleInfo/newCarList`);

// 保养套餐列表
export const getMealListApi = (params: any) => get(`/club-s4/v1/api/meal/list`, { params });

//
export const getAppinfo = () => get(`/club-system/v1/api/tenant/appinfo`);

// 二手车上架判断
export const getHasSale = () => get(`/club-s4/v1/api/carVehicleInfo/hasSale`);

// 获取店铺装修信息
export const shopDecoration = (data: any) => post(`/club-s4/v1/s4/shopDecoration/app/detail`, data);
