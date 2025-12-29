// import { getUploadConfig, uploadAvatar } from '@/api/common';

export async function uploadAvatarFun() { // filePath: string
  // const config = await uploadAvatar() as any || {};
  // const url = await getImgUrl(config, filePath);
  // return url;
  return '';
}

export async function uploadFileFun() { // list: Array<T> | string <T>
  // const config = await getUploadConfig() as any || {};
  // const url = await getImgUrl(config, list);
  // return url;
  return '';
}

// function getImgUrl<T>(config: any, filePath: string | Array<T>) {
//   if (typeof filePath === 'string') {
//     return methodsFun(config, filePath).finally(() => uni.hideLoading());
//   }
//   else {
//     // 处理数组上传
//     const promises = filePath.map((item: any) => {
//       return methodsFun(config, item.url);
//     });
//     return Promise.all(promises).finally(() => uni.hideLoading());
//   }
// }

// function methodsFun(config: any, filePath: string) {
//   uni.showLoading({
//     title: '上传中',
//   });
//   return new Promise((resolve, reject) => {
//     const { dir, host, policy, ossAccessKeyId, signature } = config;
//     const arr = filePath.split('.');
//     const time = new Date().getTime();
//     const num = Math.floor(Math.random() * 100) + 1;
//     const url = `${time + num}.${arr[1]}`;
//     const formData = {
//       key: dir + url,
//       policy,
//       OssAccessKeyId: ossAccessKeyId,
//       signature,
//       success_action_status: '200',
//     };
//     uni.uploadFile({
//       url: 'https://51shanky.oss-cn-hangzhou.aliyuncs.com/',
//       filePath,
//       name: 'file',
//       formData,
//       success: () => {
//         resolve(`${host}${dir}${url}`);
//       },
//       fail: (err) => {
//         reject(err);
//       },
//     });
//   });
// }

export function mpUpdate() {
  // #ifdef MP-WEIXIN
  const updateManager = uni.getUpdateManager();
  updateManager.onCheckForUpdate((res) => {
    console.log(res.hasUpdate);
  });
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '检测到新版本，是否下载新版本并重启小程序？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      },
    });
  });
  updateManager.onUpdateFailed(() => {
    uni.showModal({
      title: '已经有新版本了哟~',
      content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      showCancel: false,
    });
  });
  // #endif
}
