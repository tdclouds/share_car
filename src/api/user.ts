import { LocationQuery } from 'vue-router';
import request from '@/utils/request';

export async function githubLogin<T>(data: {
  code: string;
  state: string;
}): Promise<T> {
  return await request({
    url: '/api/auth/github',
    params: data,
  });
}

export async function getUserInfo<T>(): Promise<T> {
  return await request({
    url: '/api/user',
  });
}

export async function refreshToken<T>(): Promise<T> {
  return request({
    url: '/api/user/refresh/token',
    method: 'PUT',
  });
}

export async function logout() {
  return request({
    url: '/api/user/logout',
    method: 'DELETE',
  });
}

export async function getDiscourseSSO(data: LocationQuery) {
  return request<{
    token: string;
    expire_at: string;
  }>({
    url: '/api/oauth/discourse/sso',
    hideError: true,
    params: data,
    data: {},
  });
}
