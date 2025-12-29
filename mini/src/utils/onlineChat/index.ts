import { NIM, setAdapters, uniAppAdapters, V2NIMConst, V2NIMLocalConversationService, V2NIMMessageLogUtil, V2NIMMessageService, V2NIMStorageService, V2NIMTeamService, V2NIMUserService } from 'nim-web-sdk-ng/dist/esm/nim';
import { refOrCreYunXinToken } from '@/api/user';
import { useChatStore, useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export { NIM, V2NIMConst };

// 设置 uni-app 环境的适配器
setAdapters(uniAppAdapters);
// 消息模块。包含发送消息等功能。
NIM.registerService(V2NIMMessageService, 'V2NIMMessageService');
// 消息日志模块。包含获取历史消息等功能。
NIM.registerService(V2NIMMessageLogUtil, 'V2NIMMessageLogUtil');
// 用户模块
NIM.registerService(V2NIMUserService, 'V2NIMUserService');
// 本地会话模块
NIM.registerService(V2NIMLocalConversationService, 'V2NIMLocalConversationService');
// 云端存储模块，包含上传文件能力
NIM.registerService(V2NIMStorageService, 'V2NIMStorageService');
// 群组模块
NIM.registerService(V2NIMTeamService, 'V2NIMTeamService');

// 注册监听事件
const registerListener = () => {
  const chatStore = useChatStore();
  chatStore.setIsLogin(false);
  // 监听登录状态变化
  uni.$UIKitNIM.V2NIMLoginService.on('onLoginStatus', (status: number) => {
    console.log('登录状态', status);
    if (status === 1) {
      chatStore.setIsLogin(true);
    }
    else {
      chatStore.setIsLogin(false);
    }
  });
};
// 登录
export const nimLogin = async () => {
  console.log('云信登录');
  try {
    const userStore = useUserStore();
    if (!isLogin()) return;
    console.log(userStore.accid, 'userStore.accid');
    const { accid, token } = await refOrCreYunXinToken({ accid: userStore.accid || '' }) as any;
    if (!userStore.accid) {
      await userStore.info();
    }
    console.log(accid, ' 云信账号', ' - ', token, ' 云信token');
    uni.$UIKitNIM.V2NIMLoginService.login(accid, token);
  }
  catch {
    setTimeout(() => {
      nimLogin();
    }, 5000);
  }
};
// 初始化
export const initNim = async () => {
  uni.$UIKitNIM = NIM.getInstance({
    appkey: '4d0d00f14d9f5a617401c3d1d8c1b077',
    debugLevel: 'warn',
    apiVersion: 'v2',
  }, {
    V2NIMLoginServiceConfig: {
      lbsUrls: [
        'https://lbs.netease.im/lbs/wxwebconf.jsp',
      ],
      linkUrl: 'wlnimsc0.netease.im',
    },
  });
  registerListener();
  nimLogin();
};
