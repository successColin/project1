export type RoleType = '' | '*' | 'user';
export interface UserState {
  email: string;
  headImg: string;
  id: number;
  isAdmin: boolean;
  nickname: string;
  phone: string;
  realAuth: string;
  tenantId: string;
  type: string;
  userId: string;
  username: string;
  roadVip: string;
  roadVipExp: string;
  openId: string;
  realName: string;
  accid: string;
  shareObj: {
    source: string;
    scene: string;
    sceneId: string;
    invitenId: string;
    homeI: string;
    job: string;
  };
}

export type providerType =
  | 'weixin'
  | 'qq'
  | 'sinaweibo'
  | 'xiaomi'
  | 'apple'
  | 'univerify'
  | undefined;
