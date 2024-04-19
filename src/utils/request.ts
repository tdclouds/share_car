import { message } from 'ant-design-vue';
import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '@/config';
import { useUserStore } from '@/store/user.ts';
import { getToken, removeToken } from '@/utils/auth.ts';

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.defaults.headers['Content-Type'] = 'application/json';

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  (error) => {
    if (!error.config.hideError) {
      message
        .error(error.response.data.message, 5, () => {
          if (error.response.status === 401) {
            removeToken();
            return useUserStore().logout();
          }
        })
        .then((r) => r);
    }
    return Promise.reject(error.response);
  },
);

interface customConfig extends AxiosRequestConfig {
  hideError?: boolean;
}

export default function request<T>(config: customConfig): Promise<T> {
  return instance.request(config);
}
