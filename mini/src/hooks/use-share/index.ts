import type { ShareOptions } from './types';

export default function useShare(options?: ShareOptions) {
  // #ifdef MP-WEIXIN
  const title = options?.title ?? '';
  const path = options?.path ?? '';
  const query = options?.query ?? '';
  const imageUrl = options?.imageUrl ?? '';

  const shareApp = (params: ShareOptions = {}) => {
    console.log(params);
    onShareAppMessage(() => {
      return {
        title,
        path: path ? `${path}${query ? `?${query}` : ''}` : '',
        imageUrl,
        ...params,
      };
    });
  };

  const shareTime = (params: ShareOptions = {}) => {
    console.log(params);
    onShareTimeline(() => {
      return {
        title,
        query: options?.query ?? '',
        imageUrl,
        ...params,
      };
    });
  };
  return {
    onShareAppMessage: shareApp,
    onShareTimeline: shareTime,
  };
  // #endif
}
