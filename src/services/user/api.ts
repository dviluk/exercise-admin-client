// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/auth/me', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function logout(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/v1/auth/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
