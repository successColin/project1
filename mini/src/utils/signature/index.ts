import { md5 } from 'js-md5';

/**
 * 判断是否为数组
 * @param val
 */
export const isArray: typeof Array.isArray = Array.isArray;

/**
 * 判断是否为空
 * @param val
 */
export const isEmpty = (val: unknown) => (!val && val !== 0) || (isArray(val) && val.length === 0) || (isObject(val) && !Object.keys(val).length);

/**
 * 判断是否为对象
 * @param val
 */
function isObject(val: unknown) {
  return val !== null && typeof val === 'object';
}

/**
 * 判断是否为布尔值
 * @param val
 */
export const isBoolean = (val: unknown) => typeof val === 'boolean';

const AK = import.meta.env.VITE_SIGN_AK;

const SK = import.meta.env.VITE_SIGN_SK;

export const signEncrypt = (config: any) => {
  const timestamp = new Date().getTime();
  return {
    sign: md5(
      `${AK}${config.url}${timestamp}${paramsToLink(config.params)}${SK}`,
    ),
    timestamp,
    appkey: AK,
  };
};

export function paramsToLink(
  params: any,
  isLocation = false,
) {
  if (isEmpty(params)) return '';
  const obj = Object.fromEntries(
    Object.entries(params)
      .sort()
      .filter(([_key, value]) =>
        !(isArray(value) || isObject(value))
        && !(isEmpty(value) && !isBoolean(value)),
      )
      .map(([key, value]) => [
        key,
        isLocation ? encodeURIComponent(value as string) : value,
      ]),
  );

  return `${isLocation ? '?' : ''}${Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')}`;
}
