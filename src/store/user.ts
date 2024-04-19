import { defineStore } from 'pinia';
import { getUserInfo, logout } from '@/api/user.ts';
import { getToken, removeToken } from '@/utils/auth.ts';

export interface IUserInfo {
  // 用户唯一ID
  account_id: string;
  // 用户邮箱
  email: string;
  // 用户手机国际区号 1 美国 86 中国
  country_code: string;
  // 用户手机号(带国际区号) 如：+1 25893304(中间可能无间隔)
  pure_phone: string;
  // 用户手机号，不带国际区号
  phone: string;
  // 用户平台账号
  user_name: string;
  // 用户注册时间
  register_time: string;
  // 用户昵称
  nick_name: string;
  // 用户性别 1 男 2女 3未知 0 未填写
  gender: number;
  // 用户描述
  bio: string;
}

interface state {
  account_id: string;
  userInfo: IUserInfo;
}

export const useUserStore = defineStore('userStore', {
  state(): state {
    return {
      account_id: '',
      userInfo: {
        account_id: '',
        email: '',
        country_code: '',
        pure_phone: '',
        phone: '',
        user_name: '',
        register_time: '',
        nick_name: '',
        gender: 1,
        bio: '',
      },
    };
  },
  actions: {
    async getUserInfo() {
      await getUserInfo<IUserInfo>()
        .then((res): void => {
          this.account_id = res.account_id;
          this.userInfo = res;
        })
        .catch(this.logout);
    },
    async logout() {
      const token = getToken();
      if (token) {
        await logout();
      }

      removeToken();
      this.account_id = '';
    },
  },
});
